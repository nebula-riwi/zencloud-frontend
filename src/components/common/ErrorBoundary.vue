<template>
  <FollowerPointer v-if="hasError">
    <div class="min-h-screen bg-black flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white/5 rounded-xl p-8 border border-white/10">
        <div class="flex flex-col items-center text-center gap-4">
          <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              class="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <div>
            <h1 class="text-2xl font-bold text-white mb-2">Algo salió mal</h1>
            <p class="text-white/60 mb-4">
              Ocurrió un error inesperado. Por favor, intenta recargar la página.
            </p>
            
            <details v-if="error" class="text-left mb-4">
              <summary class="text-white/80 text-sm cursor-pointer hover:text-white transition-colors mb-2">
                ▼ Detalles del error
              </summary>
              <div class="bg-black/40 rounded-lg p-4 mt-2">
                <p class="text-red-400 text-xs font-mono break-all">{{ error.message }}</p>
                <pre
                  v-if="error.stack"
                  class="text-white/60 text-xs mt-2 overflow-auto max-h-40"
                >{{ error.stack }}</pre>
              </div>
            </details>
          </div>
          
          <div class="flex gap-3 w-full">
            <button
              @click="handleReload"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20"
            >
              Recargar página
            </button>
            <button
              @click="handleGoHome"
              class="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-medium transition-colors"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  </FollowerPointer>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, provide } from 'vue'
import { useRouter } from 'vue-router'
import FollowerPointer from './FollowerPointer.vue'

const router = useRouter()
const hasError = ref(false)
const error = ref<Error | null>(null)

// Capturar errores de componentes hijos
onErrorCaptured((err: Error, _instance, info) => {
  console.error('Error capturado por ErrorBoundary:', err, info)
  error.value = err
  hasError.value = true
  
  // Reportar error (aquí podrías enviar a un servicio de logging)
  // reportError(err, info)
  
  // Retornar false para prevenir que el error se propague más
  return false
})

// Función para resetear el error boundary (útil para componentes hijos)
const resetError = () => {
  hasError.value = false
  error.value = null
}

// Proporcionar función de reset para componentes hijos
provide('resetErrorBoundary', resetError)

const handleReload = () => {
  window.location.reload()
}

const handleGoHome = () => {
  hasError.value = false
  error.value = null
  router.push({ name: 'Home' })
}
</script>

