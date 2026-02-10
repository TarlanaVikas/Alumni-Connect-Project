import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Filter,
  Search,
  Download,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  UserPlus,
  UserMinus,
  Shield,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building,
  X,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc
} from 'lucide-react'

function AdminDashboard() {
  const { user } = useAuth()
  const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5175'
  
  // Redirect non-admin users
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  const downloadFile = (filename, content, type = 'application/json') => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleExportData = () => {
    const exportPayload = {
      generatedAt: new Date().toISOString(),
      stats,
      users,
      events,
      donations
    }
    downloadFile('admin-export.json', JSON.stringify(exportPayload, null, 2))
  }

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalAlumni: 0,
    totalStudents: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalDonations: 0,
    monthlyDonations: 0,
    messagesSent: 0,
    newMessages: 0
  })

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'user_registration',
      user: 'Sarah Johnson',
      action: 'registered',
      timestamp: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'event_creation',
      user: 'Mike Chen',
      action: 'created event "Tech Talk"',
      timestamp: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'donation',
      user: 'Emily Rodriguez',
      action: 'donated $500 to Scholarship Fund',
      timestamp: '6 hours ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'message',
      user: 'David Kim',
      action: 'sent message to admin',
      timestamp: '8 hours ago',
      status: 'pending'
    }
  ])

  const [users, setUsers] = useState([])

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Annual Alumni Reunion',
      organizer: 'Alumni Association',
      date: '2024-03-15',
      attendees: 247,
      maxAttendees: 500,
      status: 'active',
      category: 'social'
    },
    {
      id: 2,
      title: 'Tech Talk: AI in Healthcare',
      organizer: 'Tech Alumni Group',
      date: '2024-03-20',
      attendees: 89,
      maxAttendees: 200,
      status: 'active',
      category: 'educational'
    },
    {
      id: 3,
      title: 'Career Development Workshop',
      organizer: 'Career Services',
      date: '2024-03-25',
      attendees: 32,
      maxAttendees: 50,
      status: 'pending',
      category: 'professional'
    }
  ])

  const [donations, setDonations] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    ;(async () => {
      try {
        const [usersRes, donationsRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/api/admin/donations`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/api/events`)
        ])
        if (usersRes.ok) setUsers(await usersRes.json())
        if (donationsRes.ok) setDonations(await donationsRes.json())
        if (eventsRes.ok) setEvents(await eventsRes.json())
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  useEffect(() => {
    // Live metrics via SSE
    const es = new EventSource(`${API_BASE}/api/metrics/sse`)
    const apply = (data) => {
      setStats(prev => ({
        ...prev,
        totalUsers: data.users,
        totalEvents: data.events,
        upcomingEvents: data.upcomingEvents,
        totalDonations: data.totalDonations,
        monthlyDonations: data.monthlyDonations,
        messagesSent: data.messagesSent,
        newMessages: data.newMessages
      }))
    }
    es.onmessage = (e) => apply(JSON.parse(e.data))
    es.addEventListener('snapshot', (e) => apply(JSON.parse(e.data)))
    es.onerror = () => {}
    return () => es.close()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: Activity }
  ]

  // User management functions
  const handleCreateUser = () => {
    setEditingUser(null)
    setShowUserModal(true)
  }

  // Event management
  const handleCreateEvent = () => {
    const title = window.prompt('Enter event title')
    if (!title) return
    const newEvent = {
      id: Date.now(),
      title,
      organizer: 'Admin',
      date: new Date().toISOString().slice(0, 10),
      attendees: 0,
      maxAttendees: 100,
      status: 'pending',
      category: 'social'
    }
    setEvents([newEvent, ...events])
  }

  const handleEditEvent = (event) => {
    const title = window.prompt('Update event title', event.title)
    if (!title) return
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, title } : e))
  }

  const handleDeleteEvent = (eventId) => {
    if (!window.confirm('Delete this event?')) return
    setEvents(prev => prev.filter(e => e.id !== eventId))
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowUserModal(true)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
      setShowBulkActions(false)
    }
  }

  const handleBulkRoleChange = (newRole) => {
    setUsers(users.map(user => 
      selectedUsers.includes(user.id) ? { ...user, role: newRole } : user
    ))
    setSelectedUsers([])
    setShowBulkActions(false)
  }

  const handleBulkStatusChange = (newStatus) => {
    setUsers(users.map(user => 
      selectedUsers.includes(user.id) ? { ...user, status: newStatus } : user
    ))
    setSelectedUsers([])
    setShowBulkActions(false)
  }

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.department.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (sortField === 'name') {
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration': return <Users className="w-4 h-4 text-green-500" />
      case 'event_creation': return <Calendar className="w-4 h-4 text-blue-500" />
      case 'donation': return <DollarSign className="w-4 h-4 text-purple-500" />
      case 'message': return <MessageSquare className="w-4 h-4 text-orange-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your alumni platform</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button onClick={handleExportData} className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+{stats.newUsers} this month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Alumni</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalAlumni.toLocaleString()}</p>
                  <div className="flex items-center text-sm text-blue-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>68% of total</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Students</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-gray-500">Total Events</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
                  <div className="flex items-center text-sm text-blue-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{stats.upcomingEvents} upcoming</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Donations</p>
                  <p className="text-2xl font-semibold text-gray-900">${stats.totalDonations.toLocaleString()}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+${stats.monthlyDonations.toLocaleString()} this month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Messages Sent</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.messagesSent.toLocaleString()}</p>
                  <div className="flex items-center text-sm text-blue-600">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span>{stats.newMessages} new</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
              <div className="h-64 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="https://quickchart.io/chart?c={type:'bar',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:'Users',data:[120,190,300,500,200,300],backgroundColor:'rgba(59,130,246,0.5)'}]}}&w=600&h=300" 
                  alt="User Growth Chart" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="https://quickchart.io/chart?c={type:'pie',data:{labels:['Education','Emergency','Research','Other'],datasets:[{data:[40,25,20,15],backgroundColor:['#3b82f6','#10b981','#f59e0b','#ef4444']}]}}&w=400&h=300" 
                  alt="Donation Trends Chart" 
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status === 'success' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Management Header */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage students and alumni accounts</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleCreateUser}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Roles</option>
                <option value="alumni">Alumni</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <button 
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Bulk Actions</span>
              </button>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && selectedUsers.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedUsers.length} user(s) selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBulkRoleChange('alumni')}
                        className="btn-sm bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        Make Alumni
                      </button>
                      <button
                        onClick={() => handleBulkRoleChange('student')}
                        className="btn-sm bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Make Student
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange('active')}
                        className="btn-sm bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange('inactive')}
                        className="btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>User</span>
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Role</span>
                        {sortField === 'role' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graduation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {user.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'alumni' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'student' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.role === 'alumni' && <GraduationCap className="w-3 h-3 mr-1" />}
                          {user.role === 'student' && <Building className="w-3 h-3 mr-1" />}
                          {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {user.status === 'inactive' && <X className="w-3 h-3 mr-1" />}
                          {user.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.graduationYear}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="More Options">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex items-center space-x-2">
                <button className="btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Previous
                </button>
                <button className="btn-sm bg-primary-600 text-white hover:bg-primary-700">
                  1
                </button>
                <button className="btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                  2
                </button>
                <button className="btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Event Management</h3>
              <button onClick={handleCreateEvent} className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">Organized by {event.organizer}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{event.date}</span>
                      <span>{event.attendees}/{event.maxAttendees} attendees</span>
                      <span className="capitalize">{event.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => alert(JSON.stringify(event, null, 2))} className="text-primary-600 hover:text-primary-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEditEvent(event)} className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Donation Management</h3>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select className="input-field">
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{donation.donor}</h4>
                    <p className="text-sm text-gray-600">{donation.campaign}</p>
                    <p className="text-sm text-gray-500">{donation.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">${donation.amount.toLocaleString()}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Management</h3>
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Message Center</h4>
              <p className="text-gray-600">Manage user messages and communications</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Analytics</h3>
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h4>
              <p className="text-gray-600">Detailed analytics and insights coming soon</p>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={editingUser?.name || ''}
                      className="input-field w-full"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      defaultValue={editingUser?.email || ''}
                      className="input-field w-full"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      defaultValue={editingUser?.role || 'student'}
                      className="input-field w-full"
                    >
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      defaultValue={editingUser?.status || 'active'}
                      className="input-field w-full"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      defaultValue={editingUser?.department || ''}
                      className="input-field w-full"
                      placeholder="Enter department"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      defaultValue={editingUser?.graduationYear || ''}
                      className="input-field w-full"
                      placeholder="Enter graduation year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue={editingUser?.phone || ''}
                      className="input-field w-full"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      defaultValue={editingUser?.location || ''}
                      className="input-field w-full"
                      placeholder="Enter location"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    defaultValue={editingUser?.bio || ''}
                    rows={3}
                    className="input-field w-full"
                    placeholder="Enter bio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    defaultValue={editingUser?.skills?.join(', ') || ''}
                    className="input-field w-full"
                    placeholder="Enter skills separated by commas"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      defaultValue={editingUser?.socialLinks?.linkedin || ''}
                      className="input-field w-full"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      defaultValue={editingUser?.socialLinks?.twitter || ''}
                      className="input-field w-full"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingUser ? 'Update User' : 'Create User'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

