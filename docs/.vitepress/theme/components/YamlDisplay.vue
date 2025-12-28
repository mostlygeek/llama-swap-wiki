<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-yaml'

const props = defineProps<{
  value: string
  lineFeatures: Map<number, string>
  highlightedFeature: string | null
}>()

const fadingOut = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)
const highlightedLineRefs = ref<Map<number, HTMLDivElement>>(new Map())

const highlightedLines = computed(() => {
  const highlighted = Prism.highlight(props.value, Prism.languages.yaml, 'yaml')
  return highlighted.split('\n')
})

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
  <div ref="containerRef" class="h-full overflow-auto bg-gray-50">
    <pre class="p-3 text-sm font-mono leading-tight whitespace-nowrap">
      <div
        v-for="(lineHtml, index) in highlightedLines"
        :key="index"
        :ref="(el) => setLineRef(index + 1, el as HTMLDivElement)"
        :class="[
          '-mx-4 px-4 transition-colors',
          fadingOut ? 'duration-[2000ms]' : 'duration-0',
          isHighlighted(index + 1) && !fadingOut ? 'bg-yellow-200' : 'bg-transparent'
        ]"
      >
        <span class="select-none text-gray-400 w-8 inline-block text-right mr-4">{{ index + 1 }}</span>
        <span v-html="lineHtml || ' '"></span>
      </div>
    </pre>
  </div>
</template>
