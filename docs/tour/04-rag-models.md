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

<TourConfig :step="4" />

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
