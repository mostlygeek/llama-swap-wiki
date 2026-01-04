---
title: Configuration Explorer
description: Interactive guide to llama-swap configuration options
aside: false
pageClass: wide-page
---

<script setup>
import { data } from './examples.data'
</script>

# Config Explorer

::: tabs

== Intro

llama-swap is managed by a single `config.yaml` file. Most settings are optional in the configuration. You can start with something as simple as this:

```yaml
models:
  llama-8b:
    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf
```

That config is not particularly useful. However, it demonstrates that while there are are many features available you only need to add them when you need them.

Use this explorer to discover the features in the Basic, Advanced and Expert configuration examples.

== Basic

The basic configuration swaps between three LLM models. The `macros` setting creates reusable snippets so common settings can be changed in one place.

<ConfigExplorer config="basic" />

== Advanced

llama-swap can swap more than just LLM models! It works with embedding, reranking, image generation, audio transcription and generation models. As long as a model name can be extracted and the API endpoint is supported it can be swapped.

The `groups` setting allows customizing swapping behaviour for workflows made up of multiple models. This can greatly speed up performance by avoid the overhead of frequently loading and unloading of models.

<ConfigExplorer config="advanced" />

== Expert

This is the canonical [config.example.yaml](https://github.com/mostlygeek/llama-swap/blob/main/config.example.yaml) from the github repo, always up to date with the latest features.

Try pasting this into an LLM and explain specific concepts.

<ConfigExplorer :yaml="data.configExample" />

:::
