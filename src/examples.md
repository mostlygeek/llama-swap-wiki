---
layout: base.njk
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

  qwen-32b:
    cmd: llama-server --port ${PORT} --model /models/qwen-32b.gguf
    name: "Qwen 2.5 Coder 32B"

  phi-3:
    cmd: llama-server --port ${PORT} --model /models/phi-3.gguf
    name: "Phi-3 Mini"
```

When you request a model, llama-swap will unload the currently running model and start the new one.

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

The `cmdStop` ensures graceful container shutdown.

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
    cmd: llama-server --port ${PORT} --ctx-size ${default-ctx}
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
  cloud-llama-swap:
    proxy: http://192.168.1.50:8080
    models:
      - cloud-model-1
      - cloud-model-2

  openrouter:
    proxy: https://openrouter.ai/api
    apiKey: sk-your-key
    models:
      - anthropic/claude-3-sonnet
      - openai/gpt-4
```

## Complete Example

A real-world configuration combining multiple features:

```yaml
logLevel: info
healthCheckTimeout: 180
startPort: 10000

macros:
  llama-bin: "/usr/local/bin/llama-server"
  models-dir: "/mnt/nvme/models"

models:
  # Fast model for drafting
  draft:
    cmd: ${llama-bin} --port ${PORT} --model ${models-dir}/qwen-0.5b.gguf
    name: "Qwen 2.5 Coder 0.5B (Draft)"
    ttl: 600

  # Main coding model
  coder:
    cmd: ${llama-bin} --port ${PORT} --model ${models-dir}/qwen-32b.gguf --draft ${models-dir}/qwen-0.5b.gguf
    name: "Qwen 2.5 Coder 32B"
    aliases:
      - "gpt-4o"
    env:
      - "CUDA_VISIBLE_DEVICES=0,1"

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

apiKeys:
  - "sk-local-development-key"
```

## Full Configuration Reference

For a complete reference with all available options, see the [config.example.yaml](https://github.com/mostlygeek/llama-swap/blob/main/config.example.yaml) file in the GitHub repository.

You can also use the [Interactive Configuration Tool](/configuration/) to build your config file with live validation.
