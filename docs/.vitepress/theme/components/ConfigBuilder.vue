<script setup lang="ts">
import { ref, computed } from "vue";
import YamlDisplay from "./YamlDisplay.vue";
import FeatureSelector from "./FeatureSelector.vue";
import { buildConfig } from "../lib/ConfigBuilder";

const selectedFeatures = ref<Set<string>>(new Set());
const highlightedFeature = ref<string | null>(null);

const configResult = computed(() => buildConfig(selectedFeatures.value));

function handleFeatureToggle(featureId: string) {
  const newSet = new Set(selectedFeatures.value);
  if (newSet.has(featureId)) {
    newSet.delete(featureId);
    highlightedFeature.value = null;
  } else {
    newSet.add(featureId);
    highlightedFeature.value = featureId;
    setTimeout(() => {
      highlightedFeature.value = null;
    }, 2000);
  }
  selectedFeatures.value = newSet;
}

function handleDownload() {
  const blob = new Blob([configResult.value.yaml], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "config.yaml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleCopy() {
  navigator.clipboard.writeText(configResult.value.yaml);
}
</script>

<template>
  <div class="config-builder-container">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Feature Selector -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 lg:w-80 lg:flex-shrink-0">
        <FeatureSelector
          :selected-features="selectedFeatures"
          @toggle="handleFeatureToggle"
          @download="handleDownload"
        />
      </div>

      <!-- YAML Display -->
      <div class="flex flex-col flex-1 min-w-0">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex-1 flex flex-col min-h-0 border border-gray-200 dark:border-gray-700">
          <!-- Header with copy button -->
          <div class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">config.yaml</span>
            <button @click="handleCopy" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </button>
          </div>
          <div class="flex-1 overflow-hidden">
            <YamlDisplay
              :value="configResult.yaml"
              :line-features="configResult.lineFeatures"
              :highlighted-feature="highlightedFeature"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-builder-container {
  margin: 1rem 0;
  width: 100%;
}
</style>
