'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'

export default function SignIn() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image 
              src="/icon.svg" 
              alt="criso" 
              width={40} 
              height={40} 
              className="mx-auto" 
              priority
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get started now. No credit card required.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn('github', { callbackUrl: '/monitors' })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Sign in with GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-900">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-gray-900">Privacy Policy</a>
        </p>
      </div>
    </main>
  )
} 