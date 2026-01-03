---
title: Single Model
description: Configure your first model with llama-swap
prev:
  text: Introduction
  link: /tour/
next:
  text: 2. Multiple Models
  link: /tour/02-multiple-models
---

# Single Model

Let's start with the simplest possible configuration: a single model.

## Configuration

<TourConfig :step="1" />

## What's New

### Model ID

`llama-8B` is the **model ID**. This is what you'll use in API requests:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-8B", "messages": [{"role": "user", "content": "Hello!"}]}'
```

### Model Properties

- **`name`** - A human-readable display name (optional, shown in `/v1/models`)
- **`env`** - Environment variables to set when launching the model
- **`cmd`** - The command to start the backend server

### The `${PORT}` Variable

llama-swap automatically assigns an available port for each model. Use `${PORT}` in your command and llama-swap will substitute it with the actual port number.

### Multi-line Commands

The `|` character allows multi-line strings in YAML. This makes complex commands easier to read. The command is joined into a single line when executed.

## Testing It

Save this as `config.yaml` and run:

```bash
llama-swap --config config.yaml
```

Then make a request to `http://localhost:8080/v1/models` to see your model listed.
