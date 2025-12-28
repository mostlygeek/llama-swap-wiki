export interface Example {
  id: string
  name: string
  description: string
  content: string
}

export const examples: Example[] = [
  {
    id: 'minimal',
    name: 'Minimal Configuration',
    description: 'The simplest possible llama-swap configuration',
    content: `# Minimal llama-swap configuration
models:
  my-model:
    cmd: llama-server --port \${PORT} --model /path/to/model.gguf
`
  },
  {
    id: 'multiple',
    name: 'Multiple Models',
    description: 'Configure multiple models that swap automatically',
    content: `# Multiple models configuration
models:
  llama-8b:
    cmd: llama-server --port \${PORT} --model /models/llama-8b.gguf
    name: "Llama 3.1 8B"
    description: "Fast general-purpose model"

  qwen-32b:
    cmd: llama-server --port \${PORT} --model /models/qwen-32b.gguf
    name: "Qwen 2.5 Coder 32B"
    description: "Specialized coding model"

  phi-3:
    cmd: llama-server --port \${PORT} --model /models/phi-3.gguf
    name: "Phi-3 Mini"
    description: "Small but capable model"
`
  },
  {
    id: 'docker',
    name: 'Docker/Podman',
    description: 'Run models in containers with graceful shutdown',
    content: `# Docker/Podman configuration
models:
  docker-llama:
    proxy: "http://127.0.0.1:\${PORT}"
    cmd: |
      docker run --name \${MODEL_ID}
      --init --rm -p \${PORT}:8080
      -v /mnt/models:/models
      ghcr.io/ggml-org/llama.cpp:server
      --model '/models/llama-8b.gguf'
    cmdStop: docker stop \${MODEL_ID}
`
  },
  {
    id: 'macros',
    name: 'Using Macros',
    description: 'Reduce repetition with reusable macros',
    content: `# Configuration with macros
macros:
  llama-bin: "/usr/local/bin/llama-server"
  model-path: "/mnt/nvme/models"
  default-ctx: 4096

models:
  llama-8b:
    cmd: \${llama-bin} --port \${PORT} --model \${model-path}/llama-8b.gguf --ctx-size \${default-ctx}

  qwen-32b:
    macros:
      default-ctx: 16384  # Override for this model
    cmd: \${llama-bin} --port \${PORT} --model \${model-path}/qwen-32b.gguf --ctx-size \${default-ctx}
`
  },
  {
    id: 'groups',
    name: 'Groups & TTL',
    description: 'Advanced model management with groups and auto-unloading',
    content: `# Groups and TTL configuration
models:
  # Large models that swap
  llama-70b:
    cmd: llama-server --port \${PORT} --model /models/llama-70b.gguf
    ttl: 600  # Auto-unload after 10 minutes

  qwen-72b:
    cmd: llama-server --port \${PORT} --model /models/qwen-72b.gguf
    ttl: 600

  # Small embedding model (always loaded)
  embeddings:
    cmd: llama-server --port \${PORT} --model /models/embeddings.gguf --embedding

groups:
  # Only one large model at a time
  large-models:
    swap: true
    exclusive: true
    members:
      - llama-70b
      - qwen-72b

  # Embeddings stay loaded
  persistent:
    swap: false
    exclusive: false
    persistent: true
    members:
      - embeddings

hooks:
  on_startup:
    preload:
      - embeddings
`
  },
  {
    id: 'aliases',
    name: 'Aliases & API Keys',
    description: 'Serve local models as OpenAI models with authentication',
    content: `# Aliases and API keys
apiKeys:
  - "sk-local-development-key"

models:
  llama-8b:
    cmd: llama-server --port \${PORT} --model /models/llama-8b.gguf
    name: "Llama 3.1 8B"
    aliases:
      - "gpt-4o-mini"
      - "gpt-3.5-turbo"

  qwen-32b:
    cmd: llama-server --port \${PORT} --model /models/qwen-32b.gguf
    name: "Qwen 2.5 Coder 32B"
    aliases:
      - "gpt-4o"
`
  },
  {
    id: 'complete',
    name: 'Complete Example',
    description: 'Real-world configuration with all features',
    content: `# Complete llama-swap configuration
logLevel: info
healthCheckTimeout: 180
startPort: 10000

macros:
  llama-bin: "/usr/local/bin/llama-server"
  models-dir: "/mnt/nvme/models"

models:
  # Fast draft model
  draft:
    cmd: \${llama-bin} --port \${PORT} --model \${models-dir}/qwen-0.5b.gguf
    name: "Qwen 2.5 Coder 0.5B (Draft)"
    ttl: 600

  # Main coding model with speculative decoding
  coder:
    cmd: \${llama-bin} --port \${PORT} --model \${models-dir}/qwen-32b.gguf --draft \${models-dir}/qwen-0.5b.gguf
    name: "Qwen 2.5 Coder 32B"
    aliases:
      - "gpt-4o"
    env:
      - "CUDA_VISIBLE_DEVICES=0,1"

  # Embedding model (always loaded)
  embeddings:
    cmd: \${llama-bin} --port \${PORT} --model \${models-dir}/nomic-embed.gguf --embedding
    name: "Nomic Embed"

groups:
  main-models:
    swap: true
    exclusive: true
    members:
      - draft
      - coder

  persistent:
    swap: false
    exclusive: false
    persistent: true
    members:
      - embeddings

hooks:
  on_startup:
    preload:
      - embeddings

apiKeys:
  - "sk-local-development-key"
`
  }
]
