---
title: Getting Started
description: Install and configure llama-swap in minutes
---

# Getting Started

Get up and running with llama-swap in just a few minutes.

## Installation

::: tabs

== Docker

Images are built nightly and are available for multiple hardware platforms: CUDA, Intel, Vulkan, MUSA, and CPU inference.

```bash
# Pull the container for your hardware
docker pull ghcr.io/mostlygeek/llama-swap:cuda
docker pull ghcr.io/mostlygeek/llama-swap:vulkan
docker pull ghcr.io/mostlygeek/llama-swap:intel
docker pull ghcr.io/mostlygeek/llama-swap:musa
docker pull ghcr.io/mostlygeek/llama-swap:cpu

# Pull specific versions of llama-swap and llama.cpp
docker pull ghcr.io/mostlygeek/llama-swap:v179-cuda-b7565

# Run with a custom configuration
docker run -v ./config.yaml:/app/config.yaml ghcr.io/mostlygeek/llama-swap
```

All available images can be found on the GitHub [packages](https://github.com/mostlygeek/llama-swap/pkgs/container/llama-swap) page.

== macOS (Homebrew)

```bash
brew tap mostlygeek/llama-swap
brew install llama-swap
```

== Windows

```powershell
winget install llama-swap
```

== Binary

Pre-built binaries are automatically built from the `main` branch. Download them from the [releases](https://github.com/mostlygeek/llama-swap/releases) page.

Available platforms:
- **Linux**: x86_64, ARM64
- **macOS**: Intel, Apple Silicon
- **Windows**: x86_64
- **FreeBSD**

== Source

Build a custom binary from source:

```bash
git clone https://github.com/mostlygeek/llama-swap.git
cd llama-swap
make build

# Build for a custom OS and architecture
GOOS=linux GOARCH=arm64 make build
```

:::

## Basic Configuration

Create a `config.yaml` file with your first model:

```yaml
models:
  smollm2:
    # warning: downloads about 270MB
    cmd: llama-server --port ${PORT} -hf bartowski/SmolLM2-360M-Instruct-GGUF
```

The `${PORT}` macro is automatically assigned (starting from 5800 by default). The `-hf` flag tells llama-server to automatically download the model when it starts.

## Start llama-swap

```bash
$ llama-swap -config config.yaml
llama-swap listening on http://:8080
```

## Make Your First Request

Use the OpenAI-compatible API:

```bash
curl -sN http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "smollm2", "stream": true,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

llama-swap will automatically:

1. Start the llama-server for the `smollm2` model
2. Wait for it to be ready (health check)
3. Forward your request to the upstream server
4. Stream back the reponse

## Web UI

Visit `http://localhost:8080/ui`.

On the UI dashboard you can:

- View request history
- See performance metrics
- Stream logs in real-time
- Start and stop models manually

### Models page

![Web UI Dashboard](/webui.png)

### Activity page

![Activity View](/activity.png)

## Next Steps

- Learn more in [Configuration Examples](/examples)
- Build your config with the [Interactive Configuration Tool](/configuration)
