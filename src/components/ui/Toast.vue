<template>
  <div class="fixed top-4 right-4 z-[10000] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto w-[350px] rounded-lg border shadow-lg p-4 flex items-start gap-3',
          'bg-black/95 backdrop-blur-md border-white/10',
          'animate-[slide-in_0.3s_ease-out]',
        ]"
      >
        <div class="flex-shrink-0 mt-0.5">
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5 text-green-500" />
          <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5 text-yellow-500" />
          <Info v-else class="w-5 h-5 text-blue-500" />
        </div>
        
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-white mb-1">{{ toast.title }}</h4>
          <p v-if="toast.message" class="text-sm text-white/70 leading-relaxed">
            {{ toast.message }}
          </p>
        </div>

        <button
          @click="removeToast(toast.id)"
          class="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
const { removeToast } = toastStore
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

