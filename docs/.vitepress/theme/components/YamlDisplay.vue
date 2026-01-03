<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { codeToTokensWithThemes } from 'shiki'
import type { ThemedTokenWithVariants } from 'shiki'

const props = defineProps<{
  value: string
  lineFeatures: Map<number, string>
  highlightedFeature: string | null
}>()

const fadingOut = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)
const highlightedLineRefs = ref<Map<number, HTMLDivElement>>(new Map())
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

async function highlight(yaml: string) {
  isLoading.value = true
  tokens.value = await codeToTokensWithThemes(yaml, {
    lang: 'yaml',
    themes: { 'github-light': 'github-light', 'github-dark': 'github-dark' }
  })
  isLoading.value = false
}

onMounted(() => highlight(props.value))
watch(() => props.value, highlight)

const firstHighlightedLine = computed(() => {
  if (!props.highlightedFeature) return null
  for (const [lineNum, featureId] of props.lineFeatures) {
    if (featureId === props.highlightedFeature) {
      return lineNum
    }
  }
  return null
})

watch(() => props.highlightedFeature, (newVal) => {
  if (newVal) {
    fadingOut.value = false

    nextTick(() => {
      setTimeout(() => {
        const lineNum = firstHighlightedLine.value
        const element = lineNum ? highlightedLineRefs.value.get(lineNum) : null
        if (element && containerRef.value) {
          const container = containerRef.value
          const containerRect = container.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()

          const elementTop = elementRect.top - containerRect.top + container.scrollTop
          const centerOffset = (container.clientHeight - element.clientHeight) / 2
          const targetScroll = elementTop - centerOffset

          container.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          })
        }
      }, 50)
    })

    setTimeout(() => {
      fadingOut.value = true
    }, 100)
  }
})

function isHighlighted(lineNum: number): boolean {
  return props.lineFeatures.get(lineNum) === props.highlightedFeature
}

function setLineRef(lineNum: number, el: HTMLDivElement | null) {
  if (el) {
    highlightedLineRefs.value.set(lineNum, el)
  }
}
</script>

<template>
  <div ref="containerRef" class="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
    <pre v-if="isLoading" class="p-3 text-sm font-mono">Loading...</pre>
    <pre v-else class="p-3 text-sm font-mono leading-tight whitespace-nowrap"><div
        v-for="(lineTokens, index) in tokens"
        :key="index"
        :ref="(el) => setLineRef(index + 1, el as HTMLDivElement)"
        :class="[
          '-mx-4 px-4 transition-colors',
          fadingOut ? 'duration-[2000ms]' : 'duration-0',
          isHighlighted(index + 1) && !fadingOut ? 'bg-yellow-200 dark:bg-yellow-900/50' : 'bg-transparent'
        ]"
      ><span class="select-none text-gray-400 dark:text-gray-500 w-8 inline-block text-right mr-4">{{ index + 1 }}</span><span class="whitespace-pre"><span
          v-for="(token, i) in lineTokens"
          :key="i"
          class="shiki-token"
          :style="tokenStyle(token)"
        >{{ token.content }}</span><span v-if="!lineTokens.length"> </span></span></div></pre>
  </div>
</template>
