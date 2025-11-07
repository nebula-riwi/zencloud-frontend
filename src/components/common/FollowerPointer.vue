<template>
  <div
    ref="containerRef"
    class="relative"
    data-follower-pointer
    :style="{ cursor: 'none' }"
  >
    <div
      v-if="mounted"
      ref="pointerRef"
      class="fixed z-[999999] pointer-events-none transition-none"
      :style="pointerStyle"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="1"
        viewBox="0 0 16 16"
        class="h-6 w-6 -rotate-[70deg] transform stroke-orange-400 text-orange-500 drop-shadow-lg pointer-events-none"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"
        ></path>
      </svg>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const pointerRef = ref<HTMLElement | null>(null)
const mounted = ref(false)
const x = ref(0)
const y = ref(0)
const displayX = ref(0)
const displayY = ref(0)
const scale = ref(1)
let rafId: number | null = null

const pointerStyle = ref({
  top: '0px',
  left: '0px',
  transform: 'translate(-25%, -15%) scale(1)',
  pointerEvents: 'none' as const,
  willChange: 'transform',
  transformOrigin: 'top left',
})

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    window.innerWidth < 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

const updatePointerPosition = () => {
  // Very fast interpolation for immediate response
  const factor = 0.85 // Very responsive while maintaining smoothness
  displayX.value += (x.value - displayX.value) * factor
  displayY.value += (y.value - displayY.value) * factor
  
  pointerStyle.value = {
    ...pointerStyle.value,
    top: `${displayY.value}px`,
    left: `${displayX.value}px`,
    transform: `translate(-25%, -15%) scale(${scale.value})`,
  }
  
  rafId = requestAnimationFrame(updatePointerPosition)
}

const handleGlobalMouseMove = (e: MouseEvent) => {
  x.value = e.clientX
  y.value = e.clientY
  
  // Check if mouse is over a clickable element
  const target = e.target as HTMLElement
  const isClickable = target && (
    target.tagName === 'BUTTON' ||
    target.tagName === 'A' ||
    target.closest('button') ||
    target.closest('a') ||
    target.closest('[role="button"]') ||
    target.closest('label') ||
    target.closest('.cursor-pointer')
  )
  
  // Check if mouse is over an input/textarea
  const isInput = target.tagName === 'INPUT' || 
                  target.tagName === 'TEXTAREA' || 
                  target.tagName === 'SELECT' ||
                  target.closest('input') ||
                  target.closest('textarea') ||
                  target.closest('select')
  
  // Update scale based on element type
  if (isClickable && !target.closest('button:disabled') && !target.closest('[disabled]')) {
    scale.value = 1.2
  } else if (isInput) {
    // Smaller cursor when over input fields to show it's a text input area
    scale.value = 0.7
  } else {
    scale.value = 1
  }
  
  // Start animation loop if not already running
  if (rafId === null && mounted.value) {
    rafId = requestAnimationFrame(updatePointerPosition)
  }
}

const handleTouchStart = () => {
  if (isMobileDevice()) {
    mounted.value = false
  }
}

onMounted(() => {
  if (isMobileDevice()) {
    return
  }
  
  mounted.value = true
  if (typeof window !== 'undefined') {
    x.value = window.innerWidth / 2
    y.value = window.innerHeight / 2
    displayX.value = x.value
    displayY.value = y.value
  }

  // Use document for global mouse tracking
  document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  
  // Start animation loop
  rafId = requestAnimationFrame(updatePointerPosition)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('touchstart', handleTouchStart)
  
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})
</script>

<style scoped>
.transition-none {
  transition: none !important;
}
</style>

