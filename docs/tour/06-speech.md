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

  embedding:
    unlisted: true
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      ${llama-server}
        --model /path/to/models/nomic-embed-text-v1.5.Q8_0.gguf
        --ctx-size 8192
        --batch-size 8192
        --embeddings

  reranker:
    unlisted: true
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      ${llama-server}
        --model /path/to/models/bge-reranker-v2-m3-Q4_K_M.gguf
        --ctx-size 8192
        --reranking

  whisper:
    unlisted: true
    checkEndpoint: /v1/audio/transcriptions
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      /path/to/whisper-server
        --host 127.0.0.1 --port ${PORT}
        --model /path/to/models/ggml-large-v3-turbo-q8_0.bin
        --flash-attn

  kokoro-tts:
    name: "Kokoro TTS"
    useModelName: "tts-1"
    cmd: |
      docker run --rm --name ${MODEL_ID}
        -p ${PORT}:8880
        --gpus 'device=0'
      ghcr.io/remsky/kokoro-fastapi-gpu:latest
    cmdStop: docker stop ${MODEL_ID}

groups:
  rag:
    swap: false
    members:
      - embedding
      - reranker
      - gpt-oss-20B
```

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
