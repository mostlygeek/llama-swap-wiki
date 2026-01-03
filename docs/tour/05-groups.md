---
title: Model Groups
description: Keep related models loaded together without swapping
prev:
  text: 4. RAG Models
  link: /tour/04-rag-models
next:
  text: 6. Speech (STT/TTS)
  link: /tour/06-speech
---

# Model Groups

Continually swapping models in and out of memory can add long wait times to requests. llama-swap's Groups makes it easy to keep multiple models loaded at the same time.

## Configuration

<TourConfig :step="5" />

## What's New

### The `groups:` Section

Groups define sets of models that work together:

```yaml
groups:
  group-name:
    swap: false
    members:
      - model-1
      - model-2
```

### `swap: false`

This is the key setting. When `swap: false`:

- All group members can run simultaneously
- Requesting one member doesn't stop the others
- Models outside the group still trigger normal swapping

### How It Works

With the `rag` group configured:

1. Request `embedding` → starts embedding model
2. Request `reranker` → starts reranker (embedding stays running)
3. Request `gpt-oss-20B` → starts chat model (all three now running)
4. Request `llama-8B` → stops ALL rag group models, starts llama-8B

### Memory Considerations

Running multiple models requires more memory. The embedding and reranker models are typically small, making them good candidates for concurrent loading.

### Use Cases

- **RAG pipelines** - Embed → Rerank → Generate without swapping
- **Multi-modal apps** - Keep vision and text models loaded
- **Agent workflows** - Tool-calling model + specialist models

## Group Behavior Summary

| Scenario                    | Result                                    |
| --------------------------- | ----------------------------------------- |
| Request model in same group | Starts without stopping others            |
| Request model outside group | Stops all group members, starts new model |
| Request non-grouped model   | Normal swap behavior                      |
