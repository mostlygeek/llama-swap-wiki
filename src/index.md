---
layout: base.njk
title: Home
description: llama-swap - A lightweight proxy for dynamic LLM model switching
---

# llama-swap

**A lightweight proxy for dynamic LLM model switching**

llama-swap is a proxy server that enables you to hot-swap between multiple local LLM models without restarting your applications. It acts as a transparent intermediary that dynamically switches between different OpenAI-compatible inference servers based on which model is requested.

## Key Features

- **Zero Configuration Start**: One binary, one YAML configuration file
- **On-Demand Model Switching**: Automatic server management and model swapping
- **OpenAI API Compatible**: Works with any OpenAI-compatible server (llama.cpp, vllm, tabbyAPI, etc.)
- **Advanced Controls**: Groups, TTL auto-unloading, hooks, macros, and more
- **Web UI**: Real-time monitoring dashboard with activity logs
- **Docker/Podman Support**: Full container orchestration with graceful shutdown
- **Multiple Platforms**: Pre-built binaries for Linux, macOS, Windows, and FreeBSD

## Quick Start

```bash
# Install via Homebrew (macOS/Linux)
brew tap mostlygeek/llama-swap
brew install llama-swap

# Or download pre-built binary from GitHub
# https://github.com/mostlygeek/llama-swap/releases
```

Create a minimal `config.yaml`:

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /path/to/model.gguf
```

Start llama-swap:

```bash
llama-swap -config config.yaml
```

## Use Cases

- **Hardware Optimization**: Run multiple models on limited GPU/CPU resources
- **Speculative Decoding**: Combine small draft models with larger models for 20-40% speed improvements
- **Multi-GPU Setups**: Distribute large models across multiple GPUs
- **Container Management**: Reliable Python server (vllm, tabbyAPI) lifecycle via Docker/Podman
- **Model Benchmarking**: A/B test different configurations and hardware setups

## Learn More

- [Getting Started](/getting-started/) - Installation and first steps
- [Configuration Examples](/examples/) - Learn through practical examples
- [Interactive Configuration Tool](/configuration/) - Build your config file
- [GitHub Repository]({{config.url}}) - Source code and documentation

## Community

llama-swap has **2,111 stars** on GitHub and is actively maintained. Join the community:

- Report issues or request features on [GitHub Issues]({{config.url}}/issues)
- Contribute to the project on [GitHub]({{config.url}})
- Read the full documentation in the [GitHub repo]({{config.url}})
