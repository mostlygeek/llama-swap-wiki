<script setup lang="ts">
import { features, type Feature } from '../lib/config-sections'

defineProps<{
  selectedFeatures: Set<string>
}>()

const emit = defineEmits<{
  toggle: [featureId: string]
  download: []
}>()
</script>

<template>
  <div>
    <h2 class="text-base font-semibold text-gray-900">I want to:</h2>
    <div class="space-y-1.5">
      <label
        v-for="feature in features"
        :key="feature.id"
        class="flex items-center gap-2 py-1.5 px-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors"
      >
        <input
          type="checkbox"
          :checked="selectedFeatures.has(feature.id)"
          @change="emit('toggle', feature.id)"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span class="text-sm text-gray-900">{{ feature.label }}</span>
      </label>
    </div>

    <div class="mt-3 pt-3 border-t border-gray-200">
      <button
        @click="emit('download')"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download config.yaml
      </button>
    </div>
  </div>
</template>
