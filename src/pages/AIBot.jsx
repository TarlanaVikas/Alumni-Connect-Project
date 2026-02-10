import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader, Sparkles, MessageSquare, HelpCircle, Calendar, Users, Heart } from 'lucide-react'

function AIBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI assistant for the Alumni Connect platform. I can help you with information about events, alumni, donations, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { icon: Calendar, text: 'Upcoming Events', query: 'What events are coming up?' },
    { icon: Users, text: 'Find Alumni', query: 'Help me find alumni in my field' },
    { icon: Heart, text: 'Donation Info', query: 'Tell me about donation opportunities' },
    { icon: HelpCircle, text: 'Platform Help', query: 'How do I use this platform?' }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }])
      setIsLoading(false)
    }, 1500)
  }

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('event') || input.includes('upcoming')) {
      return "Here are some upcoming events:\n\n• Annual Alumni Reunion - March 15, 2024 at 6:00 PM\n• Career Development Workshop - March 20, 2024 at 2:00 PM\n• Networking Mixer - March 25, 2024 at 7:00 PM\n\nWould you like me to help you register for any of these events?"
    }
    
    if (input.includes('alumni') || input.includes('find') || input.includes('connect')) {
      return "I can help you find alumni! Here are some ways to connect:\n\n• Use the search function to find alumni by name, company, or location\n• Check the 'People You May Know' section for suggestions\n• Filter by graduation year, department, or industry\n\nWhat specific criteria are you looking for?"
    }
    
    if (input.includes('donation') || input.includes('fundraising')) {
      return "Our platform offers several donation opportunities:\n\n• Scholarship Fund - Support current students\n• University Development - Fund new facilities\n• Emergency Relief - Help alumni in need\n• Research Grants - Support faculty research\n\nYou can donate through the Donations section. Would you like more details about any specific fund?"
    }
    
    if (input.includes('help') || input.includes('how to')) {
      return "I'm here to help! Here's what you can do on Alumni Connect:\n\n• **Profile**: Update your information and connect with others\n• **Events**: Browse and register for upcoming events\n• **Messaging**: Chat with fellow alumni\n• **Search**: Find alumni by various criteria\n• **Donations**: Support university initiatives\n\nWhat specific feature would you like to learn more about?"
    }
    
    if (input.includes('profile') || input.includes('update')) {
      return "To update your profile:\n\n1. Go to the Profile section\n2. Click 'Edit Profile'\n3. Update your information\n4. Add skills, experience, and social links\n5. Click 'Save' to update\n\nIs there something specific you'd like to update in your profile?"
    }
    
    return "I understand you're asking about: " + userInput + "\n\nI'm here to help with questions about events, alumni connections, donations, and platform features. Could you be more specific about what you'd like to know?"
  }

  const handleQuickAction = (query) => {
    setInputMessage(query)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600">Your intelligent guide to Alumni Connect</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.query)}
                className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <action.icon className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-primary-600' : 'bg-gray-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the platform..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Pro Tips</h4>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Ask about specific events, alumni, or features</li>
                <li>• Use natural language - I understand context</li>
                <li>• I can help you navigate the platform and find information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIBot















