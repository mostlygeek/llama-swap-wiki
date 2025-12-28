---
layout: base.njk
title: Getting Started
description: Install and configure llama-swap in minutes
---

# Getting Started

Get up and running with llama-swap in just a few minutes.

## Installation

### Homebrew (macOS/Linux)

```bash
brew tap mostlygeek/llama-swap
brew install llama-swap
```

### WinGet (Windows)

```bash
winget install llama-swap
```

### Pre-built Binaries

Download the latest release for your platform from [GitHub Releases](https://github.com/mostlygeek/llama-swap/releases).

Available for:
- Linux (x86_64, ARM64)
- macOS (Intel, Apple Silicon)
- Windows (x86_64)
- FreeBSD

### Docker

```bash
# Pull the latest image
docker pull ghcr.io/mostlygeek/llama-swap:latest

# Run with your config
docker run -v ./config.yaml:/config.yaml ghcr.io/mostlygeek/llama-swap
```

### Build from Source

Requires Go 1.21+ and Node.js 18+:

```bash
git clone https://github.com/mostlygeek/llama-swap.git
cd llama-swap
make build
```

## Basic Configuration

Create a `config.yaml` file with your first model:

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /path/to/llama-8b.gguf
```

The `${PORT}` macro is automatically assigned (starting from 5800 by default).

## Start llama-swap

```bash
llama-swap -config config.yaml
```

You should see output indicating the server is ready:

```
INFO llama-swap starting on :8080
INFO Model registry initialized with 1 models
```

## Make Your First Request

Use the OpenAI-compatible API:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-8b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

llama-swap will automatically:
1. Start the llama-server for the `llama-8b` model
2. Wait for it to be ready (health check)
3. Forward your request to the upstream server
4. Return the response

## Web UI

Visit `http://localhost:8080/ui` to access the web dashboard where you can:
- Monitor model loading status
- View request history
- See performance metrics
- Stream logs in real-time

## Next Steps

- Learn more in [Configuration Examples](/examples/)
- Build your config with the [Interactive Configuration Tool](/configuration/)
- Read the full documentation on [GitHub](https://github.com/mostlygeek/llama-swap)

## Common Options

### Change the Listen Port

```bash
llama-swap -config config.yaml -listen :3000
```

### Enable Debug Logging

```yaml
logLevel: debug
```

### Set Health Check Timeout

```yaml
healthCheckTimeout: 300  # seconds (default: 120, min: 15)
```

### Add API Key Authentication

```yaml
apiKeys:
  - "sk-your-secret-key-here"
```

Then include the key in requests:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer sk-your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-8b", "messages": [...]}'
```
