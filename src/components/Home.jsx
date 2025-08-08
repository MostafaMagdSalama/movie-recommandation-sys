import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Play, Film, CheckCircle } from 'lucide-react'

const Home = ({ userId, onStartSwiping }) => {
  const location = useLocation()
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [location.state])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">MovieSwipe</h1>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto h-32 w-32 bg-primary-600 rounded-full flex items-center justify-center mb-6">
              <span className="text-6xl">🎬</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Movie
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Swipe through movies and discover recommendations tailored just for you. 
              Like what you see? We'll learn your preferences and suggest the perfect film.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">👍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Like</h3>
              <p className="text-gray-600 text-sm">Swipe right or tap the thumbs up for movies you'd love to watch</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">👎</div>
              <h3 className="font-semibold text-gray-900 mb-2">Dislike</h3>
              <p className="text-gray-600 text-sm">Swipe left or tap thumbs down for movies that don't interest you</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">🤷</div>
              <h3 className="font-semibold text-gray-900 mb-2">Not Sure</h3>
              <p className="text-gray-600 text-sm">Tap the shrug for movies you're uncertain about</p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartSwiping}
            className="inline-flex items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Play className="h-6 w-6" />
            <span>Start Swiping</span>
          </button>

          {/* Anonymous user notice (optional) */}
          <div className="mt-8 text-gray-500 text-sm">
            <p>Using guest session</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
