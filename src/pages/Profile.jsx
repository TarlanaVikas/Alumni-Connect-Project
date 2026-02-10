import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Edit, 
  Save, 
  X, 
  Camera, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase,
  Link as LinkIcon,
  Plus,
  Trash2
} from 'lucide-react'

function Profile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    experience: user?.experience || '',
    skills: user?.skills || [],
    socialLinks: user?.socialLinks || {}
  })
  const [newSkill, setNewSkill] = useState('')
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      experience: user?.experience || '',
      skills: user?.skills || [],
      socialLinks: user?.socialLinks || {}
    })
    setIsEditing(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [newSocialLink.platform.toLowerCase()]: newSocialLink.url
        }
      })
      setNewSocialLink({ platform: '', url: '' })
    }
  }

  const removeSocialLink = (platform) => {
    const newSocialLinks = { ...formData.socialLinks }
    delete newSocialLinks[platform]
    setFormData({
      ...formData,
      socialLinks: newSocialLinks
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                className="h-24 w-24 rounded-full object-cover"
                src={user?.avatar}
                alt={user?.name}
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.experience}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>{user?.university} • {user?.graduationYear}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{user?.department}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700">{user?.bio || 'No bio available'}</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience</h2>
            {isEditing ? (
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="input-field"
                placeholder="Current position and company"
              />
            ) : (
              <p className="text-gray-700">{user?.experience || 'No experience listed'}</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 input-field"
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="btn-primary flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>

          {/* Social Links Section */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
            <div className="space-y-2">
              {Object.entries(formData.socialLinks).map(([platform, url]) => (
                <div key={platform} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4 text-gray-500" />
                    <span className="capitalize font-medium">{platform}</span>
                    <span className="text-gray-500">•</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      {url}
                    </a>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeSocialLink(platform)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newSocialLink.platform}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                    className="input-field"
                    placeholder="Platform (e.g., LinkedIn)"
                  />
                  <input
                    type="url"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                    className="input-field"
                    placeholder="URL"
                  />
                </div>
                <button
                  onClick={addSocialLink}
                  className="btn-primary flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Link</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Connections</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Events Attended</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donations Made</span>
                <span className="font-semibold">$2,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Messages Sent</span>
                <span className="font-semibold">89</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-900">Updated profile</p>
                <p className="text-gray-500">2 days ago</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-900">Attended "Tech Talk" event</p>
                <p className="text-gray-500">1 week ago</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-900">Connected with 5 alumni</p>
                <p className="text-gray-500">2 weeks ago</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="text-gray-900">{user?.location}</p>
              </div>
              <div>
                <span className="text-gray-600">University:</span>
                <p className="text-gray-900">{user?.university}</p>
              </div>
              <div>
                <span className="text-gray-600">Graduation Year:</span>
                <p className="text-gray-900">{user?.graduationYear}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile















