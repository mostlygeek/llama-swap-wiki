---
title: RAG Models
description: Add embedding and reranker models for retrieval-augmented generation
prev:
  text: 3. Using Macros
  link: /tour/03-macros
next:
  text: 5. Model Groups
  link: /tour/05-groups
---

# RAG Models

For retrieval-augmented generation (RAG), you need embedding and reranker models alongside your chat models. Let's add them.

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
```

## What's New

### Embedding Model

The `embedding` model uses llama-server's `--embeddings` flag to serve the `/v1/embeddings` endpoint. This converts text into vectors for semantic search.

### Reranker Model

The `reranker` model uses the `--reranking` flag. Rerankers score document relevance after initial retrieval, improving search quality.

### The `unlisted` Property

```yaml
embedding:
  unlisted: true
```

Setting `unlisted: true` hides the model from the `/v1/models` endpoint. The model is still fully functional - you can make requests to it by name. This is useful for:

- Utility models that aren't meant for direct chat
- Internal models used by your RAG pipeline
- Keeping the model list clean for end users

### Specialized Flags

Notice the model-specific flags:

- `--embeddings` - Enables the embeddings endpoint
- `--reranking` - Enables the reranking endpoint
- `--batch-size 8192` - Larger batches for efficient embedding

## Current Limitation

Right now, if you request embeddings while a chat model is running, llama-swap will swap out the chat model. In the next section, we'll fix this with **groups**.
