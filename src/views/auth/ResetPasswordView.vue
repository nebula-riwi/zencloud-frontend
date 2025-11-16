<template>
  <div class="min-h-screen bg-black flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md bg-gradient-to-br from-black/95 to-black/85 border border-white/10 rounded-3xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <p class="text-4xl font-bold tracking-tight mb-3">
          <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">Zen</span><span class="text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">Cloud</span>
        </p>
        <h1 class="text-2xl font-semibold text-white mb-2">Restablecer contraseña</h1>
        <p class="text-white/60 text-sm">
          {{ linkValid ? 'Ingresa tu nueva contraseña para continuar.' : 'El enlace no es válido o ya expiró.' }}
        </p>
      </div>

      <form v-if="linkValid" @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-white/90">Nueva contraseña</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            minlength="8"
            required
            :disabled="loading"
            autocomplete="new-password"
            class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-white/90">Confirmar contraseña</label>
          <input
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            minlength="8"
            required
            :disabled="loading"
            autocomplete="new-password"
            class="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <label class="inline-flex items-center gap-2 text-sm text-white/70 cursor-pointer">
          <input type="checkbox" v-model="showPassword" class="rounded border-white/20 bg-black/40" />
          Mostrar contraseñas
        </label>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e78a53] via-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:via-[#f59a63] hover:to-[#e78a53] text-white font-semibold text-base shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 hover:scale-[1.01]"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
        </button>
        <button
          type="button"
          @click="volverAlInicio"
          class="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-medium text-sm transition-all duration-300 focus:outline-none active:scale-95"
        >
          Volver al inicio
        </button>
      </form>

      <div v-else class="text-center space-y-4">
        <p class="text-white/70 text-sm">
          Solicita un nuevo enlace desde la opción "¿Olvidaste tu contraseña?".
        </p>
        <button
          type="button"
          @click="volverAlInicio"
          class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#e78a53] to-[#f59a63] text-white font-semibold text-base shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300 focus:outline-none active:scale-95"
        >
          Ir a ZenCloud
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const token = ref(typeof route.query.token === 'string' ? route.query.token : '')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)

watch(
  () => route.query,
  (query) => {
    email.value = typeof query.email === 'string' ? query.email : ''
    token.value = typeof query.token === 'string' ? query.token : ''
  }
)

const linkValid = computed(() => !!email.value && !!token.value)

function volverAlInicio() {
  router.push({ name: 'Home', query: { action: 'login' } })
}

  async function handleSubmit() {
  if (!linkValid.value) {
    toastStore.error('Enlace inválido', 'Solicita un nuevo enlace desde la opción "Olvidé mi contraseña".')
    return
  }

  if (password.value.length < 8) {
    toastStore.warning('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres.')
    return
  }

  if (password.value !== confirmPassword.value) {
    toastStore.warning('Contraseñas no coinciden', 'Las contraseñas deben ser iguales.')
    return
  }

  // Validar fortaleza de contraseña
  const hasUpperCase = /[A-Z]/.test(password.value)
  const hasLowerCase = /[a-z]/.test(password.value)
  const hasNumber = /\d/.test(password.value)
  const hasSpecialChar = /[^a-zA-Z\d]/.test(password.value)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    toastStore.warning(
      'Contraseña débil',
      'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.'
    )
    return
  }

  loading.value = true
  try {
    await authService.resetPassword({
      email: email.value,
      token: token.value,
      newPassword: password.value,
    })
    toastStore.success('Contraseña actualizada', 'Tu contraseña se actualizó correctamente. Inicia sesión con tus nuevas credenciales.')
    router.push({ name: 'Home', query: { action: 'login' } })
  } catch (error: any) {
    // Manejar errores específicos del backend
    const errorCode = error?.response?.data?.errorCode
    const errorMessage = error?.response?.data?.message || error.message || 'No se pudo restablecer la contraseña.'
    
    let userMessage = errorMessage
    
    // Mapear códigos de error a mensajes amigables
    switch (errorCode) {
      case 'USER_NOT_FOUND':
        userMessage = 'No se encontró un usuario con ese correo electrónico.'
        break
      case 'NO_TOKEN_REQUESTED':
        userMessage = 'No se ha solicitado un restablecimiento de contraseña. Por favor, solicita uno nuevo.'
        break
      case 'INVALID_TOKEN':
        userMessage = 'El enlace de restablecimiento es inválido. Verifica que estés usando el enlace correcto del correo electrónico.'
        break
      case 'EXPIRED_TOKEN':
        userMessage = 'El enlace de restablecimiento ha expirado. Por favor, solicita un nuevo restablecimiento de contraseña.'
        break
      case 'INVALID_TOKEN_SIGNATURE':
        userMessage = 'El token de restablecimiento no es válido. El enlace puede estar corrupto o haber sido modificado.'
        break
      case 'WEAK_PASSWORD':
        userMessage = 'La contraseña no cumple con los requisitos de seguridad. Debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.'
        break
    }
    
    toastStore.error('Error al restablecer contraseña', userMessage)
  } finally {
    loading.value = false
  }
}
</script>

