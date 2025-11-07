<template>
  <div :class="containerClasses">
    <div :class="spinnerClasses">
      <svg
        class="animate-spin"
        :class="sizeClasses"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  overlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullScreen: false,
  overlay: false,
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }
  return sizes[props.size]
})

const containerClasses = computed(() => {
  const base = 'flex flex-col items-center justify-center gap-4'
  
  if (props.fullScreen) {
    return `${base} fixed inset-0 z-50 bg-black/80 backdrop-blur-sm`
  }
  
  if (props.overlay) {
    return `${base} absolute inset-0 z-10 bg-black/60 backdrop-blur-sm rounded-lg`
  }
  
  return `${base} py-8`
})

const spinnerClasses = computed(() => {
  return 'text-[#e78a53]'
})

const textClasses = computed(() => {
  return 'text-white/80 text-sm font-medium'
})
</script>

