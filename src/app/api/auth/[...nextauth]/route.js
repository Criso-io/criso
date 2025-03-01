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
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('Starting signIn callback', { 
        userId: user.id,
        email: user.email,
        profile: profile 
      });

      try {
        // First, create or get user in Supabase auth
        const { data: supabaseUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          email_verified: true,
          user_metadata: {
            name: user.name,
            avatar_url: user.image,
            github_username: profile.login,
          },
          password: crypto.randomUUID(), // Required random password
        });

        if (createAuthError && createAuthError.message !== 'User already registered') {
          console.error('Error creating Supabase auth user:', createAuthError);
          return false;
        }

        // The user ID from Supabase auth
        const userId = supabaseUser?.user?.id;
        console.log('Supabase auth user ID:', userId);

        // Now check if user exists in public.users table
        const { data: existingUser, error: checkError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('id', userId)
          .single();

        if (checkError) {
          console.log('Error checking existing user:', checkError);
        }

        if (!existingUser) {
          console.log('Creating new user in public.users');

          // Create new user in public.users table
          const { error: createError } = await supabaseAdmin
            .from('users')
            .insert({
              id: userId, // Use the Supabase auth user ID
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              github_username: profile.login,
            });

          if (createError) {
            console.error('Error creating user:', createError);
            return false;
          }

          console.log('Successfully created user');
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      console.log('Session callback', { session, token });

      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (profileError) {
            console.log('Error fetching profile:', profileError);
          }

          if (profile) {
            session.user.id = profile.id;
            session.user.name = profile.name;
          }
        } catch (error) {
          console.error('Session error:', error);
        }
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      console.log('JWT callback', { token, account, profile });

      if (account && profile) {
        token.githubUsername = profile.login;
      }
      return token;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 