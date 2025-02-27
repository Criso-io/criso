'use client';

import { useRouter } from 'next/navigation';

export function GetStartedButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push('/signin')}
      className="group relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-800 text-white h-9 px-4 py-2 hover:bg-gradient-to-b hover:from-gray-800 hover:to-gray-700"
    >
      <span className="relative z-10">Get started</span>
      <div className="absolute inset-[-2px] rounded-md border border-gray-700 opacity-0 transition-all group-hover:opacity-100" />
    </button>
  );
} 