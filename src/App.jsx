import React, { useState } from 'react'
import { Play, Flame, TrendingUp, Shield, Zap } from 'lucide-react'

function App() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set(['spotify', 'tiktok']))
  const [isBoosting, setIsBoosting] = useState(false)
  const [boostResults, setBoostResults] = useState([])

  const platforms = [
    { id: 'spotify', name: 'Spotify', icon: '🎵', color: 'bg-green-500' },
    { id: 'tiktok', name: 'TikTok', icon: '📱', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'bg-red-600' },
    { id: 'apple', name: 'Apple Music', icon: '🍎', color: 'bg-pink-500' },
    { id: 'amazon', name: 'Amazon Music', icon: '📦', color: 'bg-orange-500' },
    { id: 'soundcloud', name: 'SoundCloud', icon: '☁️', color: 'bg-orange-400' }
  ]

  const handleBoost = async () => {
    setIsBoosting(true)
    setBoostResults([])
    
    // Simulate AI-powered boosting process
    const results = await simulateBoost(Array.from(selectedPlatforms))
    setBoostResults(results)
    setIsBoosting(false)
  }

  const simulateBoost = async (platforms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = platforms.map(platform => ({
          platform,
          success: Math.random() > 0.1, // 90% success rate
          plays: Math.floor(Math.random() * 50) + 10,
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2), // 70-100% confidence
          evasion: ['ghost_cluster', 'viral_loop', 'human_skip', 'geo_spoof'][Math.floor(Math.random() * 4)]
        }))
        resolve(results)
      }, 2000)
    })
  }

  const togglePlatform = (platformId) => {
    const newSelected = new Set(selectedPlatforms)
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId)
    } else {
      newSelected.add(platformId)
    }
    setSelectedPlatforms(newSelected)
  }

  const totalRevenue = boostResults.reduce((total, result) => {
    const rates = {
      spotify: 0.0038,
      tiktok: 0.00025,
      youtube: 0.0018,
      apple: 0.01,
      amazon: 0.0042,
      soundcloud: 0.0025
    }
    return total + (result.plays * rates[result.platform])
  }, 0)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Flame className="w-8 h-8 mr-2 text-orange-400" />
            StreamForge 2.0
          </h1>
          <p className="text-gray-200">AI-Powered Stream Boosting Platform</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Platform Selection */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-400" />
              Select Platforms
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`platform-card p-4 rounded-xl cursor-pointer transition-all ${
                    selectedPlatforms.has(platform.id)
                      ? 'bg-blue-500 text-white border-2 border-blue-400'
                      : 'bg-white/10 text-gray-200 hover:bg-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{platform.icon}</div>
                  <div className="text-sm font-medium">{platform.name}</div>
                  {selectedPlatforms.has(platform.id) && (
                    <div className="text-xs mt-1 opacity-80">Selected</div>
                  )}
                </div>
              ))}
            </div>

            {/* Boost Button */}
            <button
              onClick={handleBoost}
              disabled={isBoosting || selectedPlatforms.size === 0}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              {isBoosting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Boosting Streams...
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 mr-2" />
                  Ignite Boost
                </>
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
              Boost Results
            </h2>

            {boostResults.length > 0 ? (
              <div className="space-y-4">
                {boostResults.map((result, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">
                        {platforms.find(p => p.id === result.platform)?.name}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.success ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-200">
                      <div>Plays: {result.plays}</div>
                      <div>Confidence: {(result.confidence * 100).toFixed(0)}%</div>
                      <div>Evasion: {result.evasion}</div>
                    </div>
                  </div>
                ))}

                {/* Revenue Summary */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 mt-6">
                  <div className="text-white font-semibold text-center">
                    <div className="text-2xl">${totalRevenue.toFixed(2)}</div>
                    <div className="text-sm opacity-90">Estimated Revenue</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-300 py-12">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select platforms and ignite to see results</p>
                <p className="text-sm opacity-75 mt-2">AI-powered evasion with 99% success rate</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="glass-effect rounded-2xl p-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">12+</div>
              <div className="text-gray-300">Platforms</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-gray-300">Evasion Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">AI</div>
              <div className="text-gray-300">Powered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">⚡</div>
              <div className="text-gray-300">Real-time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App