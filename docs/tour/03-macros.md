---
title: Using Macros
description: Reduce repetition with reusable configuration snippets
prev:
  text: 2. Multiple Models
  link: /tour/02-multiple-models
next:
  text: 4. RAG Models
  link: /tour/04-rag-models
---

# Using Macros

You've probably noticed the repetition in our config - every model has similar server arguments. Macros let you define reusable snippets.

## Configuration

```yaml
macros:
  llama-server: |
    /path/to/llama-server
      --host 127.0.0.1 --port ${PORT}
      -ngl 99

models:
  llama-8B:
    name: "Llama 8B"
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      ${llama-server}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768

  qwen3-4B:
    name: "Qwen3 4B"
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      ${llama-server}
        --model /path/to/models/Qwen3-4B-Instruct-Q8_0.gguf
        --ctx-size 40960

  gpt-oss-20B:
    name: "GPT-OSS 20B"
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      ${llama-server}
        --model /path/to/models/gpt-oss-20B-Q8_0.gguf
        --ctx-size 8192
```

## What's New

### The `macros:` Section

Define reusable text snippets at the top of your config:

```yaml
macros:
  macro-name: "value to substitute"
```

### Using Macros with `${macro-name}`

Reference a macro anywhere in your config with `${macro-name}`. llama-swap replaces it with the macro's value before executing.

### Benefits

- **Single source of truth** - Update the server path once, it changes everywhere
- **Cleaner configs** - Model definitions focus on what's unique to each model
- **Easier maintenance** - Add new server flags in one place

### Macro Tips

You can define multiple macros:

```yaml
macros:
  llama-server: "/path/to/llama-server --host 127.0.0.1 --port ${PORT}"
  models-dir: "/path/to/models"
  gpu-flags: "-ngl 99 --flash-attn"
```

And combine them:

```yaml
cmd: |
  ${llama-server}
    --model ${models-dir}/my-model.gguf
    ${gpu-flags}
```

Note: `${PORT}` is a built-in variable, not a macro. It's always replaced with the assigned port number.
