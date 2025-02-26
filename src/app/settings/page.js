'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Settings() {
  const { data: session, update: updateSession } = useSession()
  const [name, setName] = useState(session?.user?.name|| '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: name,
        },
      })

    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Profile Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-6">
          <h2 className="text-base font-medium text-gray-900">Profile Picture</h2>
          <p className="text-sm text-gray-500 mt-1">This is your GitHub avatar.</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="text-sm text-gray-500">
              Your profile picture is automatically synced with GitHub
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900">Personal Information</h2>
          <p className="text-sm text-gray-500 mt-1">Update your personal information.</p>
          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full py-2 px-3 text-gray-800 rounded-md border border-gray-200 shadow-sm outline-none focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="block w-full py-2 px-3 rounded-md border-gray-300 bg-gray-50 text-gray-500 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Your email is managed through GitHub.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <h2 className="text-base font-medium text-red-600">Danger Zone</h2>
          <p className="text-sm text-gray-500 mt-1">
            Permanently delete your account and all of its contents.
          </p>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 