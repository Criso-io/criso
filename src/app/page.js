import { SignInButton } from '../components/auth/sign-in-button'
import { GetStartedButton } from '../components/get-started-button'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession()
  
  if (session) {
    redirect('/monitors')
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 relative overflow-hidden">
      {/* Content */}
      <div className="relative w-full">
        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-6xl mx-auto grid grid-cols-[1fr,minmax(auto,1280px),1fr] px-4">
            <div className="border-r border-gray-200" />
            <div>
              {/* Navbar */}
              <nav className="relative w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center">
                  <Link href="/"><Image src="/logo.svg" alt="criso" width={100} height={30} priority className="h-7 w-auto" /></Link>
                </div>
                
                <div className="hidden md:flex items-center space-x-12">
                  <a href="#features" className="text-sm font-medium text-gray-900 hover:text-black transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all">Features</a>
                  <a href="#pricing" className="text-sm font-medium text-gray-900 hover:text-black transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all">Pricing</a>
                  <a href="/docs" className="text-sm font-medium text-gray-900 hover:text-black transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all">Docs</a>
                </div>

                <SignInButton />
              </nav>

              {/* Hero Content */}
              <div className="relative w-full max-w-5xl mx-auto px-6 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  {/* Left Column - Content */}
                  <div className="text-left">
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-8">
                      Simple API & Web Monitoring
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                      Monitor performance, detect errors, and track global availability knowing issues before your users.
                    </p>
                    <GetStartedButton />
                  </div>

                  {/* Right Column - Preview */}
                  <div className="relative mt-10 pl-32">
                    <div className="group relative">
                      {/* Back Card */}
                      <div className="absolute inset-0 -translate-y-12 -translate-x-16 scale-[0.90] origin-bottom-left transition-all duration-300 group-hover:-translate-x-20 group-hover:-translate-y-16 group-hover:rotate-[-16deg] rotate-[-12deg]">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 transform rotate-3">
                          <div className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full ring-4 ring-red-50"></div>
                                <h3 className="text-lg font-semibold text-gray-900">status.acme.com</h3>
                              </div>
                              <div className="flex items-center">
                                <span className="px-3 py-0.5 text-xs bg-red-50 text-red-600 rounded-full uppercase font-bold tracking-wider">
                                  Down
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Response Time</span>
                                <div className="flex items-baseline space-x-1 mr-2">
                                  <span className="font-medium text-gray-900">502</span>
                                  <span className="text-xs text-gray-500">ms</span>
                                </div>
                              </div>
                              <div className="relative h-24 overflow-hidden -mx-6 mt-4 mb-[-40px]">
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                                  <path 
                                    d="M0,60 C40,62 70,58 90,60 L95,80 L100,60 C140,62 170,58 190,60 L195,90 L200,60 C240,62 270,58 290,60 L295,100 L300,60 C350,62 400,58 500,60" 
                                    className="stroke-red-600 stroke-[4] fill-none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Card */}
                      <div className="absolute inset-0 -translate-y-6 -translate-x-8 scale-[0.95] origin-bottom-left transition-all duration-300 group-hover:-translate-x-10 group-hover:-translate-y-8 group-hover:rotate-[-8deg] rotate-[-6deg]">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 transform rotate-2">
                          <div className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-50"></div>
                                <h3 className="text-lg font-semibold text-gray-900">api.acme.com</h3>
                              </div>
                              <div className="flex items-center">
                                <span className="px-3 py-0.5 text-xs bg-green-50 text-green-600 rounded-full uppercase font-bold tracking-wider">
                                  Healthy
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Response Time</span>
                                <div className="flex items-baseline space-x-1 mr-2">
                                  <span className="font-medium text-gray-900">124</span>
                                  <span className="text-xs text-gray-500">ms</span>
                                </div>
                              </div>
                              <div className="relative h-24 overflow-hidden -mx-6 mt-4 mb-[-40px]">
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                                  <path 
                                    d="M0,60 C40,62 70,58 90,60 L95,50 L100,60 C140,62 170,58 190,60 L195,45 L200,60 C240,62 270,58 290,60 L295,40 L300,60 C350,62 400,58 500,60" 
                                    className="stroke-green-600 stroke-[4] fill-none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Front Card */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg relative rotate-3 group-hover:translate-x-4 group-hover:rotate-6">
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full ring-4 ring-yellow-50"></div>
                              <h3 className="text-lg font-semibold text-gray-900">acme.com</h3>
                            </div>
                            <div className="flex items-center">
                              <span className="px-3 py-0.5 text-xs bg-yellow-50 text-yellow-600 rounded-full uppercase font-bold tracking-wider">
                                Degraded
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-500">Response Time</span>
                              <div className="flex items-baseline space-x-1 mr-2">
                                <span className="font-medium text-gray-900">287</span>
                                <span className="text-xs text-gray-500">ms</span>
                              </div>
                            </div>
                            <div className="relative h-24 overflow-hidden -mx-6 mt-4 mb-[-40px]">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                                <path 
                                  d="M0,60 C40,62 70,58 90,60 L95,20 L100,60 C140,62 170,58 190,60 L195,35 L200,60 C240,62 270,58 290,60 L295,15 L300,60 C350,62 400,58 500,60" 
                                  className="stroke-indigo-600 stroke-[4] fill-none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l border-gray-200" />
          </div>
        </div>

        {/* Features Section */}
        <div className="relative mt-4 border-t border-b border-gray-200">
          <div id="features" className="relative w-full">
            <div className="max-w-6xl mx-auto grid grid-cols-[1fr,minmax(auto,1280px),1fr] px-4">
              <div className="border-r border-gray-200 my-4" />
              <div className="py-24 px-6">
                <div className="text-center mt-[-20px] mb-16">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
                    Start monitoring in minutes
                  </h2>
                  <p className="text-lg text-gray-600">
                    Set up your first monitor in less than 5 minutes. No complex configuration needed.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="font-mono text-lg font-medium text-gray-700">01</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
                    <p className="text-gray-600">Get instant notifications when your services experience downtime or performance issues.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="font-mono text-lg font-medium text-gray-700">02</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Simple Setup</h3>
                    <p className="text-gray-600">Set up monitoring for your websites and APIs in minutes, not hours.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="font-mono text-lg font-medium text-gray-700">03</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
                    <p className="text-gray-600">Track uptime, response times, and performance metrics with beautiful dashboards.</p>
                  </div>
                </div>
              </div>
              <div className="border-l border-gray-200 my-4" />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="relative">
          <div className="max-w-6xl mx-auto grid grid-cols-[1fr,minmax(auto,1280px),1fr] px-4">
            <div className="border-r border-gray-200 my-4" />
            <div>
              <footer className="relative w-full max-w-5xl mx-auto px-6 py-12">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                    <span className="text-sm text-gray-600">© 2024 Drill Software Limited. All rights reserved.</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
                  </div>
                </div>
              </footer>
            </div>
            <div className="border-l border-gray-200 my-4" />
          </div>
        </div>
      </div>
    </main>
  )
} 