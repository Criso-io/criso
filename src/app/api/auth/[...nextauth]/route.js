import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { supabase } from '@/lib/supabase'

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
        // Convert GitHub ID to UUID format
        const userId = user.id.toString().padStart(32, '0')
        const formattedId = [
          userId.slice(0, 8),
          userId.slice(8, 12),
          userId.slice(12, 16),
          userId.slice(16, 20),
          userId.slice(20, 32)
        ].join('-')

        console.log('Formatted UUID:', formattedId);

        // Check if user exists
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('id', formattedId)
          .single()

        if (checkError) {
          console.log('Error checking existing user:', checkError);
        }

        console.log('Existing user check:', { existingUser });

        if (!existingUser) {
          console.log('Creating new user with data:', {
            id: formattedId,
            email: user.email,
            name: user.name,
            avatar_url: user.image,
          });

          // Create new user if they don't exist
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: formattedId,
              email: user.email,
              full_name: user.name,
              avatar_url: user.image,
            })

          if (createError) {
            console.error('Error creating user:', createError)
            return false
          }

          console.log('Successfully created user');
        }

        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return false
      }
    },
    async session({ session, token }) {
      console.log('Session callback', { session, token });

      if (session?.user) {
        try {
          // Convert GitHub ID to UUID format
          const userId = token.sub.toString().padStart(32, '0')
          const formattedId = [
            userId.slice(0, 8),
            userId.slice(8, 12),
            userId.slice(12, 16),
            userId.slice(16, 20),
            userId.slice(20, 32)
          ].join('-')

          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', formattedId)
            .single()

          if (profileError) {
            console.log('Error fetching profile:', profileError);
          }

          if (profile) {
            session.user.id = formattedId
            session.user.name = profile.full_name
          }
        } catch (error) {
          console.error('Session error:', error)
          session.user.id = token.sub
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      console.log('JWT callback', { token, account, profile });

      if (account) {
        token.id = profile.id
      }
      return token
    },
  },
  debug: true, // Enable debug logs
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 