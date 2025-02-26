'use client'

import { useState, useEffect, useRef } from 'react'

export function NewMonitorModal({ open, onOpenChange, onSuccess }) {
  const dialogRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    frequency: '5',
  })

  useEffect(() => {
    const handleOpenModal = () => onOpenChange(true)
    window.addEventListener('openNewMonitorModal', handleOpenModal)
    return () => window.removeEventListener('openNewMonitorModal', handleOpenModal)
  }, [onOpenChange])

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && dialog && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog?.open) {
      dialog.close()
    }
  }, [open])

  const handleClose = (e) => {
    e?.preventDefault()
    if (dialogRef.current?.open) {
      onOpenChange(false)
      dialogRef.current.close()
    }
  }

  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/monitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          active: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create monitor')
      }

      onSuccess?.()
      handleClose()
    } catch (error) {
      console.error('Error creating monitor:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-transparent"
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-50" onClick={handleModalClick}>
        <h3 className="text-lg font-medium text-gray-900">New Monitor</h3>
        <p className="mt-2 text-sm text-gray-500">
          Create a new monitor to track your website's uptime.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full py-2 px-3 text-gray-800 rounded-md border border-gray-200 shadow-sm outline-none focus:border-black focus:ring-black sm:text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              URL
            </label>
            <input
              type="url"
              id="url"
              required
              className="mt-1 block w-full py-2 px-3 text-gray-800 rounded-md border border-gray-200 shadow-sm outline-none focus:border-black focus:ring-black sm:text-sm"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Check Frequency
            </label>
            <select
              id="frequency"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            >
              <option value="1">Every minute</option>
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every hour</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-5000"
            >
              {loading ? 'Creating...' : 'Create Monitor'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
} 