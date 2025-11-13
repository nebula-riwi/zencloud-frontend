<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="relative w-full max-w-[500px] mx-auto">
      <!-- Main Modal Container -->
      <div class="bg-gradient-to-br from-black/98 via-black/95 to-black/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        <!-- Close Button -->
        <button
          @click="$emit('update:modelValue', false)"
          class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all duration-300 focus:outline-none hover:scale-110 active:scale-95 hover:rotate-90"
          aria-label="Cerrar modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Decorative gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent pointer-events-none"></div>
        
        <!-- Content -->
        <div class="relative z-10 p-8 md:p-10">
          <!-- Header -->
          <div class="flex flex-col items-center mb-8">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center border border-red-500/30 mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">{{ title }}</h2>
            <p v-if="description" class="text-white/60 text-sm text-center">
              {{ description }}
            </p>
          </div>

          <slot />

          <!-- Footer -->
          <div class="flex gap-3 mt-8">
            <Button 
              variant="outline" 
              @click="$emit('update:modelValue', false)"
              class="flex-1 border-white/10 hover:border-white/20"
            >
              {{ cancelText }}
            </Button>
            <Button 
              :variant="confirmVariant === 'danger' ? 'danger' : 'primary'"
              @click="handleConfirm"
              class="flex-1"
            >
              {{ confirmText }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue'
import Button from './Button.vue'

defineProps<{
  modelValue: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

