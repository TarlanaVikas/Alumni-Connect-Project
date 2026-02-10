import React, { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  Share,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Video,
  Globe,
  Building
} from 'lucide-react'

function Events() {
  const [viewMode, setViewMode] = useState('grid') // grid, list, calendar
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    dateRange: '',
    location: '',
    type: ''
  })
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Annual Alumni Reunion 2024',
      description: 'Join us for our biggest event of the year! Reconnect with old friends, meet new alumni, and celebrate our university community.',
      date: '2024-03-15',
      time: '18:00',
      endTime: '23:00',
      location: 'University Campus - Main Hall',
      address: '123 University Ave, City, State 12345',
      type: 'in-person',
      category: 'social',
      maxAttendees: 500,
      currentAttendees: 247,
      price: 0,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop',
      organizer: 'Alumni Association',
      organizerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      tags: ['networking', 'celebration', 'reunion'],
      featured: true,
      registered: false
    },
    {
      id: 2,
      title: 'Tech Talk: AI in Healthcare',
      description: 'Learn about the latest developments in AI applications in healthcare from industry experts and researchers.',
      date: '2024-03-20',
      time: '14:00',
      endTime: '16:00',
      location: 'Online - Zoom',
      address: 'Virtual Event',
      type: 'virtual',
      category: 'educational',
      maxAttendees: 200,
      currentAttendees: 89,
      price: 0,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      organizer: 'Tech Alumni Group',
      organizerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      tags: ['technology', 'healthcare', 'AI'],
      featured: false,
      registered: true
    },
    {
      id: 3,
      title: 'Career Development Workshop',
      description: 'Professional development session covering resume building, interview skills, and career advancement strategies.',
      date: '2024-03-25',
      time: '10:00',
      endTime: '15:00',
      location: 'Career Services Center',
      address: '456 Career St, City, State 12345',
      type: 'in-person',
      category: 'professional',
      maxAttendees: 50,
      currentAttendees: 32,
      price: 25,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      organizer: 'Career Services',
      organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      tags: ['career', 'workshop', 'professional'],
      featured: false,
      registered: false
    },
    {
      id: 4,
      title: 'Networking Mixer',
      description: 'Casual networking event for alumni to connect and share experiences in a relaxed atmosphere.',
      date: '2024-03-28',
      time: '19:00',
      endTime: '22:00',
      location: 'Downtown Hotel',
      address: '789 Business Ave, City, State 12345',
      type: 'in-person',
      category: 'networking',
      maxAttendees: 100,
      currentAttendees: 67,
      price: 15,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
      organizer: 'Alumni Network',
      organizerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      tags: ['networking', 'social', 'mixer'],
      featured: false,
      registered: false
    },
    {
      id: 5,
      title: 'Fundraising Gala',
      description: 'Elegant evening to raise funds for university scholarships and research programs.',
      date: '2024-04-05',
      time: '18:30',
      endTime: '23:30',
      location: 'Grand Ballroom',
      address: '321 Gala St, City, State 12345',
      type: 'in-person',
      category: 'fundraising',
      maxAttendees: 300,
      currentAttendees: 156,
      price: 150,
      image: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=250&fit=crop',
      organizer: 'Development Office',
      organizerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      tags: ['fundraising', 'gala', 'charity'],
      featured: true,
      registered: false
    },
    {
      id: 6,
      title: 'Virtual Coffee Chat',
      description: 'Informal virtual meetup for alumni to catch up and share updates in a casual setting.',
      date: '2024-03-22',
      time: '12:00',
      endTime: '13:00',
      location: 'Online - Microsoft Teams',
      address: 'Virtual Event',
      type: 'virtual',
      category: 'social',
      maxAttendees: 30,
      currentAttendees: 18,
      price: 0,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
      organizer: 'Alumni Relations',
      organizerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      tags: ['virtual', 'coffee', 'casual'],
      featured: false,
      registered: true
    }
  ])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilters = (!selectedFilters.category || event.category === selectedFilters.category) &&
                          (!selectedFilters.type || event.type === selectedFilters.type) &&
                          (!selectedFilters.location || event.location.toLowerCase().includes(selectedFilters.location.toLowerCase()))
    
    return matchesSearch && matchesFilters
  })

  const handleRegister = (eventId) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, registered: !event.registered, currentAttendees: event.registered ? event.currentAttendees - 1 : event.currentAttendees + 1 }
          : event
      )
    )
  }

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'virtual': return <Video className="w-4 h-4" />
      case 'in-person': return <Building className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'social': return 'bg-blue-100 text-blue-800'
      case 'educational': return 'bg-green-100 text-green-800'
      case 'professional': return 'bg-purple-100 text-purple-800'
      case 'networking': return 'bg-orange-100 text-orange-800'
      case 'fundraising': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Discover and join upcoming alumni events</p>
        </div>
        <button
          onClick={() => setShowCreateEvent(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={selectedFilters.category}
            onChange={(e) => setSelectedFilters({...selectedFilters, category: e.target.value})}
            className="input-field"
          >
            <option value="">All Categories</option>
            <option value="social">Social</option>
            <option value="educational">Educational</option>
            <option value="professional">Professional</option>
            <option value="networking">Networking</option>
            <option value="fundraising">Fundraising</option>
          </select>

          <select
            value={selectedFilters.type}
            onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="in-person">In-Person</option>
            <option value="virtual">Virtual</option>
          </select>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-lg ${viewMode === 'calendar' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Calendar
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Showing {filteredEvents.length} events
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Featured:</span>
              <span className="text-sm font-medium text-primary-600">
                {events.filter(e => e.featured).length}
              </span>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">More Filters</span>
          </button>
        </div>
      </div>

      {/* Events Grid/List */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card hover:shadow-md transition-shadow">
              {event.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                </div>
              )}
              
              <div className="relative">
                <img
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  src={event.image}
                  alt={event.title}
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      className="w-6 h-6 rounded-full"
                      src={event.organizerAvatar}
                      alt={event.organizer}
                    />
                    <span className="text-sm text-gray-600">{event.organizer}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getEventTypeIcon(event.type)}
                    <span className="text-sm text-gray-500 capitalize">{event.type}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRegister(event.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        event.registered
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'btn-primary'
                      }`}
                    >
                      {event.registered ? 'Registered' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <img
                className="w-full h-64 object-cover rounded-lg mb-6"
                src={selectedEvent.image}
                alt={selectedEvent.title}
              />

              <div className="space-y-4">
                <p className="text-gray-700">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedEvent.time} - {selectedEvent.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedEvent.currentAttendees}/{selectedEvent.maxAttendees} attendees</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedEvent.price === 0 ? 'Free' : `$${selectedEvent.price}`}
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary flex items-center space-x-2">
                      <Share className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => handleRegister(selectedEvent.id)}
                      className={`flex items-center space-x-2 ${
                        selectedEvent.registered
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded-lg'
                          : 'btn-primary'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{selectedEvent.registered ? 'Registered' : 'Register'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events















