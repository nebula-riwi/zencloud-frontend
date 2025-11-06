<template>
  <Transition name="fade">
    <span :class="className || ''">{{ displayText }}</span>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const DATABASE_NAMES = ['MySQL', 'PostgreSQL', 'MongoDB', 'SQL Server', 'Redis', 'Cassandra']

interface Props {
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
})

const className = props.className

const currentIndex = ref(0)
const displayText = ref('')
const isScrambling = ref(false)
let scrambleInterval: ReturnType<typeof setInterval> | null = null

const scrambleText = (targetText: string) => {
  isScrambling.value = true
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?'
  let step = 0

  const interval = setInterval(() => {
    if (step <= targetText.length) {
      const revealed = targetText.slice(0, step)
      const scrambled = targetText
        .slice(step)
        .split('')
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('')
      displayText.value = revealed + scrambled
      step++
    } else {
      clearInterval(interval)
      displayText.value = targetText
      isScrambling.value = false
    }
  }, 50)
}

onMounted(() => {
  // Initial scramble
  scrambleText(DATABASE_NAMES[0])

  // Rotate every 2 seconds
  scrambleInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % DATABASE_NAMES.length
    scrambleText(DATABASE_NAMES[currentIndex.value])
  }, 2000)
})

onUnmounted(() => {
  if (scrambleInterval) {
    clearInterval(scrambleInterval)
  }
})
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-enter-from {
  opacity: 0;
}
</style>

