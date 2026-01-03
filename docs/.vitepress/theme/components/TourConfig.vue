<script setup lang="ts">
import { ref, computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-yaml'
import { computeYamlDiff } from '../lib/yaml-diff'
import { getTourConfig, getPreviousTourConfig } from '../lib/tour-configs'

const props = defineProps<{
  step: number
}>()

// View mode toggle
const viewMode = ref<'full' | 'changes'>('full')
const copied = ref(false)

// Get configs from centralized store
const currentYaml = computed(() => getTourConfig(props.step))
const previousYaml = computed(() => getPreviousTourConfig(props.step))

// Compute diff
const diffResult = computed(() =>
  computeYamlDiff(previousYaml.value, currentYaml.value)
)

// Check if there are any changes (for step 1, disable the button)
const hasChanges = computed(() => props.step > 1)

// Syntax highlighted lines
const highlightedLines = computed(() => {
  const yaml = currentYaml.value
  const highlighted = Prism.highlight(yaml, Prism.languages.yaml, 'yaml')
  return highlighted.split('\n')
})

// Check if line is changed/added
function isChangedLine(lineNum: number): boolean {
  return diffResult.value.changedLineNumbers.has(lineNum)
}

// Copy to clipboard
async function copyConfig() {
  try {
    await navigator.clipboard.writeText(currentYaml.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

</script>

<template>
  <div class="tour-config">
    <!-- Header with toggle and actions -->
    <div class="tour-config-header">
      <!-- View mode toggle -->
      <div class="toggle-group">
        <button
          :class="['toggle-btn', { active: viewMode === 'full' }]"
          @click="viewMode = 'full'"
        >
          Full Config
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'changes' }]"
          @click="viewMode = 'changes'"
          :disabled="!hasChanges"
          :title="!hasChanges ? 'No previous step to compare' : 'Show changes from previous step'"
        >
          Show Changes
        </button>
      </div>

      <!-- Copy button -->
      <button @click="copyConfig" class="copy-btn" :class="{ copied }">
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <!-- YAML display -->
    <div class="tour-config-content">
      <pre class="language-yaml"><div
          v-for="(lineHtml, index) in highlightedLines"
          :key="index"
          :data-line="index + 1"
          :class="[
            'config-line',
            {
              'line-added': viewMode === 'changes' && isChangedLine(index + 1),
              'line-dimmed': viewMode === 'changes' && !isChangedLine(index + 1)
            }
          ]"
        ><span class="line-number">{{ index + 1 }}</span><span v-html="lineHtml || ' '"></span></div></pre>
    </div>

    <!-- Legend (only in changes view) -->
    <div v-if="viewMode === 'changes' && hasChanges" class="diff-legend">
      <span class="legend-item">
        <span class="legend-color added"></span>
        New in this step
      </span>
    </div>
  </div>
</template>
