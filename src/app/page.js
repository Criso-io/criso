import { SignInButton } from '../components/auth/sign-in-button'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession()
  
  if (session) {
    redirect('/monitors')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Glimp</h1>
        <p className="text-xl mb-4">Monitor your websites and APIs with ease</p>
        <SignInButton />
      </div>
    </main>
  )
} 