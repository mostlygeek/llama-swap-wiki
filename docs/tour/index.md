---
title: Configuration Tour
description: A step-by-step guide to llama-swap configuration
next:
  text: 1. Single Model
  link: /tour/01-single-model
---

# Configuration Tour

Welcome to the llama-swap configuration tour. This guide walks you through building a complete configuration file, introducing one concept at a time.

## What You'll Learn

By the end of this tour, you'll understand how to:

1. **Configure a single model** - The basics of model definitions
2. **Add multiple models** - How llama-swap manages model swapping
3. **Use macros** - Reduce repetition in your configs
4. **Add RAG models** - Embedding and reranker models for retrieval
5. **Create model groups** - Keep related models loaded together
6. **Add speech models** - Text-to-speech and speech-to-text
7. **Add image generation** - Stable diffusion and image models

Each step builds on the previous one, so you'll see the configuration grow as new features are introduced.

## Prerequisites

Before starting, make sure you have:

- llama-swap installed ([Installation Guide](/getting-started))
- A llama.cpp server binary (`llama-server`)
- At least one GGUF model file

## How Configurations Work

llama-swap uses a single YAML file to define all your models. When a request comes in for a specific model, llama-swap:

1. Checks if that model is already running
2. If not, stops any currently running model (unless grouped)
3. Starts the requested model
4. Proxies the request to the backend

This allows you to define many models but only run one at a time, saving GPU memory.

Ready to get started? Let's configure your first model.
