'use client'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { SideNav } from '@/components/side-nav'
import Link from 'next/link'
import { useState } from 'react'
import { NewMonitorModal } from '@/components/modals/new-monitor-modal'

export default function MonitorsLayout({ children }) {
  const [showNewMonitorModal, setShowNewMonitorModal] = useState(false)

  return (
    <div className="flex h-screen">
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Monitors</h1>
              <p className="text-sm text-gray-500 mt-1">
                Create and manage monitors to track your websites and APIs.
              </p>
            </div>
            <button 
              onClick={() => setShowNewMonitorModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create monitor
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          {children}
        </main>
      </div>

      <NewMonitorModal 
        open={showNewMonitorModal} 
        onOpenChange={setShowNewMonitorModal}
      />
    </div>
  )
} 