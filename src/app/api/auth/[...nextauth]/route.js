import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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
      if (account.provider === 'github') {
        try {
          // First, create or get user in Supabase auth.users
          const { data: supabaseUser, error: supabaseError } = await supabase.auth.admin.createUser({
            email: profile.email,
            email_verified: true,
            user_metadata: {
              full_name: profile.name,
              avatar_url: profile.avatar_url,
              github_username: profile.login,
            },
          });

          if (supabaseError && supabaseError.message !== 'User already registered') {
            console.error('Error creating Supabase user:', supabaseError);
            return false;
          }

          // If successful or user exists, update the user's metadata
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            supabaseUser?.id || user.id,
            {
              user_metadata: {
                full_name: profile.name,
                avatar_url: profile.avatar_url,
                github_username: profile.login,
              },
            }
          );

          if (updateError) {
            console.error('Error updating user metadata:', updateError);
            return false;
          }

          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, user, token }) {
      // Add the user's Supabase ID to the session
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubUsername = profile.login;
      }
      return token;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 