import { useEffect, useState, useRef, useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-yaml'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const highlightedLineRef = useRef<HTMLDivElement>(null)

  // Highlight the entire YAML and split into lines
  const highlightedLines = useMemo(() => {
    const highlighted = Prism.highlight(value, Prism.languages.yaml, 'yaml')
    return highlighted.split('\n')
  }, [value])

  // When highlight changes, start fade out after a moment and scroll to highlighted line
  useEffect(() => {
    if (highlightedFeature) {
      setFadingOut(false)

      // Scroll to the first highlighted line within the container
      setTimeout(() => {
        if (highlightedLineRef.current && containerRef.current) {
          const container = containerRef.current
          const element = highlightedLineRef.current
          const containerRect = container.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()

          // Calculate the scroll position to center the element in the container
          const elementTop =
            elementRect.top - containerRect.top + container.scrollTop
          const centerOffset = (container.clientHeight - element.clientHeight) / 2
          const targetScroll = elementTop - centerOffset

          container.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          })
        }
      }, 50)

      const timer = setTimeout(() => setFadingOut(true), 100)
      return () => clearTimeout(timer)
    }
  }, [highlightedFeature])

  // Find the first line that matches the highlighted feature
  let firstHighlightedLine: number | null = null
  if (highlightedFeature) {
    for (const [lineNum, featureId] of lineFeatures) {
      if (featureId === highlightedFeature) {
        firstHighlightedLine = lineNum
        break
      }
    }
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto bg-gray-50">
      <pre className="p-4 text-sm font-mono leading-relaxed">
        {highlightedLines.map((lineHtml, index) => {
          const lineNum = index + 1
          const featureId = lineFeatures.get(lineNum)
          const isHighlighted = featureId === highlightedFeature
          const isFirstHighlighted = lineNum === firstHighlightedLine

          return (
            <div
              key={index}
              ref={isFirstHighlighted ? highlightedLineRef : undefined}
              className={`-mx-4 px-4 transition-colors ${
                fadingOut ? 'duration-[2000ms]' : 'duration-0'
              } ${isHighlighted && !fadingOut ? 'bg-yellow-200' : 'bg-transparent'}`}
            >
              <span className="select-none text-gray-400 w-8 inline-block text-right mr-4">
                {lineNum}
              </span>
              <span dangerouslySetInnerHTML={{ __html: lineHtml || ' ' }} />
            </div>
          )
        })}
      </pre>
    </div>
  )
}
