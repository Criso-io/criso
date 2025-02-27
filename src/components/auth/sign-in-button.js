'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function SignInButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="group relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-800 text-white h-9 px-4 py-2 hover:bg-gradient-to-b hover:from-gray-800 hover:to-gray-700"
      >
        <span className="relative z-10">Sign out</span>
        <div className="absolute inset-[-2px] rounded-md border border-gray-700 opacity-0 transition-all group-hover:opacity-100" />
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push('/signin')}
      className="group relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-800 text-white h-9 px-4 py-2 hover:bg-gradient-to-b hover:from-gray-800 hover:to-gray-700"
    >
      <span className="relative z-10">Sign in</span>
      <div className="absolute inset-[-2px] rounded-md border border-gray-700 opacity-0 transition-all group-hover:opacity-100" />
    </button>
  );
} 