<script setup lang="ts">
import { ref, computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-yaml'
import { configConcepts, findConceptForLine, type ConfigConcept } from '../lib/config-concepts'
import configYaml from '../../../config.example.yaml?raw'

// Current hovered concept (null = show default intro)
const hoveredConcept = ref<ConfigConcept | null>(null)

// Parse YAML into lines with concept detection
const lines = computed(() => {
  return configYaml.split('\n').map((line, index) => {
    const concept = findConceptForLine(line)
    const highlighted = Prism.highlight(line || ' ', Prism.languages.yaml, 'yaml')
    return { raw: line, html: highlighted, concept, lineNum: index + 1 }
  })
})

// Handle mouse enter on a line
function handleMouseEnter(concept: ConfigConcept | null) {
  if (concept) {
    hoveredConcept.value = concept
  }
}
</script>

<template>
  <div class="config-explorer">
    <!-- Left: YAML with hoverable lines -->
    <div class="yaml-panel">
      <pre class="language-yaml"><div
          v-for="line in lines"
          :key="line.lineNum"
          class="explorer-line"
          :class="{
            'has-concept': line.concept,
            'is-hovered': hoveredConcept?.id === line.concept?.id
          }"
          @mouseenter="handleMouseEnter(line.concept)"
        ><span class="line-number">{{ line.lineNum }}</span><span v-html="line.html"></span></div></pre>
    </div>

    <!-- Right: Description panel -->
    <div class="description-panel">
      <template v-if="hoveredConcept">
        <h3>{{ hoveredConcept.title }}</h3>
        <p>{{ hoveredConcept.description }}</p>
        <div v-if="hoveredConcept.example" class="concept-example">
          <strong>Example:</strong>
          <pre class="example-code">{{ hoveredConcept.example }}</pre>
        </div>
      </template>
      <template v-else>
        <h3>Configuration Explorer</h3>
        <p>Hover over highlighted lines in the YAML to learn about each configuration option.</p>
        <p class="hint">Lines with configuration keys are interactive. Try hovering over <code>healthCheckTimeout</code>, <code>models</code>, or <code>groups</code>.</p>
      </template>
    </div>
  </div>
</template>
