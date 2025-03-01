'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MonitorCard } from '@/components/monitor-card'

export default function Monitors() {
  const router = useRouter()
  const { data: session } = useSession()
  const [monitors, setMonitors] = useState(null)

  const fetchMonitors = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/monitors')
      if (!response.ok) throw new Error('Failed to fetch monitors')
      const data = await response.json()
      setMonitors(data)
    } catch (error) {
      console.error('Error fetching monitors:', error)
      setMonitors([])
    }
  }

  useEffect(() => {
    fetchMonitors()

    // Set up polling for real-time updates
    const interval = setInterval(fetchMonitors, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [session])

  if (monitors === null) {
    return null
  }

  if (monitors.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="h-12 w-12 text-gray-400 mb-4">
            {/* Icon placeholder */}
          </div>
          <h3 className="text-sm font-medium text-gray-900">No monitors</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating a new monitor.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openNewMonitorModal'))}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
            >
              <span className="mr-2">+</span> Create monitor
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {monitors.map((monitor) => (
          <MonitorCard key={monitor.id} monitor={monitor} />
        ))}
      </div>
    </div>
  )
} 