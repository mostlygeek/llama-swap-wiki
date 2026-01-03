---
title: Installation
description: Install and configure llama-swap in minutes
---

# Installation

llama-swap is available on Linux, Mac and Windows. You can use on of the available methods or build it yourself.

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

## Next Steps

- Learn more in [Configuration Examples](/examples)
- Build your config with the [Interactive Configuration Tool](/configuration)
