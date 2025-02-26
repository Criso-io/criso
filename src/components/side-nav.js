'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MonitorsIcon, SettingsIcon } from '@/components/icons'
import { useSession } from 'next-auth/react'
import { UserNav } from './user-nav'

const navigation = [
  {
    name: 'Monitors',
    href: '/monitors',
    icon: MonitorsIcon
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: SettingsIcon
  }
]

export function SideNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200">
      <div className="px-4 py-4">
        <UserNav user={session?.user} />
      </div>
      <nav className="flex-1 px-2 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-2 h-6 w-6',
                  isActive ? 'text-gray-900' : 'text-gray-600'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
} 