---
title: Image Generation
description: Add image generation with aliases for OpenAI compatibility
prev:
  text: 6. Speech (STT/TTS)
  link: /tour/06-speech
next:
  text: 8. Environment Variables
  link: /tour/08-environment
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

## What We've Learned

Model aliases provide flexibility for client compatibility. Next, we'll look at controlling the runtime environment for each model.
