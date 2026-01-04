---
title: Configuration Explorer
description: Interactive guide to llama-swap configuration options
aside: false
pageClass: wide-page
---

# Configuration Explorer

Explore the llama-swap configuration format. Hover over lines to learn what it does.

::: tabs

== Basic

A basic configuration that swaps between three LLM models. `macros` are used to reuse settings for llama-server.

<ConfigExplorer config="basic" />

== Advanced

llama-swap can swap more than just LLM models! It works with embedding, reranking, image generation, audio transcription and generation models. As long as a model name can be extracted and the API endpoint is supported it can be swapped.

The `groups` setting allows customizing swapping behaviour for workflows made up of multiple models. This can greatly speed up performance by avoid the overhead of frequently loading and unloading of models.

<ConfigExplorer config="advanced" />

== Expert

<ConfigExplorer config="expert" />

:::
