import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Home from './components/Home'
import SwipeView from './components/SwipeView'
import Recommendation from './components/Recommendation'

const AppContent = () => {
  // Create a stable anonymous user id stored in localStorage
  const [userId] = useState(() => {
    const key = 'anon_user_id'
    let id = localStorage.getItem(key)
    if (!id) {
      id = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem(key, id)
    }
    return id
  })
  const [currentView, setCurrentView] = useState('home') // 'home', 'swipe', 'recommendation'

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
          userId={userId}
          onSwipeComplete={handleSwipeComplete}
          onBack={handleBackToHome}
        />
      )
    case 'recommendation':
      return (
        <Recommendation
          userId={userId}
          onBack={handleBackToSwipe}
          onStartOver={handleStartOver}
        />
      )
    default:
      return <Home userId={userId} onStartSwiping={handleStartSwiping} />
  }
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
