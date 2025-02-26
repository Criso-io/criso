'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800"
    >
      Sign In with GitHub
    </button>
  );
} 