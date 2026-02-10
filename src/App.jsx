import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Messaging from './pages/Messaging'
import MailInfo from './pages/MailInfo'
import PeopleYouMayKnow from './pages/PeopleYouMayKnow'
import Events from './pages/Events'
import Search from './pages/Search'
import Donations from './pages/Donations'
import AdminDashboard from './pages/AdminDashboard'
import AIBot from './pages/AIBot'
import StudentDashboard from './pages/StudentDashboard'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  const homeElement = user?.role === 'student' ? <StudentDashboard /> : <Dashboard />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={homeElement} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/mail" element={<MailInfo />} />
        <Route path="/people" element={<PeopleYouMayKnow />} />
        <Route path="/events" element={<Events />} />
        <Route path="/search" element={<Search />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ai-bot" element={<AIBot />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

