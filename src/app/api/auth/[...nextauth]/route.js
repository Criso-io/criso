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

        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', formattedId)
          .single()

        if (!existingUser) {
          // Create new user if they don't exist
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: formattedId,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
            })

          if (createError) {
            console.error('Error creating user:', createError)
            return false
          }
        }

        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return false
      }
    },
    async session({ session, token }) {
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

          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', formattedId)
            .single()

          if (profile) {
            session.user.id = formattedId
            session.user.name = profile.name
          }
        } catch (error) {
          console.error('Session error:', error)
          session.user.id = token.sub
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.id = profile.id
      }
      return token
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 