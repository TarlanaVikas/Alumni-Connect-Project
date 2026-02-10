import React, { useState } from 'react'
import { 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar,
  Users,
  Heart,
  MessageCircle,
  UserPlus,
  Star,
  Award,
  Building,
  Globe,
  ChevronDown,
  X
} from 'lucide-react'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('people') // people, events, organizations, content
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    department: '',
    graduationYear: '',
    industry: '',
    eventType: '',
    eventCategory: '',
    dateRange: '',
    priceRange: ''
  })

  const [searchResults, setSearchResults] = useState({
    people: [
      {
        id: 1,
        name: 'Dr. Emily Rodriguez',
        title: 'Senior Software Engineer',
        company: 'Google',
        university: 'University of Technology',
        graduationYear: '2018',
        department: 'Computer Science',
        location: 'San Francisco, CA',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        mutualConnections: 12,
        verified: true,
        online: true,
        skills: ['Machine Learning', 'Python', 'AI'],
        bio: 'Passionate about AI and machine learning. Currently working on large-scale distributed systems.'
      },
      {
        id: 2,
        name: 'James Wilson',
        title: 'Product Manager',
        company: 'Microsoft',
        university: 'University of Technology',
        graduationYear: '2019',
        department: 'Business Administration',
        location: 'Seattle, WA',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        mutualConnections: 8,
        verified: true,
        online: false,
        skills: ['Product Management', 'Strategy', 'Leadership'],
        bio: 'Experienced product manager with a focus on user experience and business growth.'
      },
      {
        id: 3,
        name: 'Lisa Park',
        title: 'Data Scientist',
        company: 'Amazon',
        university: 'University of Technology',
        graduationYear: '2020',
        department: 'Statistics',
        location: 'New York, NY',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        mutualConnections: 15,
        verified: false,
        online: true,
        skills: ['Data Science', 'Python', 'Statistics'],
        bio: 'Data scientist specializing in machine learning and statistical modeling.'
      }
    ],
    events: [
      {
        id: 1,
        title: 'Annual Alumni Reunion 2024',
        description: 'Join us for our biggest event of the year! Reconnect with old friends and meet new alumni.',
        date: '2024-03-15',
        time: '18:00',
        location: 'University Campus',
        type: 'in-person',
        category: 'social',
        attendees: 247,
        maxAttendees: 500,
        price: 0,
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=200&fit=crop',
        organizer: 'Alumni Association',
        featured: true
      },
      {
        id: 2,
        title: 'Tech Talk: AI in Healthcare',
        description: 'Learn about the latest developments in AI applications in healthcare.',
        date: '2024-03-20',
        time: '14:00',
        location: 'Online - Zoom',
        type: 'virtual',
        category: 'educational',
        attendees: 89,
        maxAttendees: 200,
        price: 0,
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
        organizer: 'Tech Alumni Group',
        featured: false
      }
    ],
    organizations: [
      {
        id: 1,
        name: 'Computer Science Alumni Association',
        description: 'Connecting CS graduates and promoting technology innovation.',
        members: 1250,
        category: 'Academic',
        location: 'Global',
        logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
        verified: true
      },
      {
        id: 2,
        name: 'Business Alumni Network',
        description: 'Professional networking and career development for business graduates.',
        members: 890,
        category: 'Professional',
        location: 'North America',
        logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        verified: true
      }
    ],
    content: [
      {
        id: 1,
        title: 'How to Build a Successful Tech Career',
        type: 'article',
        author: 'Dr. Emily Rodriguez',
        date: '2024-03-10',
        readTime: '5 min read',
        category: 'Career',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
        excerpt: 'Tips and insights for building a successful career in technology...'
      },
      {
        id: 2,
        title: 'University Research Breakthrough',
        type: 'news',
        author: 'University News',
        date: '2024-03-08',
        readTime: '3 min read',
        category: 'Research',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
        excerpt: 'New research findings in artificial intelligence and machine learning...'
      }
    ]
  })

  const tabs = [
    { id: 'people', label: 'People', count: searchResults.people.length, icon: Users },
    { id: 'events', label: 'Events', count: searchResults.events.length, icon: Calendar },
    { id: 'organizations', label: 'Organizations', count: searchResults.organizations.length, icon: Building },
    { id: 'content', label: 'Content', count: searchResults.content.length, icon: Heart }
  ]

  const handleSearch = (query) => {
    setSearchQuery(query)
    // In a real app, this would trigger an API call
    console.log('Searching for:', query)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      department: '',
      graduationYear: '',
      industry: '',
      eventType: '',
      eventCategory: '',
      dateRange: '',
      priceRange: ''
    })
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search & Filter</h1>
        <p className="text-gray-600">Find people, events, organizations, and content</p>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for people, events, organizations, or content..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
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
              <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear all ({getActiveFiltersCount()})
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            {activeTab === 'people' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, State"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Statistics">Statistics</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <select
                    value={filters.graduationYear}
                    onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Years</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g., Technology"
                    value={filters.industry}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                    className="input-field"
                  />
                </div>
              </>
            )}

            {activeTab === 'events' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    value={filters.eventType}
                    onChange={(e) => handleFilterChange('eventType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    <option value="in-person">In-Person</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.eventCategory}
                    onChange={(e) => handleFilterChange('eventCategory', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    <option value="social">Social</option>
                    <option value="educational">Educational</option>
                    <option value="professional">Professional</option>
                    <option value="networking">Networking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Time</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="next-month">Next Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Price</option>
                    <option value="free">Free</option>
                    <option value="under-25">Under $25</option>
                    <option value="25-100">$25 - $100</option>
                    <option value="over-100">Over $100</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {activeTab === 'people' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.people.map((person) => (
              <div key={person.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      src={person.avatar}
                      alt={person.name}
                    />
                    {person.online && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <h3 className="font-semibold text-gray-900">{person.name}</h3>
                      {person.verified && <Award className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{person.title}</p>
                    <p className="text-sm text-gray-500">{person.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{person.location}</span>
                      <span>{person.graduationYear}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <button className="btn-primary text-xs px-3 py-1">
                        Connect
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.events.map((event) => (
              <div key={event.id} className="card hover:shadow-md transition-shadow">
                <img
                  className="w-full h-32 object-cover rounded-lg mb-4"
                  src={event.image}
                  alt={event.title}
                />
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.time}</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-gray-900">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </span>
                    <button className="btn-primary text-xs px-3 py-1">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'organizations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.organizations.map((org) => (
              <div key={org.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <img
                    className="w-12 h-12 rounded-lg object-cover"
                    src={org.logo}
                    alt={org.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <h3 className="font-semibold text-gray-900">{org.name}</h3>
                      {org.verified && <Award className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{org.description}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{org.members} members</span>
                      <span>{org.location}</span>
                    </div>
                    <button className="mt-2 btn-primary text-xs px-3 py-1">
                      Join Organization
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            {searchResults.content.map((item) => (
              <div key={item.id} className="card hover:shadow-md transition-shadow">
                <div className="flex space-x-4">
                  <img
                    className="w-24 h-24 object-cover rounded-lg"
                    src={item.image}
                    alt={item.title}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">{item.category}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.excerpt}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>By {item.author}</span>
                      <span>{item.date}</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* No Results */}
      {searchResults[activeTab].length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  )
}

export default Search
