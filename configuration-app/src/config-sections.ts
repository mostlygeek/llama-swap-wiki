export interface Feature {
  id: string
  label: string
  description: string
}

export const features: Feature[] = [
  {
    id: 'multiple',
    label: 'Add multiple models',
    description: 'Configure more than one model for swapping'
  },
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
  },
  {
    id: 'speculative',
    label: 'Enable speculative decoding',
    description: 'Use a draft model for faster inference'
  }
]

// Base configuration that always appears
export const baseConfig = {
  models: {
    'my-model': {
      cmd: 'llama-server --port ${PORT} --model /path/to/model.gguf'
    }
  }
}

// Feature-specific configurations to merge
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const featureConfigs: Record<string, any> = {
  multiple: {
    models: {
      'llama-8b': {
        cmd: 'llama-server --port ${PORT} --model /models/llama-8b.gguf',
        name: 'Llama 3.1 8B',
        description: 'Fast general-purpose model'
      },
      'qwen-32b': {
        cmd: 'llama-server --port ${PORT} --model /models/qwen-32b.gguf',
        name: 'Qwen 2.5 Coder 32B',
        description: 'Specialized coding model'
      }
    }
  },

  docker: {
    models: {
      'docker-llama': {
        proxy: 'http://127.0.0.1:${PORT}',
        cmd: `docker run --name \${MODEL_ID}
  --init --rm -p \${PORT}:8080
  -v /mnt/models:/models
  ghcr.io/ggml-org/llama.cpp:server
  --model '/models/llama-8b.gguf'`,
        cmdStop: 'docker stop ${MODEL_ID}'
      }
    }
  },

  macros: {
    macros: {
      'llama-bin': '/usr/local/bin/llama-server',
      'model-path': '/mnt/nvme/models',
      'default-ctx': 4096
    }
  },

  groups: {
    groups: {
      'main-models': {
        swap: true,
        exclusive: true,
        members: ['my-model']
      }
    }
  },

  apiKeys: {
    apiKeys: ['sk-your-api-key-here']
  },

  ttl: {
    models: {
      'my-model': {
        ttl: 600
      }
    }
  },

  hooks: {
    hooks: {
      on_startup: {
        preload: ['my-model']
      }
    }
  },

  env: {
    models: {
      'my-model': {
        env: ['CUDA_VISIBLE_DEVICES=0']
      }
    }
  },

  embedding: {
    models: {
      embeddings: {
        cmd: 'llama-server --port ${PORT} --model /models/nomic-embed.gguf --embedding',
        name: 'Nomic Embed',
        aliases: ['text-embedding-3-small']
      }
    }
  },

  speculative: {
    models: {
      draft: {
        cmd: 'llama-server --port ${PORT} --model /models/qwen-0.5b.gguf',
        name: 'Qwen 2.5 Coder 0.5B (Draft)',
        description: 'Fast draft model for speculative decoding'
      },
      'main-model': {
        cmd: 'llama-server --port ${PORT} --model /models/qwen-32b.gguf --draft /models/qwen-0.5b.gguf',
        name: 'Qwen 2.5 Coder 32B',
        description: 'Main model with speculative decoding'
      }
    }
  }
}
