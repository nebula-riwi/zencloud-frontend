<template>
  <div class="flex grow items-center justify-center select-none relative min-h-[300px] p-2 sm:p-4">
    <div class="w-full max-w-lg">
      <div class="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        
        <!-- Subtle animated gradient background - top only -->
        <div
          class="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-br from-[#e78a53]/6 via-transparent to-transparent pointer-events-none"
          :style="{ animation: 'pulseOpacity 4s ease-in-out infinite' }"
        />

        <!-- Content area -->
        <div class="relative z-10 p-4 sm:p-6">
          <!-- Input field -->
          <div class="min-h-[100px] sm:min-h-[120px] flex items-start">
            <div v-if="!inputValue" class="w-full text-white/50 text-sm sm:text-base leading-relaxed min-h-[100px] sm:min-h-[120px]">
              <span class="inline">{{ placeholderText }}</span>
              <span
                class="inline-block w-0.5 h-[1em] bg-[#e78a53] ml-1 transition-opacity duration-75"
                :style="{ opacity: placeholderCursor ? 1 : 0, verticalAlign: 'baseline' }"
              />
            </div>
            <textarea
              v-else
              v-model="inputValue"
              class="w-full min-h-[100px] sm:min-h-[120px] bg-transparent border-none text-white resize-none focus:outline-none text-sm sm:text-base leading-relaxed placeholder:text-white/40"
              placeholder="Escribe tu mensaje..."
              @keydown.enter.prevent="handleEnter"
            />
          </div>
        </div>
        
        <!-- Footer with buttons -->
        <div class="relative z-20 border-t border-white/10">
          <div class="flex items-center justify-between px-4 sm:px-6 py-4 gap-3 bg-transparent">
            <!-- Left side buttons -->
            <div class="flex items-center gap-2">
              <button
                class="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e78a53]/50 transition-all duration-200 hover:scale-105 active:scale-95"
                title="Adjuntar archivo"
              >
                <Paperclip class="w-4 h-4 text-white/80 hover:text-[#e78a53] transition-colors" />
              </button>
              <button
                class="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e78a53]/50 transition-all duration-200 hover:scale-105 active:scale-95"
                title="Historial"
              >
                <RefreshCw class="w-4 h-4 text-white/80 hover:text-[#e78a53] transition-colors" />
              </button>
            </div>
            
            <!-- Send button -->
            <button
              type="button"
              class="px-6 py-2.5 rounded-lg font-semibold text-white text-sm shadow-lg transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#e78a53] focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed"
              :class="inputValue 
                ? 'bg-gradient-to-r from-[#e78a53] to-[#f59a63] shadow-[#e78a53]/50 hover:shadow-[#e78a53]/70 hover:from-[#f59a63] hover:to-[#e78a53]' 
                : 'bg-gradient-to-r from-[#e78a53] to-[#f59a63] shadow-[#e78a53]/40 opacity-90'"
              :disabled="!inputValue"
              style="filter: brightness(1.15) saturate(1.1);"
            >
              <Send class="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Paperclip, RefreshCw, Send } from 'lucide-vue-next'

interface Props {
  isHovering?: boolean
}

withDefaults(defineProps<Props>(), {
  isHovering: false,
})

const inputValue = ref('')
const placeholderText = ref('')
const placeholderCursor = ref(true)

const placeholders = [
  'Muéstrame las métricas de Redis y optimiza el rendimiento',
  'Crea una base MySQL con replicación automática para producción',
  'Genera un backup completo de todas mis bases de datos',
  'Muestra el estado de salud de PostgreSQL y MongoDB',
  'Configura un cluster de Redis con alta disponibilidad',
]

let cursorInterval: ReturnType<typeof setInterval> | null = null

const typePlaceholder = () => {
  let currentIndex = 0
  let charIndex = 0
  let isDeleting = false

  const type = () => {
    const currentText = placeholders[currentIndex]

    if (isDeleting) {
      placeholderText.value = currentText.slice(0, charIndex - 1)
      charIndex--
      if (charIndex === 0) {
        isDeleting = false
        currentIndex = (currentIndex + 1) % placeholders.length
        setTimeout(type, 800)
        return
      }
    } else {
      placeholderText.value = currentText.slice(0, charIndex + 1)
      charIndex++
      if (charIndex === currentText.length) {
        isDeleting = true
        setTimeout(type, 2500)
        return
      }
    }

    // Velocidad más constante para evitar saltos
    const baseDelay = isDeleting ? 25 : 60
    const randomVariation = isDeleting ? 0 : Math.random() * 20
    setTimeout(type, baseDelay + randomVariation)
  }

  setTimeout(type, 1000)
}

watch(inputValue, (newVal) => {
  if (newVal) {
    placeholderText.value = ''
  }
})

const handleEnter = () => {
  if (inputValue.value.trim()) {
    inputValue.value = ''
  }
}

onMounted(() => {
  typePlaceholder()
  cursorInterval = setInterval(() => {
    placeholderCursor.value = !placeholderCursor.value
  }, 550)
})

onUnmounted(() => {
  if (cursorInterval) clearInterval(cursorInterval)
})
</script>

<style scoped>
@keyframes pulseOpacity {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
