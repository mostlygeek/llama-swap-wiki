import { useState } from 'react'
import YamlEditor from './components/YamlEditor'
import ExampleSelector from './components/ExampleSelector'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { examples } from './examples'

function App() {
  const [yamlContent, setYamlContent] = useState(examples[0].content)
  const [selectedExample, setSelectedExample] = useState(examples[0].id)

  const handleExampleChange = (exampleId: string) => {
    const example = examples.find(e => e.id === exampleId)
    if (example) {
      setYamlContent(example.content)
      setSelectedExample(exampleId)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'config.yaml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Page Title Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              llama-swap Configuration Builder
            </h1>
            <p className="mt-2 text-gray-600">
              Create and customize your llama-swap configuration with live examples and validation
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <ExampleSelector
                  selectedExample={selectedExample}
                  onExampleChange={handleExampleChange}
                />
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Download config.yaml
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <YamlEditor
              value={yamlContent}
              onChange={setYamlContent}
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Configuration Tips
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use <code className="bg-blue-100 px-1 rounded">{'${PORT}'}</code> macro for automatic port assignment</li>
                    <li>Add <code className="bg-blue-100 px-1 rounded">ttl</code> to automatically unload models after inactivity</li>
                    <li>Use <code className="bg-blue-100 px-1 rounded">groups</code> to control which models can run simultaneously</li>
                    <li>Check out the <a href="/examples/" className="font-medium underline">examples page</a> for more configuration patterns</li>
                  </ul>
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
