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
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Page Title Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Configuration Builder
            </h1>
            <p className="mt-2 text-gray-600">
              Build your llama-swap configuration by selecting features below
            </p>
          </div>
        </div>

        {/* Main Content - Sidebar Layout */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Feature Selector */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-6 lg:sticky lg:top-8">
                <FeatureSelector
                  selectedFeatures={selectedFeatures}
                  onFeatureToggle={handleFeatureToggle}
                  onDownload={handleDownload}
                />
              </div>
            </div>

            {/* Main Content - YAML Display */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Header with copy button */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
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
                <YamlDisplay
                  value={yamlContent}
                  lineFeatures={lineFeatures}
                  highlightedFeature={highlightedFeature}
                />
              </div>

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Configuration Tips
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Use{' '}
                          <code className="bg-blue-100 px-1 rounded">
                            {'${PORT}'}
                          </code>{' '}
                          macro for automatic port assignment
                        </li>
                        <li>
                          Select features to add configuration sections
                        </li>
                        <li>
                          Download or copy the generated config when ready
                        </li>
                        <li>
                          Check out the{' '}
                          <a href="/" className="font-medium underline">
                            documentation
                          </a>{' '}
                          for more details
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
