---
title: Image Generation
description: Add image generation with aliases for OpenAI compatibility
prev:
  text: 6. Speech (STT/TTS)
  link: /tour/06-speech
---

# Image Generation

Finally, let's add image generation. We'll also introduce model aliases for compatibility with OpenAI client libraries.

## Configuration

<TourConfig :step="7" />

## What's New

### Model Aliases

```yaml
sd-image:
  aliases:
    - dall-e-2
    - dall-e-3
    - gpt-image-1
```

Aliases let you access the same model under different names. This is useful for:

- **OpenAI compatibility** - Client libraries that hardcode model names like `dall-e-3`
- **API compatibility** - Different apps expecting different model names
- **Migration** - Rename models without breaking existing clients

All these requests route to the same `sd-image` model:
- `"model": "sd-image"`
- `"model": "dall-e-2"`
- `"model": "dall-e-3"`
- `"model": "gpt-image-1"`

### Image Generation Server

The `sd-server` (stable-diffusion.cpp server) uses different flags than llama-server:

- `--listen-port` instead of `--port`
- `--diffusion-model` for the main model
- `--vae` for the variational autoencoder
- Generation parameters like `--steps`, `--cfg-scale`, `--height`, `--width`

### Custom Health Check

```yaml
checkEndpoint: /
```

The sd-server uses `/` as its health endpoint, so we override the default `/health`.

## Tour Complete!

You've now seen all the major configuration features:

1. **Basic model setup** - `cmd`, `env`, `name`
2. **Multiple models** - Automatic swapping
3. **Macros** - DRY configuration
4. **RAG models** - Embeddings, reranking, `unlisted`
5. **Groups** - Keep models loaded together with `swap: false`
6. **Speech** - `checkEndpoint`, `cmdStop`, `useModelName`, Docker
7. **Image generation** - `aliases` for compatibility

For the complete reference configuration, see the [Examples](/examples) page.
