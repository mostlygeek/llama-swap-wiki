---
title: Configuration Examples
description: Learn llama-swap configuration through practical examples
---

# Configuration Examples

Learn how to configure llama-swap through practical examples.

## Minimal Configuration

The simplest possible setup:

```yaml
models:
  my-model:
    cmd: llama-server --port ${PORT} --model /path/to/model.gguf
```

## Multiple Models

Swap between multiple models:

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
    name: "Llama 3.1 8B"
    description: "Fast general-purpose model"

  qwen-32b:
    cmd: llama-server --port ${PORT} --model /models/qwen-32b.gguf
    name: "Qwen 2.5 Coder 32B"
    description: "Specialized coding model with large context"

  phi-3:
    cmd: llama-server --port ${PORT} --model /models/phi-3.gguf
    name: "Phi-3 Mini"
```

When you request a model, llama-swap will unload the currently running model and start the new one.

## Global Settings

Configure llama-swap behavior:

```yaml
# Health check timeout (seconds, default: 120)
healthCheckTimeout: 180

# Log level: debug, info, warn, error (default: info)
logLevel: info

# Log timestamp format (default: "" disabled)
# Valid: ansic, unixdate, rfc3339, kitchen, stamp, etc.
logTimeFormat: "rfc3339"

# What to log to stdout: proxy, upstream, both, none (default: proxy)
logToStdout: "proxy"

# Starting port for ${PORT} macro (default: 5800)
startPort: 10000

# Max metrics kept in memory (default: 1000)
metricsMaxInMemory: 1000

# Send loading status in reasoning field (default: false)
sendLoadingState: true

# Include aliases in /v1/models listing (default: false)
includeAliasesInList: true

models:
  my-model:
    cmd: llama-server --port ${PORT} --model /path/to/model.gguf
```

## API Key Authentication

Require API keys for inference endpoints:

```yaml
apiKeys:
  - "sk-your-secret-key"
  - "sk-another-key-for-different-user"

models:
  my-model:
    cmd: llama-server --port ${PORT} --model /path/to/model.gguf
```

When `apiKeys` is set, all requests must include a valid key in the `Authorization: Bearer <key>` header.

## Docker/Podman Setup

Run inference servers in containers:

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

## Using Macros

Reduce repetition with macros:

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

## Groups for Advanced Control

### Exclusive Group (Default Behavior)

Only one model runs at a time:

```yaml
groups:
  main:
    swap: true       # Only one model at a time
    exclusive: true  # Unload other groups when loading
    members:
      - llama-8b
      - qwen-32b
```

### Persistent Models

Models that never get unloaded:

```yaml
groups:
  embeddings:
    swap: false        # All models can run together
    exclusive: false   # Don't unload other groups
    persistent: true   # Other groups can't unload these
    members:
      - embedding-model
```

### Mixed Setup

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

## TTL Auto-Unloading

Automatically unload models after inactivity:

```yaml
models:
  temp-model:
    cmd: llama-server --port ${PORT} --model /models/model.gguf
    ttl: 300  # Unload after 5 minutes of inactivity
```

## Aliases

Serve models under different names:

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
    aliases:
      - "gpt-4o-mini"
      - "gpt-3.5-turbo"
```

Now clients can request `gpt-4o-mini` and get your local llama-8b model.

## Unlisted Models

Hide models from the `/v1/models` API while still allowing direct requests:

```yaml
models:
  internal-model:
    cmd: llama-server --port ${PORT} --model /models/internal.gguf
    unlisted: true  # Won't appear in model listings
```

## Model Name Override

Use a different model name when proxying to upstream:

```yaml
models:
  my-qwen:
    cmd: ollama serve
    proxy: http://127.0.0.1:11434
    useModelName: "qwen:qwq"  # Send this name to upstream instead of "my-qwen"
```

## Custom Health Check Endpoint

Configure the endpoint used to check if a model is ready:

```yaml
models:
  custom-server:
    cmd: ./my-server --port ${PORT}
    checkEndpoint: /api/health  # Default is /health

  no-health-check:
    cmd: ./simple-server --port ${PORT}
    checkEndpoint: none  # Skip health checking entirely
```

## Model Metadata

Add custom metadata that appears in `/v1/models` responses:

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

## Concurrency Limits

Limit parallel requests to a model:

```yaml
models:
  limited-model:
    cmd: llama-server --port ${PORT} --model /models/model.gguf
    concurrencyLimit: 5  # Max 5 parallel requests (default: 10)
```

Requests exceeding the limit receive HTTP 429 Too Many Requests.

## Per-Model Loading State

Override the global `sendLoadingState` setting for specific models:

```yaml
sendLoadingState: true  # Global setting

models:
  with-loading:
    cmd: llama-server --port ${PORT} --model /models/slow.gguf
    # Uses global sendLoadingState: true

  without-loading:
    cmd: llama-server --port ${PORT} --model /models/fast.gguf
    sendLoadingState: false  # Override for this model
```

## Preload on Startup

Load models when llama-swap starts:

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

## Environment Variables

Pass environment variables to models:

```yaml
models:
  gpu-model:
    cmd: llama-server --port ${PORT} --model /models/model.gguf
    env:
      - "CUDA_VISIBLE_DEVICES=0,1"
      - "OMP_NUM_THREADS=8"
```

## Request Filtering

Strip parameters from requests (server-side enforcement):

```yaml
models:
  fixed-temp:
    cmd: llama-server --port ${PORT} --model /models/model.gguf
    filters:
      stripParams: "temperature, top_p, top_k"
```

## Peers (Remote Models)

Connect to other llama-swap instances or external APIs:

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

## Complete Example

A real-world configuration combining multiple features:

```yaml
logLevel: info
healthCheckTimeout: 180
startPort: 10000
sendLoadingState: true

apiKeys:
  - "sk-local-development-key"

macros:
  llama-bin: "/usr/local/bin/llama-server"
  models-dir: "/mnt/nvme/models"

models:
  # Fast model for drafting
  draft:
    cmd: ${llama-bin} --port ${PORT} --model ${models-dir}/qwen-0.5b.gguf
    name: "Qwen 2.5 Coder 0.5B (Draft)"
    description: "Small fast model for quick responses"
    ttl: 600

  # Main coding model
  coder:
    cmd: ${llama-bin} --port ${PORT} --model ${models-dir}/qwen-32b.gguf
    name: "Qwen 2.5 Coder 32B"
    description: "Primary coding assistant"
    aliases:
      - "gpt-4o"
    env:
      - "CUDA_VISIBLE_DEVICES=0,1"
    metadata:
      context_length: 32768
      specialization: "code"

  # Embedding model (always loaded)
  embeddings:
    cmd: ${llama-bin} --port ${PORT} --model ${models-dir}/nomic-embed.gguf --embedding
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

peers:
  openrouter:
    proxy: https://openrouter.ai/api
    apiKey: sk-your-openrouter-key
    models:
      - anthropic/claude-3-sonnet
```

## Full Configuration Reference

For a complete reference with all available options, see the [config.example.yaml](https://github.com/mostlygeek/llama-swap/blob/main/config.example.yaml) file in the GitHub repository.

You can also use the [Interactive Configuration Tool](/configuration) to build your config file with live validation.
