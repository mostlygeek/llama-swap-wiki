<script setup lang="ts">
import { computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-yaml'

const props = defineProps<{
  yaml: string | null
}>()

const highlightedYaml = computed(() => {
  if (!props.yaml) return ''
  return Prism.highlight(props.yaml, Prism.languages.yaml, 'yaml')
})
</script>

<template>
  <div v-if="yaml" class="config-example">
    <pre class="language-yaml"><code v-html="highlightedYaml"></code></pre>
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
