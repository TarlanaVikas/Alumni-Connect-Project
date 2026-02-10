import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GraduationCap, Shield, User, Users } from 'lucide-react'

function Login() {
  const [loading, setLoading] = useState(false)
  const { directLogin } = useAuth()
  const navigate = useNavigate()

  const handleDirectLogin = async (role) => {
    setLoading(true)
    try {
      await directLogin(role)
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Alumni Connect
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your role to continue
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleDirectLogin('admin')}
            disabled={loading}
            className="group relative w-full flex items-center justify-center py-4 px-4 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Shield className="h-5 w-5 mr-2" />
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Login as Admin'
            )}
          </button>

          <button
            onClick={() => handleDirectLogin('student')}
            disabled={loading}
            className="group relative w-full flex items-center justify-center py-4 px-4 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <User className="h-5 w-5 mr-2" />
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Login as Student'
            )}
          </button>

          <button
            onClick={() => handleDirectLogin('alumni')}
            disabled={loading}
            className="group relative w-full flex items-center justify-center py-4 px-4 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Users className="h-5 w-5 mr-2" />
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Login as Alumni'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login





