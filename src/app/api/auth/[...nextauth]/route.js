import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with the service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const { data: supabaseUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          email_verified: true,
          user_metadata: {
            name: user.name,
            avatar_url: user.image,
            github_username: profile.login,
          },
          password: crypto.randomUUID(),
        });

        if (createAuthError && createAuthError.message !== 'User already registered') {
          return false;
        }

        const userId = supabaseUser?.user?.id;
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('id', userId)
          .single();

        if (!existingUser) {
          const { error: createError } = await supabaseAdmin
            .from('users')
            .insert({
              id: userId,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              github_username: profile.login,
            });

          if (createError) return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        try {
          const { data: profile } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (profile) {
            session.user.id = profile.id;
            session.user.name = profile.name;
          }
        } catch (error) {
          // Silent fail - will just return session without extra data
        }
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubUsername = profile.login;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 