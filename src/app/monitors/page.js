'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Monitors() {
  const router = useRouter()
  const { data: session } = useSession()
  const [monitors, setMonitors] = useState(null)

  useEffect(() => {
    async function fetchMonitors() {
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

    fetchMonitors()
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
          <div
            key={monitor.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{monitor.name}</h3>
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  monitor.last_status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {monitor.last_status ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{monitor.url}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>Every {monitor.frequency} minutes</span>
              {monitor.last_response_time && (
                <span>{monitor.last_response_time}ms</span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Last checked: {monitor.last_check_at 
                  ? new Date(monitor.last_check_at).toLocaleString() 
                  : 'Never'}
              </span>
              <button
                onClick={() => {/* Add edit functionality */}}
                className="text-sm text-gray-600 hover:text-black"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 