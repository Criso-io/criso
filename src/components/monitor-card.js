import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

export function MonitorCard({ monitor }) {
  const [showDetails, setShowDetails] = useState(false)
  const [checks, setChecks] = useState(null)

  const fetchChecks = async () => {
    if (!showDetails || checks) return
    
    try {
      const response = await fetch(`/api/monitors/${monitor.id}/checks`)
      if (!response.ok) throw new Error('Failed to fetch checks')
      const data = await response.json()
      setChecks(data)
    } catch (error) {
      console.error('Error fetching checks:', error)
      setChecks([])
    }
  }

  const handleToggleDetails = () => {
    setShowDetails(!showDetails)
    fetchChecks()
  }

  const getStatusColor = (status) => {
    if (status === null) return 'gray'
    return status ? 'green' : 'red'
  }

  const color = getStatusColor(monitor.last_status)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 bg-${color}-500 rounded-full ring-4 ring-${color}-50`}></div>
          <h3 className="text-lg font-medium text-gray-900">{monitor.name}</h3>
        </div>
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            monitor.last_status === null
              ? 'bg-gray-100 text-gray-800'
              : monitor.last_status
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {monitor.last_status === null ? 'Pending' : monitor.last_status ? 'Online' : 'Offline'}
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
          {monitor.last_check_at
            ? `Last checked ${formatDistanceToNow(new Date(monitor.last_check_at))} ago`
            : 'Never checked'}
        </span>
        <button
          onClick={handleToggleDetails}
          className="text-sm text-gray-600 hover:text-black"
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Checks</h4>
          {!checks ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : checks.length === 0 ? (
            <p className="text-sm text-gray-500">No checks recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {checks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full bg-${check.status ? 'green' : 'red'}-500`}></div>
                    <span className={`text-${check.status ? 'green' : 'red'}-600`}>
                      {check.status ? 'Success' : 'Failed'}
                    </span>
                    {check.status_code && (
                      <span className="text-gray-500">({check.status_code})</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">{check.response_time}ms</span>
                    <span className="text-gray-400">
                      {formatDistanceToNow(new Date(check.checked_at))} ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 