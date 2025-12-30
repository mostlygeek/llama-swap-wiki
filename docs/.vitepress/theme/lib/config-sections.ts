export interface Feature {
  id: string;
  label: string;
}

export const features: Feature[] = [
  { id: "ttl", label: "Unload idle models" },
  { id: "macros", label: "Create reusable snippets" },
  { id: "groups", label: "Run multiple models simultaneously" },
  { id: "apiKeys", label: "Require API keys" },
  { id: "docker", label: "Use Docker" },
  { id: "hooks", label: "Auto load models" },
  { id: "env", label: "Set environment vars" },
];

// Build base YAML dynamically based on selected features
export function buildBaseYaml(options: { macros: boolean; ttl: boolean; env: boolean; apiKeys: boolean }): string {
  const lines: string[] = [];

  lines.push("# llama-swap configuration");
  lines.push("# Models are loaded on-demand and swapped automatically");

  // Add apiKeys section if enabled (right after header comments)
  if (options.apiKeys) {
    lines.push("");
    lines.push("# API Keys - require authentication for requests");
    lines.push("apiKeys:");
    lines.push("  - sk-api-key-one");
    lines.push("  - sk-api-key-two");
    lines.push("  - sk-api-key-three");
  }

  // Add macros section if enabled
  if (options.macros) {
    lines.push("");
    lines.push("# Macros - reusable values substituted with ${macro-name}");
    lines.push("macros:");
    lines.push("  llama-bin: /usr/local/bin/llama-server");
    lines.push("  model-path: /path/to/models");
  }

  lines.push("");
  lines.push("models:");

  // First model
  lines.push("  # First model - a fast general-purpose model");
  lines.push("  llama-8b:");
  if (options.env) {
    lines.push("    env:");
    lines.push("      - CUDA_VISIBLE_DEVICES=0  # Use first GPU");
  }
  if (options.macros) {
    lines.push("    cmd: ${llama-bin} --port ${PORT} --model ${model-path}/llama-8b.gguf");
  } else {
    lines.push("    cmd: llama-server --port ${PORT} --model /models/llama-8b.gguf");
  }
  lines.push("    name: Llama 3.1 8B");
  if (options.ttl) {
    lines.push("    ttl: 600  # Auto-unload after 10 minutes of inactivity");
  }

  lines.push("");

  // Second model
  lines.push("  # Second model - a larger coding-focused model");
  lines.push("  qwen-32b:");
  if (options.env) {
    lines.push("    env:");
    lines.push("      - CUDA_VISIBLE_DEVICES=1  # Use second GPU");
  }
  if (options.macros) {
    lines.push("    cmd: ${llama-bin} --port ${PORT} --model ${model-path}/qwen-32b.gguf");
  } else {
    lines.push("    cmd: llama-server --port ${PORT} --model /models/qwen-32b.gguf");
  }
  lines.push("    name: Qwen 2.5 Coder 32B");
  if (options.ttl) {
    lines.push("    ttl: 600  # Auto-unload after 10 minutes of inactivity");
  }

  return lines.join("\n");
}

// Feature-specific YAML snippets with comments
export const featureSnippets: Record<string, { models?: string; topLevel?: string }> = {
  docker: {
    models: `
  # Docker model - uses proxy to connect to containerized server
  docker-llama:
    proxy: http://127.0.0.1:\${PORT}
    cmd: |
      docker run --name \${MODEL_ID}
        --init --rm -p \${PORT}:8080
        -v /path/to/models:/models
        ghcr.io/ggml-org/llama.cpp:server
        --model '/models/llama-8b.gguf'
    # Command to gracefully stop the container
    cmdStop: docker stop \${MODEL_ID}`,
  },

  groups: {
    topLevel: `

# Groups - control which models can run simultaneously
groups:
  main-models:
    swap: false      # Keep both models loaded at the same time
    exclusive: true  # Unload models from other groups when this group is active
    members:
      - llama-8b
      - qwen-32b`,
  },

  hooks: {
    topLevel: `

# Hooks - actions triggered on startup/shutdown
hooks:
  on_startup:
    # Preload these models when llama-swap starts
    preload:
      - llama-8b`,
  },
};
