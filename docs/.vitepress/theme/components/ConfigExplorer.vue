<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { codeToTokensWithThemes } from "shiki";
import type { ThemedTokenWithVariants } from "shiki";
import { findConceptForLine, type ConfigConcept } from "../lib/config-concepts";
import basicYaml from "../../../configs/basic.yaml?raw";
import advancedYaml from "../../../configs/advanced.yaml?raw";

// Map config names to YAML content
const configMap: Record<string, string> = {
  basic: basicYaml,
  advanced: advancedYaml,
};

interface Line {
  raw: string;
  tokens: ThemedTokenWithVariants[];
  concept: ConfigConcept | null;
  lineNum: number;
}

const props = defineProps<{
  config?: "basic" | "advanced";
  yaml?: string | null;
}>();

const hoveredConcept = ref<ConfigConcept | null>(null);
const lines = ref<Line[]>([]);
const isLoading = ref(true);

// Get YAML content: prefer yaml prop, then fall back to config map
const yamlContent = computed(() => {
  if (props.yaml) return props.yaml;
  return configMap[props.config ?? "basic"] ?? basicYaml;
});

// Get CSS style for a token with light/dark variants
function tokenStyle(token: ThemedTokenWithVariants): Record<string, string> {
  const light = token.variants["github-light"]?.color;
  const dark = token.variants["github-dark"]?.color;
  if (light && dark) {
    return { "--light": light, "--dark": dark } as Record<string, string>;
  }
  return {};
}

// Tokenize YAML with both themes
async function tokenizeYaml(yaml: string) {
  isLoading.value = true;
  const tokens = await codeToTokensWithThemes(yaml, {
    lang: "yaml",
    themes: { "github-light": "github-light", "github-dark": "github-dark" },
  });

  lines.value = yaml.split("\n").map((line, index) => ({
    raw: line,
    tokens: tokens[index] || [],
    concept: findConceptForLine(line),
    lineNum: index + 1,
  }));

  isLoading.value = false;
}

// Initialize on mount and watch for yaml prop changes
onMounted(() => tokenizeYaml(yamlContent.value));
watch(yamlContent, (newYaml) => tokenizeYaml(newYaml));

// Handle mouse enter on a line
function handleMouseEnter(concept: ConfigConcept | null) {
  if (concept) {
    hoveredConcept.value = concept;
  }
}
</script>

<template>
  <div class="config-explorer">
    <!-- Left: YAML with hoverable lines -->
    <div class="yaml-panel">
      <pre v-if="isLoading" class="loading">Loading...</pre>
      <pre v-else class="language-yaml"><div
          v-for="line in lines"
          :key="line.lineNum"
          class="explorer-line"
          :class="{
            'has-concept': line.concept,
            'is-hovered': hoveredConcept?.id === line.concept?.id
          }"
          @mouseenter="handleMouseEnter(line.concept)"
        ><span class="line-number">{{ line.lineNum }}</span><span
            v-for="(token, i) in line.tokens"
            :key="i"
            class="shiki-token"
            :style="tokenStyle(token)"
          >{{ token.content }}</span><span v-if="!line.tokens.length"> </span></div></pre>
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
        <p class="hint">
          Lines with configuration keys are interactive. Try hovering over <code>models</code> or
          <code>cmd</code>.
        </p>
      </template>
    </div>
  </div>
</template>
