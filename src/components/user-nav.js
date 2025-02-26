'use client'

import { signOut } from 'next-auth/react'
import { ChevronDownIcon } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserNav({ user }) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center space-x-3 hover:bg-gray-100 rounded-md p-1.5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.full_name || 'User avatar'}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user.full_name ? user.full_name[0] : 'U'}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 flex-1 text-left">{user.name || 'User'}</span>
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => signOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 