---
title: Environment Variables
description: Control GPU assignment and runtime environment for each model
prev:
  text: 7. Image Generation
  link: /tour/07-image
---

# Environment Variables

Control the runtime environment for each model with the `env` property. This is especially useful for GPU assignment in multi-GPU setups.

## Configuration

<TourConfig :step="8" />

## What's New

### The `env` Property

```yaml
llama-8B:
  env:
    - CUDA_VISIBLE_DEVICES=0
  cmd: ...
```

Environment variables are set before launching the model process. Each variable is a string in `KEY=VALUE` format.

### GPU Assignment Strategy

In this configuration, we split models across two GPUs:

| GPU | Models | Rationale |
|-----|--------|-----------|
| GPU 0 | llama-8B, qwen3-4B, gpt-oss-20B, whisper | Interactive models - prioritize responsiveness |
| GPU 1 | embedding, reranker, sd-image | Background tasks - can tolerate latency |

This separation ensures that:
- Chat requests get dedicated GPU resources
- RAG embedding and image generation don't compete with chat
- Each GPU can be sized appropriately for its workload

### Docker Models

Notice that `kokoro-tts` doesn't use `env`. Docker containers manage their own environment - GPU access is controlled via `--gpus 'device=0'` in the Docker command instead.

### Common Environment Variables

Beyond GPU selection, `env` is useful for:

- `HF_HOME` - Hugging Face cache directory
- `TRANSFORMERS_CACHE` - Transformers model cache
- `CUDA_LAUNCH_BLOCKING=1` - Debug CUDA errors
- `OMP_NUM_THREADS` - Limit CPU threads

## Tour Complete!

You've now seen all the major configuration features:

1. **Basic model setup** - `cmd`, `name`
2. **Multiple models** - Automatic swapping
3. **Macros** - DRY configuration
4. **RAG models** - Embeddings, reranking, `unlisted`
5. **Groups** - Keep models loaded together with `swap: false`
6. **Speech** - `checkEndpoint`, `cmdStop`, `useModelName`, Docker
7. **Image generation** - `aliases` for compatibility
8. **Environment variables** - GPU assignment with `env`

For the complete reference configuration, see the [Examples](/examples) page.
