import { useEffect, useState } from 'react'

interface YamlDisplayProps {
  value: string
  lineFeatures: Map<number, string>
  highlightedFeature: string | null
}

export default function YamlDisplay({
  value,
  lineFeatures,
  highlightedFeature
}: YamlDisplayProps) {
  const [fadingOut, setFadingOut] = useState(false)

  // When highlight changes, start fade out after a moment
  useEffect(() => {
    if (highlightedFeature) {
      setFadingOut(false)
      const timer = setTimeout(() => setFadingOut(true), 100)
      return () => clearTimeout(timer)
    }
  }, [highlightedFeature])

  const lines = value.split('\n')

  return (
    <div className="h-[500px] overflow-auto bg-gray-50">
      <pre className="p-4 text-sm font-mono text-gray-800 leading-relaxed">
        {lines.map((line, index) => {
          const lineNum = index + 1
          const featureId = lineFeatures.get(lineNum)
          const isHighlighted = featureId === highlightedFeature

          return (
            <div
              key={index}
              className={`-mx-4 px-4 transition-colors ${
                fadingOut ? 'duration-[2000ms]' : 'duration-0'
              } ${isHighlighted && !fadingOut ? 'bg-yellow-200' : 'bg-transparent'}`}
            >
              <span className="select-none text-gray-400 w-8 inline-block text-right mr-4">
                {lineNum}
              </span>
              <span>{line || ' '}</span>
            </div>
          )
        })}
      </pre>
    </div>
  )
}
