export interface ConfigConcept {
  id: string
  keywords: string[]
  title: string
  description: string
  example?: string
}

export const configConcepts: ConfigConcept[] = [
  // Global settings
  {
    id: 'healthCheckTimeout',
    keywords: ['healthCheckTimeout'],
    title: 'Health Check Timeout',
    description: 'How long (in seconds) to wait for a model to be ready. The minimum is 15 seconds. This is the global default; individual models may take longer to load depending on their size.',
    example: 'healthCheckTimeout: 500'
  },
  {
    id: 'logLevel',
    keywords: ['logLevel'],
    title: 'Log Level',
    description: 'Controls the verbosity of logging output. Options include debug, info, warn, or error.',
    example: 'logLevel: info'
  },
  {
    id: 'logTimeFormat',
    keywords: ['logTimeFormat'],
    title: 'Log Time Format',
    description: 'Enables timestamp formatting in logs using Go time constants. Common values: "kitchen" for 3:04PM format, or leave empty to disable timestamps.',
    example: 'logTimeFormat: "kitchen"'
  },
  {
    id: 'logToStdout',
    keywords: ['logToStdout'],
    title: 'Log to Stdout',
    description: 'Determines what gets logged to standard output. Options: "proxy" for proxy logs only, "upstream" for model server logs, "both" for all logs, or "none" to disable.',
    example: 'logToStdout: "proxy"'
  },
  {
    id: 'metricsMaxInMemory',
    keywords: ['metricsMaxInMemory'],
    title: 'Metrics Max In Memory',
    description: 'Limits the number of stored metrics before older ones are discarded. Useful for controlling memory usage in long-running instances.',
    example: 'metricsMaxInMemory: 1000'
  },
  {
    id: 'startPort',
    keywords: ['startPort'],
    title: 'Start Port',
    description: 'Sets the initial port number for the ${PORT} macro. Each model gets an incremented port number starting from this value.',
    example: 'startPort: 10001'
  },
  {
    id: 'sendLoadingState',
    keywords: ['sendLoadingState'],
    title: 'Send Loading State',
    description: 'When enabled, injects loading status updates into the reasoning field for UI feedback. Helps users see when a model is being loaded.',
    example: 'sendLoadingState: true'
  },
  {
    id: 'includeAliasesInList',
    keywords: ['includeAliasesInList'],
    title: 'Include Aliases in List',
    description: 'When true, shows model aliases in /v1/models API responses. Useful for exposing alternative model names to clients.',
    example: 'includeAliasesInList: false'
  },
  {
    id: 'apiKeys',
    keywords: ['apiKeys'],
    title: 'API Keys',
    description: 'List of required authorization keys for inference endpoint access. Requests must include a valid key in the Authorization header.',
    example: 'apiKeys: ["sk-key1", "sk-key2"]'
  },

  // Macros section
  {
    id: 'macros',
    keywords: ['macros'],
    title: 'Macros',
    description: 'Reusable string substitutions that can be used in commands, proxies, and filters. Macros follow naming rules (alphanumeric, underscore, hyphen) and can reference other macros. Use ${macro-name} syntax to reference them.',
    example: 'macros:\n  server-latest: /path/to/llama-server'
  },

  // Models section
  {
    id: 'models',
    keywords: ['models'],
    title: 'Models',
    description: 'The core configuration section defining each inference model. Each model has a unique ID (the key) and configuration for how to launch and manage it.',
  },
  {
    id: 'cmd',
    keywords: ['cmd'],
    title: 'Command',
    description: 'The shell command to launch the inference server. Supports multiline YAML syntax with | and inline comments. Use macros like ${PORT} and ${MODEL_ID} for dynamic values.',
    example: 'cmd: |\n  llama-server --port ${PORT}\n  --model ./model.gguf'
  },
  {
    id: 'name',
    keywords: ['name'],
    title: 'Model Name',
    description: 'Display name shown in API responses. This is what clients see when listing available models.',
    example: 'name: "Llama 3.1 8B Instruct"'
  },
  {
    id: 'description',
    keywords: ['description'],
    title: 'Description',
    description: 'Brief explanation included in model metadata. Provides additional context about the model capabilities.',
    example: 'description: "A small but capable model for general tasks"'
  },
  {
    id: 'env',
    keywords: ['env'],
    title: 'Environment Variables',
    description: 'Environment variables injected into the command execution context. Commonly used for GPU selection with CUDA_VISIBLE_DEVICES.',
    example: 'env:\n  - CUDA_VISIBLE_DEVICES=0,1'
  },
  {
    id: 'proxy',
    keywords: ['proxy'],
    title: 'Proxy URL',
    description: 'URL where API requests route to. Defaults to http://localhost:${PORT}. Override this when using external services or custom ports.',
    example: 'proxy: http://127.0.0.1:8999'
  },
  {
    id: 'aliases',
    keywords: ['aliases'],
    title: 'Aliases',
    description: 'Alternative model names that map to this configuration. Useful for OpenAI API compatibility or providing multiple names for the same model.',
    example: 'aliases: ["gpt-4o-mini", "gpt-3.5-turbo"]'
  },
  {
    id: 'checkEndpoint',
    keywords: ['checkEndpoint'],
    title: 'Health Check Endpoint',
    description: 'The endpoint path used for health checks. Defaults to /health. Set to "none" to skip health checks, or customize for non-standard servers.',
    example: 'checkEndpoint: /v1/models'
  },
  {
    id: 'ttl',
    keywords: ['ttl'],
    title: 'Time to Live',
    description: 'Auto-unload the model after the specified number of seconds of inactivity. Set to 0 to disable automatic unloading.',
    example: 'ttl: 300'
  },
  {
    id: 'useModelName',
    keywords: ['useModelName'],
    title: 'Use Model Name',
    description: 'Override the model identifier sent to the upstream server. Useful when the upstream expects a specific model name different from your config.',
    example: 'useModelName: "tts-1"'
  },
  {
    id: 'filters',
    keywords: ['filters'],
    title: 'Filters',
    description: 'Request filtering options applied before forwarding to the model. Currently supports parameter removal via stripParams.',
  },
  {
    id: 'strip_params',
    keywords: ['strip_params', 'stripParams'],
    title: 'Strip Parameters',
    description: 'Comma-separated list of parameters to remove from requests before forwarding. Useful for maintaining server defaults. The "model" parameter is never stripped.',
    example: 'strip_params: "temperature, top_p, top_k"'
  },
  {
    id: 'metadata',
    keywords: ['metadata'],
    title: 'Metadata',
    description: 'Arbitrary key-value pairs returned in API model listings. Supports macro expansion for dynamic values.',
    example: 'metadata:\n  port: ${PORT}\n  gpu: "RTX 4090"'
  },
  {
    id: 'concurrencyLimit',
    keywords: ['concurrencyLimit'],
    title: 'Concurrency Limit',
    description: 'Maximum number of parallel requests allowed for this model. Exceeding this limit triggers HTTP 429 (Too Many Requests). Set to 0 to use the default.',
    example: 'concurrencyLimit: 4'
  },
  {
    id: 'unlisted',
    keywords: ['unlisted'],
    title: 'Unlisted',
    description: 'When true, the model does not appear in /v1/models API responses. The model is still accessible by name, just hidden from listings.',
    example: 'unlisted: true'
  },
  {
    id: 'cmdStop',
    keywords: ['cmdStop'],
    title: 'Stop Command',
    description: 'Command to gracefully stop the model process. Useful for Docker containers or processes that need special shutdown handling.',
    example: 'cmdStop: docker stop ${MODEL_ID}'
  },

  // Groups section
  {
    id: 'groups',
    keywords: ['groups'],
    title: 'Groups',
    description: 'Advanced model management allowing multiple loading strategies. Groups let you control how models are loaded together or swapped.',
  },
  {
    id: 'swap',
    keywords: ['swap'],
    title: 'Swap Mode',
    description: 'Controls whether only one model runs at a time (true) or all group members run simultaneously (false). When true, loading one model unloads others in the group.',
    example: 'swap: true'
  },
  {
    id: 'exclusive',
    keywords: ['exclusive'],
    title: 'Exclusive',
    description: 'When true, activating this group unloads models from other groups. Useful for GPU memory management when groups compete for resources.',
    example: 'exclusive: true'
  },
  {
    id: 'persistent',
    keywords: ['persistent'],
    title: 'Persistent',
    description: 'Prevents other groups from unloading these models. Useful for models that should always remain loaded.',
    example: 'persistent: true'
  },
  {
    id: 'members',
    keywords: ['members'],
    title: 'Group Members',
    description: 'List of model IDs belonging to this group. Models must be defined in the models section.',
    example: 'members:\n  - embedding\n  - reranker'
  },

  // Hooks section
  {
    id: 'hooks',
    keywords: ['hooks'],
    title: 'Hooks',
    description: 'Event-driven actions triggered during system operation. Hooks allow you to run custom actions at specific lifecycle points.',
  },
  {
    id: 'on_startup',
    keywords: ['on_startup'],
    title: 'On Startup',
    description: 'Actions performed when llama-swap starts. Commonly used to preload models.',
  },
  {
    id: 'preload',
    keywords: ['preload'],
    title: 'Preload',
    description: 'List of model IDs to load automatically on startup. Models are loaded in order.',
    example: 'preload:\n  - llama-8B'
  },

  // Peers section
  {
    id: 'peers',
    keywords: ['peers'],
    title: 'Peers',
    description: 'Remote llama-swap instances or external API providers. Peers allow you to distribute load or connect to external services like OpenRouter.',
  },
  {
    id: 'apiKey',
    keywords: ['apiKey'],
    title: 'API Key (Peer)',
    description: 'Authentication credential injected as Bearer token when forwarding requests to a peer. Used for authenticated external APIs.',
    example: 'apiKey: sk-your-openrouter-key'
  },
]

// Helper to find a concept by checking if a line matches any keyword
export function findConceptForLine(line: string): ConfigConcept | null {
  const trimmed = line.trim()

  // Skip empty lines and pure comments
  if (!trimmed || trimmed.startsWith('#')) {
    return null
  }

  for (const concept of configConcepts) {
    for (const keyword of concept.keywords) {
      // Match "keyword:" at any indentation level
      const keyPattern = new RegExp(`^\\s*${keyword}\\s*:`)
      if (keyPattern.test(line)) {
        return concept
      }
    }
  }
  return null
}
