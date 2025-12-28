import yaml from 'js-yaml'
import { baseConfig, featureConfigs } from './config-sections'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: any, source: any): any {
  const result = { ...target }

  for (const key of Object.keys(source)) {
    if (isObject(result[key]) && isObject(source[key])) {
      result[key] = deepMerge(result[key], source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}

export interface LineInfo {
  lineNumber: number
  featureId: string | null
}

export interface BuildResult {
  yaml: string
  lineCount: number
  lineFeatures: Map<number, string> // Maps line number to feature ID
}

export function buildConfig(selectedFeatures: Set<string>): BuildResult {
  let config = structuredClone(baseConfig)
  const lineFeatures = new Map<number, string>()

  // Apply each selected feature's configuration
  for (const featureId of selectedFeatures) {
    const featureConfig = featureConfigs[featureId]
    if (featureConfig) {
      config = deepMerge(config, featureConfig)
    }
  }

  // Generate YAML with preserved order and no line wrapping
  const yamlString = yaml.dump(config, {
    sortKeys: false,
    lineWidth: -1,
    noRefs: true,
    quotingType: '"'
  })

  // Now figure out which lines belong to which features
  // by generating YAML for each feature individually and finding matches
  const lines = yamlString.split('\n')

  for (const featureId of selectedFeatures) {
    const featureConfig = featureConfigs[featureId]
    if (!featureConfig) continue

    // Get unique keys/values that identify this feature
    const featureYaml = yaml.dump(featureConfig, {
      sortKeys: false,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"'
    })

    const featureLines = featureYaml.split('\n').filter((l) => l.trim())

    // Find lines in the full YAML that match this feature's content
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const featureLine of featureLines) {
        // Match if the line contains unique content from the feature
        if (
          featureLine.trim() &&
          line.includes(featureLine.trim()) &&
          !lineFeatures.has(i + 1)
        ) {
          lineFeatures.set(i + 1, featureId)
        }
      }
    }
  }

  return {
    yaml: yamlString,
    lineCount: lines.length,
    lineFeatures
  }
}
