export interface Feature {
  id: string
  label: string
  description: string
}

export const features: Feature[] = [
  {
    id: 'docker',
    label: 'Run models in Docker',
    description: 'Use containers with graceful shutdown'
  },
  {
    id: 'macros',
    label: 'Use macros for reusable values',
    description: 'Reduce repetition with variables'
  },
  {
    id: 'groups',
    label: 'Group models for exclusive access',
    description: 'Control which models can run together'
  },
  {
    id: 'apiKeys',
    label: 'Enable API key authentication',
    description: 'Require authentication for requests'
  },
  {
    id: 'ttl',
    label: 'Set model TTL (auto-unload)',
    description: 'Automatically unload idle models'
  },
  {
    id: 'hooks',
    label: 'Preload models on startup',
    description: 'Start models when llama-swap launches'
  },
  {
    id: 'env',
    label: 'Use environment variables',
    description: 'Set env vars like CUDA_VISIBLE_DEVICES'
  },
  {
    id: 'embedding',
    label: 'Configure an embedding model',
    description: 'Add a model for embeddings/RAG'
  }
]

// Build base YAML dynamically based on selected features
export function buildBaseYaml(options: {
  macros: boolean
  ttl: boolean
  env: boolean
}): string {
  const lines: string[] = []

  lines.push('# llama-swap configuration')
  lines.push('# Models are loaded on-demand and swapped automatically')

  // Add macros section if enabled
  if (options.macros) {
    lines.push('')
    lines.push('# Macros - reusable values substituted with ${macro-name}')
    lines.push('macros:')
    lines.push('  llama-bin: /usr/local/bin/llama-server')
    lines.push('  model-path: /mnt/nvme/models')
  }

  lines.push('')
  lines.push('models:')

  // First model
  lines.push('  # First model - a fast general-purpose model')
  lines.push('  llama-8b:')
  if (options.macros) {
    lines.push(
      '    cmd: ${llama-bin} --port ${PORT} --model ${model-path}/llama-8b.gguf'
    )
  } else {
    lines.push(
      '    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf'
    )
  }
  lines.push('    name: Llama 3.1 8B')
  if (options.ttl) {
    lines.push('    ttl: 600  # Auto-unload after 10 minutes of inactivity')
  }
  if (options.env) {
    lines.push('    env:')
    lines.push('      - CUDA_VISIBLE_DEVICES=0  # Use first GPU')
  }

  lines.push('')

  // Second model
  lines.push('  # Second model - a larger coding-focused model')
  lines.push('  qwen-32b:')
  if (options.macros) {
    lines.push(
      '    cmd: ${llama-bin} --port ${PORT} --model ${model-path}/qwen-32b.gguf'
    )
  } else {
    lines.push(
      '    cmd: llama-server --port ${PORT} --model /models/qwen-32b.gguf'
    )
  }
  lines.push('    name: Qwen 2.5 Coder 32B')
  if (options.ttl) {
    lines.push('    ttl: 600  # Auto-unload after 10 minutes of inactivity')
  }
  if (options.env) {
    lines.push('    env:')
    lines.push('      - CUDA_VISIBLE_DEVICES=1  # Use second GPU')
  }

  return lines.join('\n')
}

// Feature-specific YAML snippets with comments
export const featureSnippets: Record<
  string,
  { models?: string; topLevel?: string }
> = {
  docker: {
    models: `
  # Docker model - uses proxy to connect to containerized server
  docker-llama:
    proxy: http://127.0.0.1:\${PORT}
    cmd: |
      docker run --name \${MODEL_ID}
        --init --rm -p \${PORT}:8080
        -v /mnt/models:/models
        ghcr.io/ggml-org/llama.cpp:server
        --model '/models/llama-8b.gguf'
    # Command to gracefully stop the container
    cmdStop: docker stop \${MODEL_ID}`
  },

  groups: {
    topLevel: `

# Groups - control which models can run simultaneously
groups:
  main-models:
    swap: true       # Unload other models in group when switching
    exclusive: true  # Only one model from this group at a time
    members:
      - llama-8b
      - qwen-32b`
  },

  apiKeys: {
    topLevel: `

# API Keys - require authentication for requests
apiKeys:
  - sk-your-api-key-here`
  },

  hooks: {
    topLevel: `

# Hooks - actions triggered on startup/shutdown
hooks:
  on_startup:
    # Preload these models when llama-swap starts
    preload:
      - llama-8b`
  },

  embedding: {
    models: `
  # Embedding model for RAG/vector search
  embeddings:
    cmd: llama-server --port \${PORT} --model /models/nomic-embed.gguf --embedding
    name: Nomic Embed
    # Aliases let you use OpenAI-compatible embedding model names
    aliases:
      - text-embedding-3-small`
  }
}
