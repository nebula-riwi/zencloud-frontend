<template>
  <div class="min-h-screen flex items-center justify-center bg-black px-4">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-white mb-8 text-center">Iniciar Sesión</h1>
      <div class="bg-white/5 rounded-xl p-8 border border-white/10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <Input
            id="email"
            v-model="formData.email"
            type="email"
            label="Email"
            placeholder="tu@email.com"
            :error="errors.email"
            :disabled="loading"
            autocomplete="email"
            required
            @blur="validateField('email')"
          />

          <Input
            id="password"
            v-model="formData.password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            :error="errors.password"
            :disabled="loading"
            autocomplete="current-password"
            required
            @blur="validateField('password')"
          />

          <Button
            type="submit"
            :loading="loading"
            :disabled="loading"
            full-width
            size="lg"
          >
            Iniciar Sesión
          </Button>
        </form>

        <p class="mt-6 text-center text-white/60 text-sm">
          ¿No tienes cuenta?
          <router-link to="/auth/register" class="text-[#e78a53] hover:underline font-medium">
            Regístrate aquí
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { authService } from '@/services/auth.service'
import { loginSchema, useFormValidation } from '@/lib/validations'
import { useMeta, META_PRESETS } from '@/composables/useMeta'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import type { LoginFormData } from '@/lib/validations'

// Configurar meta tags
useMeta(META_PRESETS.login)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const formData = reactive<LoginFormData>({
  email: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)

const { validate, validateField: validateSingleField } = useFormValidation(loginSchema)

const validateField = (field: keyof LoginFormData) => {
  const error = validateSingleField(field, formData[field])
  if (error) {
    errors[field] = error
  } else {
    delete errors[field]
  }
}

const handleLogin = async () => {
  // Validar formulario completo
  const validation = validate(formData)
  
  if (!validation.success) {
    Object.assign(errors, validation.errors)
    toastStore.warning('Formulario inválido', 'Por favor, corrige los errores antes de continuar.')
    return
  }

  loading.value = true
  
  try {
    const response = await authService.login(validation.data!)
    authStore.setAuth(response.token, response.refreshToken, response.user)
    
    toastStore.success('¡Bienvenido!', `Hola ${response.user.name}`)
    
    // Redirigir a la ruta guardada o al dashboard
    const redirectPath = (route.query.redirect as string) || '/dashboard'
    router.push(redirectPath)
  } catch (error: any) {
    console.error('Login error:', error)
    
    const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
    toastStore.error('Error de autenticación', errorMessage)
  } finally {
    loading.value = false
  }
}
</script>
