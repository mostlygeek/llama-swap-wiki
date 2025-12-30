<script setup lang="ts">
import { features, type Feature } from '../lib/config-sections'

defineProps<{
  selectedFeatures: Set<string>
}>()

const emit = defineEmits<{
  toggle: [featureId: string]
}>()
</script>

<template>
  <div>
    <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">I want to:</h2>
    <div class="space-y-1.5">
      <label
        v-for="feature in features"
        :key="feature.id"
        class="flex items-center gap-2 py-1.5 px-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
      >
        <input
          type="checkbox"
          :checked="selectedFeatures.has(feature.id)"
          @change="emit('toggle', feature.id)"
          class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
        />
        <span class="text-sm text-gray-900 dark:text-gray-100">{{ feature.label }}</span>
      </label>
    </div>
  </div>
</template>
