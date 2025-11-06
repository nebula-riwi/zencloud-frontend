<template>
  <div
    ref="containerRef"
    class="relative"
    :style="{ cursor: 'none' }"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
  >
    <Transition name="fade">
      <div
        v-if="isInside && mounted"
        ref="pointerRef"
        class="fixed z-[99999] pointer-events-none"
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
    </Transition>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const pointerRef = ref<HTMLElement | null>(null)
const isInside = ref(true)
const mounted = ref(false)
const x = ref(0)
const y = ref(0)

const pointerStyle = computed(() => ({
  top: `${y.value}px`,
  left: `${x.value}px`,
  transform: 'translate(-25%, -15%)',
  pointerEvents: 'none' as const,
  willChange: 'transform',
  transformOrigin: 'top left',
}))

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    window.innerWidth < 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

const handleGlobalMouseMove = (e: MouseEvent) => {
  x.value = e.clientX
  y.value = e.clientY
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    const isWithinBounds =
      e.clientX >= rect.left - 50 &&
      e.clientX <= rect.right + 50 &&
      e.clientY >= rect.top - 50 &&
      e.clientY <= rect.bottom + 50
    isInside.value = isWithinBounds
  } else {
    isInside.value = true
  }
}

const handleClick = () => {
  const isMobile = isMobileDevice()
  if (isMobile) {
    isInside.value = false
  } else {
    isInside.value = false
    setTimeout(() => {
      isInside.value = true
    }, 100)
  }
}

const handleTouchStart = () => {
  if (isMobileDevice()) {
    isInside.value = false
  }
}

const handleMouseMove = (e: MouseEvent) => {
  x.value = e.clientX
  y.value = e.clientY
  isInside.value = true
}

const handleMouseLeave = () => {
  isInside.value = false
}

const handleMouseEnter = () => {
  isInside.value = true
}

onMounted(() => {
  mounted.value = true
  if (typeof window !== 'undefined') {
    x.value = window.innerWidth / 2
    y.value = window.innerHeight / 2
    isInside.value = true
  }

  const isMobile = isMobileDevice()
  window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
  window.addEventListener('click', handleClick, { passive: true })

  if (isMobile) {
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchStart, { passive: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleGlobalMouseMove)
  window.removeEventListener('click', handleClick)
  if (isMobileDevice()) {
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchend', handleTouchStart)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.05s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

