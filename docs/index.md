---
layout: home

hero:
  name: llama-swap
  #text: Hot-swap between local AI models
  tagline: Reliable model swapping for any local OpenAI and Anthropic api compatible server
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Configuration Builder
      link: /configuration
    - theme: alt
      text: View on GitHub
      link: https://github.com/mostlygeek/llama-swap

features:
  - title: On-demand Loading
    details: Models are loaded only when requested, saving GPU memory
  - title: Zero Downtime
    details: Switch between models seamlessly without restarting services
  - title: OpenAI Compatible
    details: Works with any app using the OpenAI API format
---

## Install

```bash
brew tap mostlygeek/llama-swap && brew install llama-swap
```

See [Getting Started](/getting-started) for Docker, OSX, Windows and Linux installation docs.

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
