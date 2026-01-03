---
title: Speech (STT/TTS)
description: Add speech-to-text and text-to-speech models
prev:
  text: 5. Model Groups
  link: /tour/05-groups
next:
  text: 7. Image Generation
  link: /tour/07-image
---

# Speech Models

Let's add speech capabilities: Whisper for speech-to-text (STT) and Kokoro for text-to-speech (TTS).

## Configuration

<TourConfig :step="6" />

## What's New

### Custom Health Check Endpoint

```yaml
whisper:
  checkEndpoint: /v1/audio/transcriptions
```

llama-swap checks if a model is ready by hitting its health endpoint. By default, this is `/health`. Whisper uses a different endpoint, so we specify it with `checkEndpoint`.

### Docker-based Models

```yaml
kokoro-tts:
  cmd: |
    docker run --rm --name ${MODEL_ID}
      -p ${PORT}:8880
      --gpus 'device=0'
    ghcr.io/remsky/kokoro-fastapi-gpu:latest
  cmdStop: docker stop ${MODEL_ID}
```

Some models run best in Docker containers. Notice:

- **`${MODEL_ID}`** - A unique identifier for this model instance, useful for naming containers
- **`-p ${PORT}:8880`** - Maps llama-swap's assigned port to the container's internal port
- **`cmdStop`** - Command to gracefully stop the model (required for Docker since `--rm` containers need explicit stopping)

### Model Name Override

```yaml
kokoro-tts:
  useModelName: "tts-1"
```

Some backends expect specific model names in requests. Kokoro expects `tts-1`, but we want to call it `kokoro-tts` in our config. The `useModelName` setting rewrites the model name in proxied requests.

Your client requests `kokoro-tts` → llama-swap sends `tts-1` to the backend.

### Speech Endpoints

- **Whisper (STT)**: `POST /v1/audio/transcriptions` with audio file
- **Kokoro (TTS)**: `POST /v1/audio/speech` with text

Both follow OpenAI-compatible API formats.
