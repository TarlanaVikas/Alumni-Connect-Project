import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5175'

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
    if (!token) { setLoading(false); return }
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
          localStorage.setItem('user', JSON.stringify(data))
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Login failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success('Login successful!')
      return true
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
      return false
    }
  }

  const register = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Registration failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success('Registration successful!')
      return true
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.')
      return false
    }
  }

  const directLogin = async (role) => {
    try {
      // Create mock user based on role
      const mockUsers = {
        admin: {
          id: '1',
          email: 'admin@email.com',
          name: 'Admin User',
          role: 'admin',
          bio: 'System Administrator',
          location: '',
          experience: '',
          skills: [],
          socialLinks: {},
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        student: {
          id: '2',
          email: 'student@email.com',
          name: 'Student User',
          role: 'student',
          bio: 'Current Student',
          location: '',
          experience: '',
          skills: [],
          socialLinks: {},
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        alumni: {
          id: '3',
          email: 'alumni@email.com',
          name: 'Alumni User',
          role: 'alumni',
          bio: 'Graduated Alumni',
          location: '',
          experience: '',
          skills: [],
          socialLinks: {},
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        }
      }

      const mockUser = mockUsers[role]
      if (!mockUser) {
        throw new Error('Invalid role')
      }

      // Set mock token and user
      localStorage.setItem('token', `mock-token-${role}`)
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      toast.success(`Logged in as ${role}!`)
      return true
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    toast.success('Logged out successfully!')
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    toast.success('Profile updated successfully!')
  }

  const value = {
    user,
    loading,
    login,
    register,
    directLogin,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

