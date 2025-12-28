import { features, type Feature } from '../config-sections'

interface FeatureSelectorProps {
  selectedFeatures: Set<string>
  onFeatureToggle: (featureId: string) => void
  onDownload: () => void
}

export function FeatureSelector({
  selectedFeatures,
  onFeatureToggle,
  onDownload
}: FeatureSelectorProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">I want to:</h2>

      <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
        {features.map((feature: Feature) => (
          <label
            key={feature.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedFeatures.has(feature.id)}
              onChange={() => onFeatureToggle(feature.id)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {feature.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {feature.description}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download config.yaml
        </button>
      </div>
    </div>
  )
}
