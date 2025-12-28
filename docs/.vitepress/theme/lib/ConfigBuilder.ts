import { buildBaseYaml, featureSnippets } from './config-sections'

export interface BuildResult {
  yaml: string
  lineCount: number
  lineFeatures: Map<number, string> // Maps line number to feature ID
}

export function buildConfig(selectedFeatures: Set<string>): BuildResult {
  const lineFeatures = new Map<number, string>()

  const hasMacros = selectedFeatures.has('macros')
  const hasTtl = selectedFeatures.has('ttl')
  const hasEnv = selectedFeatures.has('env')
  const hasApiKeys = selectedFeatures.has('apiKeys')

  // Build base YAML with selected options
  const baseConfig = buildBaseYaml({
    macros: hasMacros,
    ttl: hasTtl,
    env: hasEnv,
    apiKeys: hasApiKeys
  })

  // Start with base YAML
  let modelsSection = baseConfig
  let suffixSections = ''

  // Features that add new model entries
  const modelFeatureOrder = ['docker']
  // Features that add sections after models
  const suffixOrder = ['groups', 'hooks']

  // Add model snippets
  for (const featureId of modelFeatureOrder) {
    if (selectedFeatures.has(featureId)) {
      const snippet = featureSnippets[featureId]
      if (snippet?.models) {
        modelsSection += snippet.models
      }
    }
  }

  // Add suffix sections (groups, hooks)
  for (const featureId of suffixOrder) {
    if (selectedFeatures.has(featureId)) {
      const snippet = featureSnippets[featureId]
      if (snippet?.topLevel) {
        suffixSections += snippet.topLevel
      }
    }
  }

  // Combine into final YAML
  const yamlString = modelsSection + suffixSections

  // Calculate line features for highlighting
  const lines = yamlString.split('\n')

  // Mark lines based on features that modify base config
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Mark apiKeys-related lines
    if (hasApiKeys) {
      if (
        line.includes('apiKeys:') ||
        line.includes('sk-api-key-') ||
        line.includes('# API Keys -')
      ) {
        lineFeatures.set(lineNum, 'apiKeys')
      }
    }

    // Mark macros-related lines
    if (hasMacros) {
      if (
        line.includes('macros:') ||
        line.includes('llama-bin:') ||
        line.includes('model-path:') ||
        line.includes('${llama-bin}') ||
        line.includes('${model-path}') ||
        line.includes('# Macros -')
      ) {
        lineFeatures.set(lineNum, 'macros')
      }
    }

    // Mark TTL-related lines
    if (hasTtl && line.includes('ttl:')) {
      lineFeatures.set(lineNum, 'ttl')
    }

    // Mark env-related lines
    if (hasEnv) {
      if (line.includes('env:') || line.includes('CUDA_VISIBLE_DEVICES')) {
        lineFeatures.set(lineNum, 'env')
      }
    }
  }

  // Mark model snippet lines
  const baseLines = baseConfig.split('\n').length
  let currentLine = baseLines + 1

  for (const featureId of modelFeatureOrder) {
    if (selectedFeatures.has(featureId)) {
      const snippet = featureSnippets[featureId]
      if (snippet?.models) {
        const snippetLines = snippet.models.split('\n').length
        for (let i = 0; i < snippetLines; i++) {
          lineFeatures.set(currentLine + i, featureId)
        }
        currentLine += snippetLines
      }
    }
  }

  // Mark suffix section lines
  for (const featureId of suffixOrder) {
    if (selectedFeatures.has(featureId)) {
      const snippet = featureSnippets[featureId]
      if (snippet?.topLevel) {
        const snippetLines = snippet.topLevel.split('\n').length
        for (let i = 0; i < snippetLines; i++) {
          lineFeatures.set(currentLine + i, featureId)
        }
        currentLine += snippetLines
      }
    }
  }

  return {
    yaml: yamlString,
    lineCount: lines.length,
    lineFeatures
  }
}
