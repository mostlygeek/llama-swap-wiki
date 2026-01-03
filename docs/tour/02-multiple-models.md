---
title: Multiple Models
description: Add multiple models and let llama-swap handle swapping
prev:
  text: 1. Single Model
  link: /tour/01-single-model
next:
  text: 3. Using Macros
  link: /tour/03-macros
---

# Multiple Models

Now let's add more models. llama-swap will automatically swap between them based on which model is requested.

## Configuration

<TourConfig :step="2" />

## What's New

### Multiple Model Definitions

Each model gets its own entry under `models:`. You can define as many as you want - llama-swap only runs one at a time (by default).

### Automatic Swapping

When you request a model that isn't currently running:

1. llama-swap stops the currently running model
2. Starts the requested model
3. Waits for it to be ready
4. Proxies your request

This happens transparently - your client just sees a slightly longer response time for the first request.

### Different Context Sizes

Notice each model can have different settings. The Qwen model uses a larger context (40960) while GPT-OSS uses a smaller one (8192). Configure each model according to its capabilities and your memory constraints.

## How Swapping Works

```
Request for llama-8B  →  Start llama-8B  →  Response
Request for llama-8B  →  Already running  →  Response (fast)
Request for qwen3-4B  →  Stop llama-8B, Start qwen3-4B  →  Response
Request for qwen3-4B  →  Already running  →  Response (fast)
```

This pattern lets you define many models but only use GPU memory for one at a time.
