import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { SideNav } from '@/components/side-nav'

async function SettingsLayout({ children }) {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/')
  }

  return (
    <div className="flex h-screen">
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your Glimp account.
              </p>
            </div>
          </div>
        </header>


        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default SettingsLayout 