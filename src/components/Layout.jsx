import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  User,
  MessageSquare,
  Mail,
  Users,
  Calendar,
  Search,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Bot
} from 'lucide-react'

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Messaging', href: '/messaging', icon: MessageSquare },
    { name: 'Mail & Info', href: '/mail', icon: Mail },
    { name: 'People You May Know', href: '/people', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Search & Filter', href: '/search', icon: Search },
    { name: 'Donations', href: '/donations', icon: Heart },
    { name: 'AI Bot', href: '/ai-bot', icon: Bot },
  ]

  const adminNavigation = [
    ...navigation,
    { name: 'Admin Dashboard', href: '/admin', icon: Settings }
  ]

  const currentNavigation = user?.role === 'admin' ? adminNavigation : navigation

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={currentNavigation} handleLogout={handleLogout} user={user} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <SidebarContent navigation={currentNavigation} handleLogout={handleLogout} user={user} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                    placeholder="Search alumni, events, or content..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user?.avatar}
                    alt={user?.name}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ navigation, handleLogout, user }) {
  const location = useLocation()

  return (
    <>
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-lg">AC</span>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-white font-semibold text-lg">Alumni Connect</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <img
              className="h-10 w-10 rounded-full"
              src={user?.avatar}
              alt={user?.name}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto p-2 text-gray-400 hover:text-gray-500"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  )
}

export default Layout















