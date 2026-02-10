import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  Bell,
  Search,
  Plus,
  Filter,
  Star,
  MapPin,
  GraduationCap,
  Building,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    connections: 0,
    events: 0,
    messages: 0,
    donations: 0
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'connection',
      message: 'You connected with Dr. Sarah Johnson',
      time: '2 hours ago',
      icon: Users
    },
    {
      id: 2,
      type: 'event',
      message: 'Alumni Reunion 2024 is coming up',
      time: '1 day ago',
      icon: Calendar
    },
    {
      id: 3,
      type: 'message',
      message: 'New message from Mike Chen',
      time: '2 days ago',
      icon: MessageSquare
    },
    {
      id: 4,
      type: 'donation',
      message: 'Thank you for your donation to the Scholarship Fund',
      time: '3 days ago',
      icon: Heart
    }
  ])

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'Alumni Reunion 2024',
      date: '2024-03-15',
      location: 'University Campus',
      attendees: 247,
      maxAttendees: 500,
      category: 'Social'
    },
    {
      id: 2,
      title: 'Tech Talk: AI in Healthcare',
      date: '2024-03-20',
      location: 'Virtual',
      attendees: 89,
      maxAttendees: 200,
      category: 'Educational'
    },
    {
      id: 3,
      title: 'Career Development Workshop',
      date: '2024-03-25',
      location: 'Career Center',
      attendees: 32,
      maxAttendees: 50,
      category: 'Professional'
    }
  ])

  const [suggestedConnections, setSuggestedConnections] = useState([
    {
      id: 1,
      name: 'Dr. Emily Rodriguez',
      title: 'Senior Software Engineer at Google',
      department: 'Computer Science',
      graduationYear: '2015',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      mutualConnections: 12
    },
    {
      id: 2,
      name: 'James Wilson',
      title: 'Investment Banker at Goldman Sachs',
      department: 'Business Administration',
      graduationYear: '2018',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      mutualConnections: 8
    },
    {
      id: 3,
      name: 'Lisa Park',
      title: 'Product Manager at Microsoft',
      department: 'Engineering',
      graduationYear: '2020',
      location: 'Seattle, WA',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      mutualConnections: 15
    }
  ])

  useEffect(() => {
    // Simulate loading stats
    setStats({
      connections: 156,
      events: 8,
      messages: 23,
      donations: 5
    })
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-primary-100 mt-1">
              Welcome back to your alumni dashboard
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-primary-200">Last active</p>
              <p className="font-medium">2 hours ago</p>
            </div>
            <div className="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Connections</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.connections}</p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12 this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.events}</p>
              <div className="flex items-center text-sm text-blue-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>3 this week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Messages</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.messages}</p>
              <div className="flex items-center text-sm text-purple-600">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>5 unread</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Donations Made</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.donations}</p>
              <div className="flex items-center text-sm text-red-600">
                <Heart className="w-4 h-4 mr-1" />
                <span>$2,500 total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </button>
          </div>
          <div className="space-y-4">
              {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-gray-600" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
              </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </button>
          </div>
          <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(event.date)}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {event.attendees}/{event.maxAttendees} attendees
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {event.category}
                    </span>
                  </div>
                </div>
              ))}
              </div>
          </div>
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">People You May Know</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedConnections.map((person) => (
            <div key={person.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <img
                  className="h-12 w-12 rounded-full"
                  src={person.avatar}
                  alt={person.name}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{person.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{person.title}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    <span>{person.department} • {person.graduationYear}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{person.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {person.mutualConnections} mutual connections
                    </span>
                    <button className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Search className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Search People</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Plus className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Create Event</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <MessageSquare className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Send Message</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Heart className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Make Donation</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard