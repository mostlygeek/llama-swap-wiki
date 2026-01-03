<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { codeToTokensWithThemes } from 'shiki'
import type { ThemedTokenWithVariants } from 'shiki'

const props = defineProps<{
  yaml: string | null
}>()

const tokens = ref<ThemedTokenWithVariants[][]>([])
const isLoading = ref(true)

function tokenStyle(token: ThemedTokenWithVariants): Record<string, string> {
  const light = token.variants['github-light']?.color
  const dark = token.variants['github-dark']?.color
  if (light && dark) {
    return { '--light': light, '--dark': dark } as Record<string, string>
  }
  return {}
}

async function highlight(yaml: string | null) {
  if (!yaml) {
    tokens.value = []
    isLoading.value = false
    return
  }
  isLoading.value = true
  tokens.value = await codeToTokensWithThemes(yaml, {
    lang: 'yaml',
    themes: { 'github-light': 'github-light', 'github-dark': 'github-dark' }
  })
  isLoading.value = false
}

onMounted(() => highlight(props.yaml))
watch(() => props.yaml, highlight)
</script>

<template>
  <div v-if="yaml" class="config-example">
    <pre v-if="isLoading" class="language-yaml"><code>Loading...</code></pre>
    <pre v-else class="language-yaml"><code><template v-for="(line, lineIdx) in tokens" :key="lineIdx"><span
          v-for="(token, i) in line"
          :key="i"
          class="shiki-token"
          :style="tokenStyle(token)"
        >{{ token.content }}</span>{{ lineIdx < tokens.length - 1 ? '\n' : '' }}</template></code></pre>
  </div>
  <div v-else class="config-example-fallback">
    <p>
      See the full example at
      <a href="https://github.com/mostlygeek/llama-swap/blob/main/config.example.yaml" target="_blank">
        config.example.yaml
      </a>
    </p>
  </div>
</template>

<style scoped>
.config-example pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  border-radius: 0.5rem;
  background: var(--vp-code-block-bg);
}

.config-example-fallback {
  padding: 1rem;
  background: var(--vp-code-block-bg);
  border-radius: 0.5rem;
}
</style>
