---
layout: base.njk
title: Home
description: llama-swap - A lightweight proxy for dynamic LLM model switching
---

# llama-swap

**Hot-swap between local LLM models without restarting your apps.**

llama-swap is a proxy server that sits between your application and your LLM inference servers. When you request a model, it automatically starts the right server, waits for it to be ready, and forwards your request. Switch models on the fly with zero downtime.

## Install

```bash
brew tap mostlygeek/llama-swap && brew install llama-swap
```

See [Getting Started](/getting-started/) for Windows, Linux binaries, and Docker.

## Quick Example

Create `config.yaml`:

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
  qwen-coder:
    cmd: llama-server --port ${PORT} --model /models/qwen-coder.gguf
```

Start llama-swap:

```bash
llama-swap -config config.yaml
```

Make requests using the OpenAI API format:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-8b", "messages": [{"role": "user", "content": "Hello!"}]}'
```

llama-swap handles starting servers, health checks, and graceful switching between models.

## Next Steps

- [Getting Started](/getting-started/) - Full installation and configuration guide
- [Configuration Tool](/configuration/) - Interactive config builder
- [GitHub]({{config.url}}) - Source code and documentation
