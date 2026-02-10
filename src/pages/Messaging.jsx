import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  Check,
  CheckCheck,
  Circle,
  Clock,
  MessageSquare
} from 'lucide-react'

function Messaging() {
  const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5175'
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const messagesEndRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const [chats, setChats] = useState([])
  const [recentConversations, setRecentConversations] = useState([])

  const messageTemplates = [
    { id: 'greet', label: 'General greeting', content: 'Hello! Hope you are doing well.' },
    { id: 'mentor', label: 'Mentorship request', content: 'Hi, I am interested in connecting about mentorship opportunities.' },
    { id: 'event', label: 'Event follow-up', content: 'Hello, it was great meeting you at the recent event. Let’s stay in touch!' }
  ]

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return
    try {
      setSending(true)
      const res = await fetch(`${API_BASE}/api/messages/chats/${selectedChat.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      })
      const sent = await res.json()
      if (!res.ok) throw new Error(sent?.error || 'Failed to send')
      setSelectedChat(prev => prev ? { ...prev, messages: [...(prev.messages || []), sent] } : prev)
      setChats(prev => prev.map(c => c.id === selectedChat.id ? { ...c, lastMessage: sent.content, timestamp: 'Just now' } : c))
      setNewMessage('')
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedChat?.messages])

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/messages/chats`)
        const data = await res.json()
        setChats(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadChats()
  }, [])

  const handleSelectChat = async (chat) => {
    setSelectedChat({ ...chat, messages: [] })
    try {
      const res = await fetch(`${API_BASE}/api/messages/chats/${chat.id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load chat')
      setSelectedChat({
        id: data.id,
        name: chat.name,
        avatar: chat.avatar,
        online: chat.online,
        messages: (data.messages || []).map(m => ({
          id: m.id,
          sender: m.sender === 'admin' ? 'me' : 'them',
          content: m.content,
          timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: !!m.read
        }))
      })
      // Update recent conversations
      setRecentConversations(prev => {
        const updated = [{ id: data.id, name: chat.name, avatar: chat.avatar, lastMessage: (data.messages || []).slice(-1)[0]?.content || '', timestamp: chat.timestamp || '' }, ...prev.filter(c => c.id !== data.id)]
        return updated.slice(0, 6)
      })
    } catch (e) {
      console.error(e)
    }
  }

  const getReadStatus = (message) => {
    if (message.sender === 'me') {
      return message.read ? <CheckCheck className="w-4 h-4 text-blue-500" /> : <Check className="w-4 h-4 text-gray-400" />
    }
    return null
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Recent Conversations */}
        {recentConversations.length > 0 && (
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent</h3>
            <div className="flex -space-x-2 overflow-hidden">
              {recentConversations.map(rc => (
                <img key={rc.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={rc.avatar} alt={rc.name} />
              ))}
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-4 text-sm text-gray-500">Loading chats...</div>
          )}
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-primary-50 border-r-2 border-primary-600' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={chat.avatar}
                    alt={chat.name}
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={selectedChat.avatar}
                    alt={selectedChat.name}
                  />
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.online ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'me'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      message.sender === 'me' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{message.timestamp}</span>
                      {getReadStatus(message)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    const val = e.target.value
                    setSelectedTemplate(val)
                    const t = messageTemplates.find(mt => mt.id === val)
                    if (t) setNewMessage(t.content)
                  }}
                  className="hidden sm:block text-sm border border-gray-300 rounded-md px-2 py-2 text-gray-700"
                >
                  <option value="">Templates…</option>
                  {messageTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messaging
