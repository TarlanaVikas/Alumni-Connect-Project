import React, { useState } from 'react'
import { 
  Heart, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar, 
  Star,
  Plus,
  Share,
  Filter,
  Search,
  Award,
  Gift,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

function Donations() {
  const [activeTab, setActiveTab] = useState('campaigns') // campaigns, my-donations, create
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [donationAmount, setDonationAmount] = useState('')
  const [showDonationModal, setShowDonationModal] = useState(false)

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: 'Scholarship Fund 2024',
      description: 'Support deserving students with financial aid to pursue their education and achieve their dreams.',
      goal: 100000,
      raised: 67500,
      donors: 234,
      daysLeft: 45,
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      organizer: 'University Foundation',
      featured: true,
      urgent: false
    },
    {
      id: 2,
      title: 'Emergency Relief Fund',
      description: 'Help alumni and students facing unexpected financial hardships due to emergencies.',
      goal: 50000,
      raised: 32400,
      donors: 156,
      daysLeft: 12,
      category: 'Emergency',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      organizer: 'Alumni Association',
      featured: false,
      urgent: true
    },
    {
      id: 3,
      title: 'Research Center Development',
      description: 'Fund the construction of a new state-of-the-art research facility for cutting-edge research.',
      goal: 500000,
      raised: 125000,
      donors: 89,
      daysLeft: 120,
      category: 'Infrastructure',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      organizer: 'Research Department',
      featured: true,
      urgent: false
    },
    {
      id: 4,
      title: 'Student Emergency Fund',
      description: 'Provide immediate financial assistance to students facing unexpected challenges.',
      goal: 25000,
      raised: 18900,
      donors: 78,
      daysLeft: 8,
      category: 'Student Support',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      organizer: 'Student Affairs',
      featured: false,
      urgent: true
    }
  ])

  const [myDonations, setMyDonations] = useState([
    {
      id: 1,
      campaignTitle: 'Scholarship Fund 2024',
      amount: 500,
      date: '2024-03-01',
      status: 'completed',
      receipt: 'REC-001234'
    },
    {
      id: 2,
      campaignTitle: 'Emergency Relief Fund',
      amount: 100,
      date: '2024-02-15',
      status: 'completed',
      receipt: 'REC-001235'
    },
    {
      id: 3,
      campaignTitle: 'Research Center Development',
      amount: 1000,
      date: '2024-01-20',
      status: 'completed',
      receipt: 'REC-001236'
    }
  ])

  const [stats, setStats] = useState({
    totalDonated: 1600,
    totalCampaigns: 4,
    totalDonors: 557,
    thisMonth: 600
  })

  const handleDonate = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId)
    setSelectedCampaign(campaign)
    setShowDonationModal(true)
  }

  const processDonation = () => {
    if (!donationAmount || !selectedCampaign) return

    const amount = parseFloat(donationAmount)
    const newDonation = {
      id: Date.now(),
      campaignTitle: selectedCampaign.title,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      receipt: `REC-${Date.now()}`
    }

    setMyDonations(prev => [newDonation, ...prev])
    
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === selectedCampaign.id 
        ? { 
            ...campaign, 
            raised: campaign.raised + amount,
            donors: campaign.donors + 1
          }
        : campaign
    ))

    setStats(prev => ({
      ...prev,
      totalDonated: prev.totalDonated + amount,
      thisMonth: prev.thisMonth + amount
    }))

    setShowDonationModal(false)
    setDonationAmount('')
    setSelectedCampaign(null)
  }

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Education': return 'bg-blue-100 text-blue-800'
      case 'Emergency': return 'bg-red-100 text-red-800'
      case 'Infrastructure': return 'bg-purple-100 text-purple-800'
      case 'Student Support': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations & Fundraising</h1>
          <p className="text-gray-600">Support university initiatives and make a difference</p>
        </div>
        <button
          onClick={() => setActiveTab('create')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Donated</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalDonated.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Donors</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalDonors}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.thisMonth.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'campaigns', label: 'Campaigns', count: campaigns.length, icon: Target },
            { id: 'my-donations', label: 'My Donations', count: myDonations.length, icon: Heart },
            { id: 'create', label: 'Create Campaign', count: 0, icon: Plus }
          ].map((tab) => (
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
              {tab.count > 0 && (
                <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Featured Campaigns */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Campaigns</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.filter(c => c.featured).map((campaign) => (
                <div key={campaign.id} className="card hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      src={campaign.image}
                      alt={campaign.title}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}>
                        {campaign.category}
                      </span>
                    </div>
                    {campaign.urgent && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Urgent</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{campaign.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{getProgressPercentage(campaign.raised, campaign.goal).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${campaign.raised.toLocaleString()} raised</span>
                        <span>${campaign.goal.toLocaleString()} goal</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{campaign.donors} donors</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDonate(campaign.id)}
                        className="flex-1 btn-primary"
                      >
                        Donate Now
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Campaigns */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Campaigns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="card hover:shadow-md transition-shadow">
                  <img
                    className="w-full h-32 object-cover rounded-lg mb-4"
                    src={campaign.image}
                    alt={campaign.title}
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}>
                        {campaign.category}
                      </span>
                      {campaign.urgent && (
                        <span className="text-red-500 text-xs font-medium">Urgent</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{getProgressPercentage(campaign.raised, campaign.goal).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>${campaign.raised.toLocaleString()}</span>
                      <span>{campaign.donors} donors</span>
                    </div>
                    <button
                      onClick={() => handleDonate(campaign.id)}
                      className="w-full btn-primary"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Donations Tab */}
      {activeTab === 'my-donations' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Donation History</h2>
            <div className="space-y-4">
              {myDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{donation.campaignTitle}</h3>
                      <p className="text-sm text-gray-600">Receipt: {donation.receipt}</p>
                      <p className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">${donation.amount.toLocaleString()}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Tab */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Create New Campaign</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter campaign title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="input-field h-32"
                  placeholder="Describe your campaign and its purpose"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Amount</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="input-field">
                    <option value="">Select category</option>
                    <option value="Education">Education</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Student Support">Student Support</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Image</label>
                  <input
                    type="file"
                    className="input-field"
                    accept="image/*"
                  />
                </div>
              </div>
              <button className="w-full btn-primary">
                Create Campaign
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {showDonationModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Donate to {selectedCampaign.title}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, 250].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className="p-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Campaign Goal:</span>
                    <span>${selectedCampaign.goal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Amount Raised:</span>
                    <span>${selectedCampaign.raised.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Your Donation:</span>
                    <span>${donationAmount || '0'}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processDonation}
                    disabled={!donationAmount}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Donations















