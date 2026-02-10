import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Mail, 
  Send, 
  Inbox, 
  Star, 
  Archive, 
  Trash2, 
  Search, 
  Filter,
  Plus,
  Reply,
  Forward,
  MoreVertical,
  Paperclip,
  Calendar,
  Users,
  Bell,
  Heart,
  Briefcase,
  X
} from 'lucide-react'

function MailInfo() {
  const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5175'
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('inbox')
  const [selectedMail, setSelectedMail] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [composeTemplate, setComposeTemplate] = useState('')

  const [mails, setMails] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/mail`)
        const data = await res.json()
        // Add role-specific example mails to the top
        const roleMails = (() => {
          if (user?.role === 'student') {
            return [
              { id: 'rs1', from: 'Alumni Mentor Program', subject: 'Mentorship Match Found', preview: 'We found a mentor that matches your interests...', timestamp: Date.now() - 1800000, read: 0, starred: 0, archived: 0, attachments: 0, category: 'career' },
              { id: 'rs2', from: 'Career Center', subject: 'Internship Fair This Friday', preview: 'Join us for the internship fair with 30+ companies...', timestamp: Date.now() - 3600000, read: 0, starred: 0, archived: 0, attachments: 1, category: 'event' }
            ]
          }
          if (user?.role === 'admin') {
            return [
              { id: 'ra1', from: 'System Notifications', subject: 'Weekly Platform Stats', preview: 'Here is the weekly usage report for the alumni platform...', timestamp: Date.now() - 5400000, read: 1, starred: 1, archived: 0, attachments: 1, category: 'news' },
              { id: 'ra2', from: 'University Foundation', subject: 'Donation Campaign Update', preview: 'The scholarship fund reached a new milestone...', timestamp: Date.now() - 7200000, read: 0, starred: 0, archived: 0, attachments: 0, category: 'donation' }
            ]
          }
          // alumni
          return [
            { id: 'ra3', from: 'Alumni Association', subject: 'Networking Mixer Invite', preview: 'Connect with fellow alumni this weekend...', timestamp: Date.now() - 2700000, read: 0, starred: 0, archived: 0, attachments: 0, category: 'event' },
            { id: 'ra4', from: 'Career Services', subject: 'Mentor a Student', preview: 'Give back by mentoring current students...', timestamp: Date.now() - 8100000, read: 1, starred: 0, archived: 0, attachments: 0, category: 'career' }
          ]
        })()

        setMails([...roleMails, ...data].map(m => ({
          ...m,
          timestamp: new Date(m.timestamp).toLocaleString()
        })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Alumni Portal Features',
      content: 'We\'ve added new features to help you connect with fellow alumni and stay updated with university news.',
      timestamp: '1 day ago',
      type: 'update',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Upcoming Events This Month',
      content: 'Don\'t miss out on our exciting lineup of events including networking mixers, career workshops, and social gatherings.',
      timestamp: '3 days ago',
      type: 'event',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Scholarship Fund Reaches $100K',
      content: 'Thanks to generous donations from our alumni community, we\'ve reached a milestone of $100,000 in our scholarship fund.',
      timestamp: '1 week ago',
      type: 'achievement',
      priority: 'high'
    }
  ])

  const filteredMails = mails.filter(mail => {
    const matchesSearch = mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mail.from.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (activeTab) {
      case 'inbox':
        return matchesSearch && !mail.archived
      case 'starred':
        return matchesSearch && mail.starred
      case 'archived':
        return matchesSearch && mail.archived
      default:
        return matchesSearch
    }
  })

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'newsletter': return <Mail className="w-4 h-4 text-blue-500" />
      case 'event': return <Calendar className="w-4 h-4 text-green-500" />
      case 'donation': return <Heart className="w-4 h-4 text-red-500" />
      case 'career': return <Briefcase className="w-4 h-4 text-purple-500" />
      case 'news': return <Bell className="w-4 h-4 text-orange-500" />
      default: return <Mail className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  const mailTemplates = [
    { id: 'thankyou', label: 'Thank you note', subject: 'Thank you for your time', body: 'Dear [Name],\n\nThank you for taking the time to connect. I appreciate your insights and look forward to staying in touch.\n\nBest regards,\n' },
    { id: 'intro', label: 'Introduction', subject: 'Introduction and connection', body: 'Hello [Name],\n\nI wanted to introduce myself and connect regarding opportunities in [Area].\n\nSincerely,\n' },
    { id: 'event', label: 'Event invitation', subject: 'Invitation to upcoming event', body: 'Hi [Name],\n\nWe would love to invite you to our upcoming event on [Date]. Please let us know if you can make it.\n\nThanks,\n' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mail & Information</h1>
          <p className="text-gray-600">Stay updated with university news and communications</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Compose</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mail Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mail Tabs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'inbox', label: 'Inbox', icon: Inbox, count: mails.filter(m => !m.read).length },
                  { id: 'starred', label: 'Starred', icon: Star, count: mails.filter(m => m.starred).length },
                  { id: 'archived', label: 'Archived', icon: Archive, count: mails.filter(m => m.archived).length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mail List */}
            <div className="space-y-2">
              {loading && (<div className="p-2 text-sm text-gray-500">Loading...</div>)}
              {filteredMails.map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => setSelectedMail(mail)}
                  className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    !mail.read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getCategoryIcon(mail.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!mail.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {mail.from}
                        </p>
                        <div className="flex items-center space-x-2">
                          {mail.attachments > 0 && (
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500">{mail.timestamp}</span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm ${!mail.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {mail.subject}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{mail.preview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 border-l-4 rounded-r-lg bg-gray-50 ${getPriorityColor(announcement.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {announcement.timestamp}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      announcement.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : announcement.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">View Upcoming Events</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Connect with Alumni</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium">Make a Donation</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Notification Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Compose Mail</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <select
                  value={composeTemplate}
                  onChange={(e) => {
                    const val = e.target.value
                    setComposeTemplate(val)
                    const t = mailTemplates.find(mt => mt.id === val)
                    if (t) {
                      setComposeSubject(t.subject)
                      setComposeBody(t.body)
                    }
                  }}
                  className="text-sm border border-gray-300 rounded-md px-2 py-2 text-gray-700"
                >
                  <option value="">Templates…</option>
                  {mailTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <input className="input-field w-full" placeholder="To" value={composeTo} onChange={e => setComposeTo(e.target.value)} />
              <input className="input-field w-full" placeholder="Subject" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} />
              <textarea className="input-field w-full" rows={6} placeholder="Message" value={composeBody} onChange={e => setComposeBody(e.target.value)} />
              <div className="flex justify-end space-x-2">
                <button className="btn-secondary" onClick={() => setShowCompose(false)}>Cancel</button>
                <button className="btn-primary" onClick={async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/mail/compose`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: composeTo, subject: composeSubject, body: composeBody }) })
                    const data = await res.json()
                    if (!res.ok) throw new Error(data?.error || 'Failed')
                    setMails(prev => [ { ...data, timestamp: new Date(data.timestamp).toLocaleString() }, ...prev ])
                    setComposeTo(''); setComposeSubject(''); setComposeBody(''); setShowCompose(false)
                  } catch (e) { console.error(e) }
                }}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mail Detail Modal */}
      {selectedMail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{selectedMail.subject}</h2>
                <button
                  onClick={() => setSelectedMail(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{selectedMail.from}</p>
                    <p className="text-sm text-gray-500">{selectedMail.timestamp}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Forward className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600" onClick={async () => {
                      try {
                        await fetch(`${API_BASE}/api/mail/${selectedMail.id}`, { method: 'DELETE' })
                        setMails(prev => prev.filter(m => m.id !== selectedMail.id))
                        setSelectedMail(null)
                      } catch (e) { console.error(e) }
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedMail.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                  commodo consequat.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>

              {selectedMail.attachments > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments ({selectedMail.attachments})</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">newsletter_march_2024.pdf</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MailInfo


