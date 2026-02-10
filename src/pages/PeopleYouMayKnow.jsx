import React, { useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar,
  UserPlus,
  MessageCircle,
  Star,
  X,
  Users,
  Building,
  Award
} from 'lucide-react'

function PeopleYouMayKnow() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    department: '',
    graduationYear: '',
    location: '',
    industry: ''
  })
  const [sortBy, setSortBy] = useState('relevance')

  const baseSuggestions = [
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
      mutualInterests: ['Machine Learning', 'AI', 'Python'],
      bio: 'Passionate about AI and machine learning. Currently working on large-scale distributed systems.',
      verified: true,
      online: true
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
      mutualInterests: ['Product Management', 'Strategy', 'Leadership'],
      bio: 'Experienced product manager with a focus on user experience and business growth.',
      verified: true,
      online: false
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
      mutualInterests: ['Data Science', 'Python', 'Statistics'],
      bio: 'Data scientist specializing in machine learning and statistical modeling.',
      verified: false,
      online: true
    },
    {
      id: 4,
      name: 'Michael Chen',
      title: 'Investment Banker',
      company: 'Goldman Sachs',
      university: 'University of Technology',
      graduationYear: '2017',
      department: 'Finance',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      mutualConnections: 6,
      mutualInterests: ['Finance', 'Investment', 'Economics'],
      bio: 'Investment banker with expertise in M&A and capital markets.',
      verified: true,
      online: false
    },
    {
      id: 5,
      name: 'Sarah Johnson',
      title: 'UX Designer',
      company: 'Apple',
      university: 'University of Technology',
      graduationYear: '2021',
      department: 'Design',
      location: 'Cupertino, CA',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      mutualConnections: 9,
      mutualInterests: ['UX Design', 'User Research', 'Prototyping'],
      bio: 'UX designer passionate about creating intuitive and beautiful user experiences.',
      verified: false,
      online: true
    },
    {
      id: 6,
      name: 'David Kim',
      title: 'Software Architect',
      company: 'Netflix',
      university: 'University of Technology',
      graduationYear: '2016',
      department: 'Computer Science',
      location: 'Los Gatos, CA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      mutualConnections: 20,
      mutualInterests: ['Software Architecture', 'Microservices', 'Scalability'],
      bio: 'Software architect with extensive experience in building scalable distributed systems.',
      verified: true,
      online: false
    }
  ]

  const roleAdjustedSuggestions = useMemo(() => {
    if (user?.role === 'admin') {
      // Admin sees everyone with distinct names
      return baseSuggestions.map((p, idx) => ({ ...p, id: p.id, name: p.name }))
    }
    if (user?.role === 'student') {
      // Students see Alumni suggestions (explicitly tag titles/companies to alumni flavor)
      return baseSuggestions.map((p, idx) => ({
        ...p,
        name: [
          'Ava Thompson', 'Noah Ramirez', 'Sophia Nguyen', 'Liam Patel', 'Mia Robinson', 'Ethan Brooks'
        ][(idx) % 6] || p.name,
        title: p.title || 'Alumni Mentor',
      }))
    }
    // Alumni see Students suggestions
    return baseSuggestions.map((p, idx) => ({
      ...p,
      name: [
        'Olivia Carter', 'William Rivera', 'Emma Hughes', 'Benjamin Flores', 'Charlotte Murphy', 'Lucas Bennett'
      ][(idx) % 6] || p.name,
      title: 'Student - ' + (p.department || 'Department'),
      company: 'University of Technology'
    }))
  }, [user])

  const [suggestions, setSuggestions] = useState(roleAdjustedSuggestions)

  React.useEffect(() => {
    setSuggestions(roleAdjustedSuggestions)
  }, [roleAdjustedSuggestions])

  const [connections, setConnections] = useState([])

  const handleConnect = (personId) => {
    const person = suggestions.find(p => p.id === personId)
    if (person) {
      setConnections(prev => [...prev, person])
      setSuggestions(prev => prev.filter(p => p.id !== personId))
    }
  }

  const handleIgnore = (personId) => {
    setSuggestions(prev => prev.filter(p => p.id !== personId))
  }

  const filteredSuggestions = suggestions.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilters = (!selectedFilters.department || person.department === selectedFilters.department) &&
                          (!selectedFilters.graduationYear || person.graduationYear === selectedFilters.graduationYear) &&
                          (!selectedFilters.location || person.location.includes(selectedFilters.location)) &&
                          (!selectedFilters.industry || person.company.toLowerCase().includes(selectedFilters.industry.toLowerCase()))
    
    return matchesSearch && matchesFilters
  })

  const getSortFunction = () => {
    switch (sortBy) {
      case 'mutualConnections':
        return (a, b) => b.mutualConnections - a.mutualConnections
      case 'graduationYear':
        return (a, b) => b.graduationYear - a.graduationYear
      case 'name':
        return (a, b) => a.name.localeCompare(b.name)
      default:
        return (a, b) => b.mutualConnections - a.mutualConnections
    }
  }

  const sortedSuggestions = filteredSuggestions.sort(getSortFunction())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">People You May Know</h1>
          <p className="text-gray-600">Discover and connect with {user?.role === 'student' ? 'alumni' : user?.role === 'admin' ? 'students and alumni' : 'students'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{suggestions.length} suggestions</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, company, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={selectedFilters.department}
            onChange={(e) => setSelectedFilters({...selectedFilters, department: e.target.value})}
            className="input-field"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Statistics">Statistics</option>
            <option value="Finance">Finance</option>
            <option value="Design">Design</option>
          </select>

          <select
            value={selectedFilters.graduationYear}
            onChange={(e) => setSelectedFilters({...selectedFilters, graduationYear: e.target.value})}
            className="input-field"
          >
            <option value="">All Years</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="mutualConnections">Mutual Connections</option>
            <option value="graduationYear">Graduation Year</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Showing {sortedSuggestions.length} of {suggestions.length} suggestions
            </span>
          </div>
          <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSuggestions.map((person) => (
          <div key={person.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
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
                <div>
                  <div className="flex items-center space-x-1">
                    <h3 className="font-semibold text-gray-900">{person.name}</h3>
                    {person.verified && (
                      <Award className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{person.title}</p>
                  <p className="text-sm text-gray-500">{person.company}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4" />
                <span>{person.department} • {person.graduationYear}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{person.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{person.mutualConnections} mutual connections</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{person.bio}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Mutual Interests</h4>
              <div className="flex flex-wrap gap-1">
                {person.mutualInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleConnect(person.id)}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Connect</span>
              </button>
              <button
                onClick={() => handleConnect(person.id)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleIgnore(person.id)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {sortedSuggestions.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Recent Connections */}
      {connections.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((person) => (
              <div key={person.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={person.avatar}
                  alt={person.name}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{person.name}</h4>
                  <p className="text-sm text-gray-600">{person.title}</p>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PeopleYouMayKnow






