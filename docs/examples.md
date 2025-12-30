---
title: Configuration Examples
description: Learn llama-swap configuration through practical examples
outline: [2, 3]
---

<script setup>
import { data } from './examples.data'
</script>

# Configuration Examples

llama-swap is designed to be powerful and has many feature for you to customize your deployment. It is also designed for complexity to be incremental.

Here is the most minimal configuration.

```yaml
models:
  my-model:
    cmd: llama-server --port ${PORT} --model /path/to/model.gguf
```

Everything else is optional. Add groups to run multiple models at once, use macros to reduce repetition, set ttl values to automatically unload models and many more options.

## Frequently used options

These are the most frequently used configuration options.

### Multiple Models

Define several models and llama-swap will swap between them on demand. Only one model runs at a time by default, freeing up GPU memory when switching.

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
    name: "Llama 3.1 8B"

  qwen-32b:
    cmd: llama-server --port ${PORT} --model /models/qwen-32b.gguf
    name: "Qwen 2.5 Coder 32B"

  phi-3:
    cmd: llama-server --port ${PORT} --model /models/phi-3.gguf
    name: "Phi-3 Mini"
```

When you request a model, llama-swap will unload the currently running model and start the new one.

### Using Macros

Macros let you define reusable values to avoid repeating paths, flags, or settings across models.

```yaml
macros:
  llama-bin: "/usr/local/bin/llama-server"
  model-path: "/mnt/nvme/models"
  default-ctx: 4096

models:
  llama-8b:
    cmd: ${llama-bin} --port ${PORT} --model ${model-path}/llama-8b.gguf --ctx-size ${default-ctx}

  qwen-32b:
    cmd: ${llama-bin} --port ${PORT} --model ${model-path}/qwen-32b.gguf --ctx-size ${default-ctx}
```

Model-specific macros override global ones:

```yaml
macros:
  default-ctx: 4096

models:
  large-context:
    macros:
      default-ctx: 32768
    cmd: llama-server --port ${PORT} --ctx-size ${default-ctx} --model /models/model.gguf
```

Macros can reference other macros (must be defined before use):

```yaml
macros:
  llama-bin: "/usr/local/bin/llama-server"
  default-ctx: 4096
  default-args: "--ctx-size ${default-ctx}"

models:
  my-model:
    cmd: ${llama-bin} --port ${PORT} ${default-args} --model /models/model.gguf
```

### Model Groups

Groups control which models can run together and how they interact. Use them to keep embedding models always loaded, run small models side-by-side, or ensure large models get exclusive GPU access.

#### Exclusive Group (Default Behavior)

Only one model runs at a time:

```yaml
groups:
  main:
    swap: true # Only one model at a time
    exclusive: true # Unload other groups when loading
    members:
      - llama-8b
      - qwen-32b
```

#### Persistent Models

Models that stay loaded and can't be unloaded by other groups:

```yaml
groups:
  embeddings:
    swap: false # All models can run together
    exclusive: false # Don't unload other groups
    persistent: true # Other groups can't unload these
    members:
      - embedding-model
```

#### Mixed Setup

```yaml
groups:
  # Small models that can run together
  small-models:
    swap: false
    exclusive: false
    members:
      - phi-3
      - llama-1b

  # Large models that need exclusive GPU access
  large-models:
    swap: true
    exclusive: true
    members:
      - qwen-72b
      - llama-70b
```

### Aliases

Make your models available under different names. Useful for compatibility with clients that expect specific model names like OpenAI's.

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
    aliases:
      - "gpt-4o-mini"
      - "gpt-3.5-turbo"
```

Now clients can request `gpt-4o-mini` and get your local llama-8b model.

### TTL Auto-Unloading

Free up resources automatically when a model hasn't been used for a while. Good for shared machines or when running many models.

```yaml
models:
  temp-model:
    cmd: llama-server --port ${PORT} --model /models/model.gguf
    ttl: 300 # Unload after 5 minutes of inactivity
```

### Preload on Startup

Have models ready immediately when llama-swap starts, avoiding the first-request delay.

```yaml
hooks:
  on_startup:
    preload:
      - llama-8b
      - embedding-model

models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
  embedding-model:
    cmd: llama-server --port ${PORT} --model /models/embeddings.gguf
```

### Environment Variables

Set environment variables for a model's process. Useful for GPU selection, thread counts, or any runtime configuration.

```yaml
models:
  gpu-model:
    cmd: llama-server --port ${PORT} --model /models/model.gguf
    env:
      - "CUDA_VISIBLE_DEVICES=0,1"
      - "OMP_NUM_THREADS=8"
```

### Docker/Podman Setup

Run inference servers in containers. llama-swap manages the container lifecycle just like local processes.

```yaml
models:
  docker-llama:
    proxy: "http://127.0.0.1:${PORT}"
    cmd: |
      docker run --name ${MODEL_ID}
      --init --rm -p ${PORT}:8080
      -v /mnt/models:/models
      ghcr.io/ggml-org/llama.cpp:server
      --model '/models/llama-8b.gguf'
    cmdStop: docker stop ${MODEL_ID}
```

The `cmdStop` ensures graceful container shutdown. The `${MODEL_ID}` macro gives you the model's key name.

## Advanced Configuration

### API Key Authentication

Protect your endpoints with API keys. All inference requests must include a valid key.

```yaml
apiKeys:
  - "sk-your-secret-key"
  - "sk-another-key-for-different-user"

models:
  my-model:
    cmd: llama-server --port ${PORT} --model /path/to/model.gguf
```

When `apiKeys` is set, all requests must include a valid key in the `Authorization: Bearer <key>` header.

### Peers (Remote Models)

Connect to other llama-swap instances or external APIs. Requests are proxied transparently, so clients see all models in one place.

```yaml
peers:
  # Another llama-swap instance on your network
  remote-server:
    proxy: http://192.168.1.50:8080
    models:
      - remote-llama
      - remote-embeddings

  # External API with authentication
  openrouter:
    proxy: https://openrouter.ai/api
    apiKey: sk-your-openrouter-key
    models:
      - meta-llama/llama-3.1-8b-instruct
      - deepseek/deepseek-v3
      - anthropic/claude-3-sonnet
```

Peer models appear in your `/v1/models` listing and requests are proxied transparently.

These options provide fine-grained control over model behavior.

### Request Filtering

Remove specific parameters from incoming requests. Useful to enforce server-side sampling settings that clients can't override.

```yaml
models:
  fixed-temp:
    cmd: llama-server --port ${PORT} --model /models/model.gguf
    filters:
      stripParams: "temperature, top_p, top_k"
```

### Loading State Notifications

Show users that a model is loading in chat UIs that support the reasoning field. Helpful when models take time to start.

```yaml
sendLoadingState: true # Global setting

models:
  with-loading:
    cmd: llama-server --port ${PORT} --model /models/slow.gguf
    # Uses global sendLoadingState: true

  without-loading:
    cmd: llama-server --port ${PORT} --model /models/fast.gguf
    sendLoadingState: false # Override for this model
```

### Unlisted Models

Keep models accessible but hidden from the model list. Good for internal or experimental models you don't want clients to discover.

```yaml
models:
  internal-model:
    cmd: llama-server --port ${PORT} --model /models/internal.gguf
    unlisted: true # Won't appear in model listings
```

### Model Name Override

Send a different model name to the upstream server. Useful when proxying to Ollama or other servers that expect specific names.

```yaml
models:
  my-qwen:
    cmd: ollama serve
    proxy: http://127.0.0.1:11434
    useModelName: "qwen:qwq" # Send this name to upstream instead of "my-qwen"
```

### Model Metadata

Attach extra information to models that appears in the `/v1/models` API. Useful for clients that need to know context sizes, capabilities, or other details.

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
    metadata:
      context_length: 8192
      quantization: "Q4_K_M"
      capabilities:
        - "chat"
        - "completion"
      note: "Running ${MODEL_ID} on port ${PORT}"
```

Macros work inside metadata values.

### Include Aliases in Model List

By default, aliases don't appear as separate entries in `/v1/models`. Enable this to list them individually.

```yaml
includeAliasesInList: true

models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
    aliases:
      - "gpt-4o-mini"
```

## Troubleshooting & Tuning

These settings help diagnose issues and tune performance.

### Logging Configuration

When things aren't working, increase log verbosity or include upstream server output to see what's happening.

```yaml
# Log level: debug, info, warn, error (default: info)
logLevel: debug

# Log timestamp format (default: "" disabled)
# Valid: ansic, unixdate, rfc3339, kitchen, stamp, etc.
logTimeFormat: "rfc3339"

# What to log to stdout: proxy, upstream, both, none (default: proxy)
# Use "upstream" or "both" to see inference server output
logToStdout: "both"

models:
  my-model:
    cmd: llama-server --port ${PORT} --model /path/to/model.gguf
```

### Health Check Configuration

Configure health check behavior including custom endpoints, timeouts, and disabling checks entirely.

```yaml
# Health check timeout (seconds, default: 120, minimum: 15)
healthCheckTimeout: 300

models:
  # Custom health endpoint (default is /health)
  custom-server:
    cmd: ./my-server --port ${PORT}
    checkEndpoint: /api/health

  # Skip health checking for faster startup
  no-health-check:
    cmd: ./simple-server --port ${PORT}
    checkEndpoint: none

  # Large model with extended timeout
  large-model:
    cmd: llama-server --port ${PORT} --model /models/70b-model.gguf
```

### Concurrency Limits

Prevent a model from being overwhelmed by too many parallel requests. Excess requests get a 429 response.

```yaml
models:
  limited-model:
    cmd: llama-server --port ${PORT} --model /models/model.gguf
    concurrencyLimit: 5 # Max 5 parallel requests (default: 10)
```

Requests exceeding the limit receive HTTP 429 Too Many Requests.

### Metrics Memory Limit

llama-swap keeps request metrics in memory. Reduce this if you're running on a memory-constrained system.

```yaml
# Max metrics kept in memory (default: 1000)
metricsMaxInMemory: 500

models:
  my-model:
    cmd: llama-server --port ${PORT} --model /path/to/model.gguf
```

### Port Configuration

The `${PORT}` macro auto-assigns ports starting from a configurable base. Change it if the default range conflicts with other services.

```yaml
# Starting port for ${PORT} macro (default: 5800)
startPort: 10000

models:
  model-a:
    cmd: llama-server --port ${PORT} --model /models/a.gguf # Gets port 10000
  model-b:
    cmd: llama-server --port ${PORT} --model /models/b.gguf # Gets port 10001
```

## Full Example

This is the canonical [config.example.yaml](https://github.com/mostlygeek/llama-swap/blob/main/config.example.yaml) from the github repo. It is always the most up to date reference of what llama-swap supports:

<ConfigExample :yaml="data.configExample" />

You can also use the [Interactive Configuration Tool](/configuration) to build your config file with live validation.
