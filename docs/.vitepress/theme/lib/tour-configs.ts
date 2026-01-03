// Centralized store for all tour YAML configurations
// Each step builds on the previous one

export const tourConfigs: Record<number, string> = {
  1: `models:
  llama-8B:
    name: "Llama 8B"
    cmd: |
      /path/to/llama-server
        --host 127.0.0.1 --port \${PORT}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768
        -ngl 99`,

  2: `models:
  llama-8B:
    name: "Llama 8B"
    cmd: |
      /path/to/llama-server
        --host 127.0.0.1 --port \${PORT}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768
        -ngl 99

  qwen3-4B:
    name: "Qwen3 4B"
    cmd: |
      /path/to/llama-server
        --host 127.0.0.1 --port \${PORT}
        --model /path/to/models/Qwen3-4B-Instruct-Q8_0.gguf
        --ctx-size 40960
        -ngl 99

  gpt-oss-20B:
    name: "GPT-OSS 20B"
    cmd: |
      /path/to/llama-server
        --host 127.0.0.1 --port \${PORT}
        --model /path/to/models/gpt-oss-20B-Q8_0.gguf
        --ctx-size 8192
        -ngl 99`,

  3: `macros:
  llama-server: |
    /path/to/llama-server
      --host 127.0.0.1 --port \${PORT}
      -ngl 99

models:
  llama-8B:
    name: "Llama 8B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768

  qwen3-4B:
    name: "Qwen3 4B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Qwen3-4B-Instruct-Q8_0.gguf
        --ctx-size 40960

  gpt-oss-20B:
    name: "GPT-OSS 20B"
    cmd: |
      \${llama-server}
        --model /path/to/models/gpt-oss-20B-Q8_0.gguf
        --ctx-size 8192`,

  4: `macros:
  llama-server: |
    /path/to/llama-server
      --host 127.0.0.1 --port \${PORT}
      -ngl 99

models:
  llama-8B:
    name: "Llama 8B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768

  qwen3-4B:
    name: "Qwen3 4B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Qwen3-4B-Instruct-Q8_0.gguf
        --ctx-size 40960

  gpt-oss-20B:
    name: "GPT-OSS 20B"
    cmd: |
      \${llama-server}
        --model /path/to/models/gpt-oss-20B-Q8_0.gguf
        --ctx-size 8192

  embedding:
    unlisted: true
    cmd: |
      \${llama-server}
        --model /path/to/models/nomic-embed-text-v1.5.Q8_0.gguf
        --ctx-size 8192
        --batch-size 8192
        --embeddings

  reranker:
    unlisted: true
    cmd: |
      \${llama-server}
        --model /path/to/models/bge-reranker-v2-m3-Q4_K_M.gguf
        --ctx-size 8192
        --reranking`,

  5: `macros:
  llama-server: |
    /path/to/llama-server
      --host 127.0.0.1 --port \${PORT}
      -ngl 99

groups:
  rag:
    swap: false
    members:
      - embedding
      - reranker
      - gpt-oss-20B

models:
  llama-8B:
    name: "Llama 8B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768

  qwen3-4B:
    name: "Qwen3 4B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Qwen3-4B-Instruct-Q8_0.gguf
        --ctx-size 40960

  gpt-oss-20B:
    name: "GPT-OSS 20B"
    cmd: |
      \${llama-server}
        --model /path/to/models/gpt-oss-20B-Q8_0.gguf
        --ctx-size 8192

  embedding:
    unlisted: true
    cmd: |
      \${llama-server}
        --model /path/to/models/nomic-embed-text-v1.5.Q8_0.gguf
        --ctx-size 8192
        --batch-size 8192
        --embeddings

  reranker:
    unlisted: true
    cmd: |
      \${llama-server}
        --model /path/to/models/bge-reranker-v2-m3-Q4_K_M.gguf
        --ctx-size 8192
        --reranking`,

  6: `macros:
  llama-server: |
    /path/to/llama-server
      --host 127.0.0.1 --port \${PORT}
      -ngl 99

models:
  llama-8B:
    name: "Llama 8B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768

  qwen3-4B:
    name: "Qwen3 4B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Qwen3-4B-Instruct-Q8_0.gguf
        --ctx-size 40960

  gpt-oss-20B:
    name: "GPT-OSS 20B"
    cmd: |
      \${llama-server}
        --model /path/to/models/gpt-oss-20B-Q8_0.gguf
        --ctx-size 8192

  embedding:
    unlisted: true
    cmd: |
      \${llama-server}
        --model /path/to/models/nomic-embed-text-v1.5.Q8_0.gguf
        --ctx-size 8192
        --batch-size 8192
        --embeddings

  reranker:
    unlisted: true
    cmd: |
      \${llama-server}
        --model /path/to/models/bge-reranker-v2-m3-Q4_K_M.gguf
        --ctx-size 8192
        --reranking

  whisper:
    unlisted: true
    checkEndpoint: /v1/audio/transcriptions
    cmd: |
      /path/to/whisper-server
        --host 127.0.0.1 --port \${PORT}
        --model /path/to/models/ggml-large-v3-turbo-q8_0.bin
        --flash-attn

  kokoro-tts:
    name: "Kokoro TTS"
    useModelName: "tts-1"
    cmd: |
      docker run --rm --name \${MODEL_ID}
        -p \${PORT}:8880
        --gpus 'device=0'
      ghcr.io/remsky/kokoro-fastapi-gpu:latest
    cmdStop: docker stop \${MODEL_ID}

groups:
  rag:
    swap: false
    members:
      - embedding
      - reranker
      - gpt-oss-20B`,

  7: `macros:
  llama-server: |
    /path/to/llama-server
      --host 127.0.0.1 --port \${PORT}
      -ngl 99

models:
  llama-8B:
    name: "Llama 8B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768

  qwen3-4B:
    name: "Qwen3 4B"
    cmd: |
      \${llama-server}
        --model /path/to/models/Qwen3-4B-Instruct-Q8_0.gguf
        --ctx-size 40960

  gpt-oss-20B:
    name: "GPT-OSS 20B"
    cmd: |
      \${llama-server}
        --model /path/to/models/gpt-oss-20B-Q8_0.gguf
        --ctx-size 8192

  embedding:
    unlisted: true
    cmd: |
      \${llama-server}
        --model /path/to/models/nomic-embed-text-v1.5.Q8_0.gguf
        --ctx-size 8192
        --batch-size 8192
        --embeddings

  reranker:
    unlisted: true
    cmd: |
      \${llama-server}
        --model /path/to/models/bge-reranker-v2-m3-Q4_K_M.gguf
        --ctx-size 8192
        --reranking

  whisper:
    unlisted: true
    checkEndpoint: /v1/audio/transcriptions
    cmd: |
      /path/to/whisper-server
        --host 127.0.0.1 --port \${PORT}
        --model /path/to/models/ggml-large-v3-turbo-q8_0.bin
        --flash-attn

  kokoro-tts:
    name: "Kokoro TTS"
    useModelName: "tts-1"
    cmd: |
      docker run --rm --name \${MODEL_ID}
        -p \${PORT}:8880
        --gpus 'device=0'
      ghcr.io/remsky/kokoro-fastapi-gpu:latest
    cmdStop: docker stop \${MODEL_ID}

  sd-image:
    name: "Image Generation"
    checkEndpoint: /
    aliases:
      - dall-e-2
      - dall-e-3
      - gpt-image-1
    cmd: |
      /path/to/sd-server
        --listen-port \${PORT}
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
      - gpt-oss-20B`,

  8: `macros:
  llama-server: |
    /path/to/llama-server
      --host 127.0.0.1 --port \${PORT}
      -ngl 99

models:
  llama-8B:
    name: "Llama 8B"
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      \${llama-server}
        --model /path/to/models/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
        --ctx-size 32768

  qwen3-4B:
    name: "Qwen3 4B"
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      \${llama-server}
        --model /path/to/models/Qwen3-4B-Instruct-Q8_0.gguf
        --ctx-size 40960

  gpt-oss-20B:
    name: "GPT-OSS 20B"
    env:
      - CUDA_VISIBLE_DEVICES=0
    cmd: |
      \${llama-server}
        --model /path/to/models/gpt-oss-20B-Q8_0.gguf
        --ctx-size 8192

  embedding:
    unlisted: true
    env:
      - CUDA_VISIBLE_DEVICES=1
    cmd: |
      \${llama-server}
        --model /path/to/models/nomic-embed-text-v1.5.Q8_0.gguf
        --ctx-size 8192
        --batch-size 8192
        --embeddings

  reranker:
    unlisted: true
    env:
      - CUDA_VISIBLE_DEVICES=1
    cmd: |
      \${llama-server}
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
        --host 127.0.0.1 --port \${PORT}
        --model /path/to/models/ggml-large-v3-turbo-q8_0.bin
        --flash-attn

  kokoro-tts:
    name: "Kokoro TTS"
    useModelName: "tts-1"
    cmd: |
      docker run --rm --name \${MODEL_ID}
        -p \${PORT}:8880
        --gpus 'device=0'
      ghcr.io/remsky/kokoro-fastapi-gpu:latest
    cmdStop: docker stop \${MODEL_ID}

  sd-image:
    name: "Image Generation"
    checkEndpoint: /
    aliases:
      - dall-e-2
      - dall-e-3
      - gpt-image-1
    env:
      - CUDA_VISIBLE_DEVICES=1
    cmd: |
      /path/to/sd-server
        --listen-port \${PORT}
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
      - gpt-oss-20B`,
};

export function getTourConfig(step: number): string {
  return tourConfigs[step] || "";
}

export function getPreviousTourConfig(step: number): string | undefined {
  return step > 1 ? tourConfigs[step - 1] : undefined;
}
