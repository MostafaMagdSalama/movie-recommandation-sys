import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Auth from './components/Auth'
import Home from './components/Home'
import SwipeView from './components/SwipeView'
import Recommendation from './components/Recommendation'

const AppContent = () => {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState('home') // 'home', 'swipe', 'recommendation'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  const handleStartSwiping = () => {
    setCurrentView('swipe')
  }

  const handleSwipeComplete = () => {
    setCurrentView('recommendation')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  const handleBackToSwipe = () => {
    setCurrentView('swipe')
  }

  const handleStartOver = () => {
    setCurrentView('swipe')
  }

  switch (currentView) {
    case 'swipe':
      return (
        <SwipeView
          onSwipeComplete={handleSwipeComplete}
          onBack={handleBackToHome}
        />
      )
    case 'recommendation':
      return (
        <Recommendation
          onBack={handleBackToSwipe}
          onStartOver={handleStartOver}
        />
      )
    default:
      return <Home onStartSwiping={handleStartSwiping} />
  }
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
