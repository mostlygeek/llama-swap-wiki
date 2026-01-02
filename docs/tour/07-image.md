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

  sd-image:
    name: "Image Generation"
    checkEndpoint: /
    aliases:
      - dall-e-2
      - dall-e-3
      - gpt-image-1
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      /path/to/sd-server
        --listen-port ${PORT}
        --diffusion-model /path/to/models/sd-turbo-Q8_0.gguf
        --vae /path/to/models/ae.safetensors
        --cfg-scale 1.0
        --height 768 --width 768
        --steps 8

groups:
  rag:
    swap: false
    members:
      - embedding
      - reranker
      - gpt-oss-20B
```

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
