import { useState, useCallback } from 'react'
import YamlDisplay from './components/YamlEditor'
import { FeatureSelector } from './components/FeatureSelector'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { buildConfig } from './ConfigBuilder'

function App() {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set()
  )
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(
    null
  )

  // Build the YAML from selected features
  const { yaml: yamlContent, lineFeatures } = buildConfig(selectedFeatures)

  const handleFeatureToggle = useCallback((featureId: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev)
      if (next.has(featureId)) {
        next.delete(featureId)
        setHighlightedFeature(null)
      } else {
        next.add(featureId)
        // Highlight the newly added feature
        setHighlightedFeature(featureId)
        // Clear highlight after animation
        setTimeout(() => setHighlightedFeature(null), 2000)
      }
      return next
    })
  }, [])

  const handleDownload = useCallback(() => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'config.yaml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [yamlContent])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(yamlContent)
  }, [yamlContent])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation />

      {/* Page Title Section */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Configuration Builder
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Build your llama-swap configuration by selecting features below
          </p>
        </div>
      </div>

      {/* Main Content - fills remaining height */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Feature Selector */}
            <div className="lg:w-80 flex-shrink-0 flex flex-col min-h-0">
              <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-hidden flex flex-col">
                <FeatureSelector
                  selectedFeatures={selectedFeatures}
                  onFeatureToggle={handleFeatureToggle}
                  onDownload={handleDownload}
                />
              </div>
            </div>

            {/* Main Content - YAML Display */}
            <div className="flex-1 min-w-0 flex flex-col min-h-0">
              <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col min-h-0">
                {/* Header with copy button */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">
                    config.yaml
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <YamlDisplay
                    value={yamlContent}
                    lineFeatures={lineFeatures}
                    highlightedFeature={highlightedFeature}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
