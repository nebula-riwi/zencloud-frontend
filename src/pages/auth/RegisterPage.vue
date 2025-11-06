<template>
  <div class="min-h-screen flex items-center justify-center bg-black px-4">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-white mb-8 text-center">Crear Cuenta</h1>
      <div class="bg-white/5 rounded-xl p-8 border border-white/10">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <Input
            id="name"
            v-model="formData.name"
            type="text"
            label="Nombre"
            placeholder="Tu nombre"
            :error="errors.name"
            :disabled="loading"
            autocomplete="name"
            required
            @blur="validateField('name')"
          />

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
            autocomplete="new-password"
            hint="Mínimo 8 caracteres, debe contener mayúsculas, minúsculas y números"
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
            Crear Cuenta
          </Button>
        </form>

        <p class="mt-6 text-center text-white/60 text-sm">
          ¿Ya tienes cuenta?
          <router-link to="/auth/login" class="text-[#e78a53] hover:underline font-medium">
            Inicia sesión aquí
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { authService } from '@/services/auth.service'
import { registerSchema, useFormValidation } from '@/lib/validations'
import { useMeta, META_PRESETS } from '@/composables/useMeta'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import type { RegisterFormData } from '@/lib/validations'

// Configurar meta tags
useMeta(META_PRESETS.register)

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const formData = reactive<RegisterFormData>({
  name: '',
  email: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)

const { validate, validateField: validateSingleField } = useFormValidation(registerSchema)

const validateField = (field: keyof RegisterFormData) => {
  const error = validateSingleField(field, formData[field])
  if (error) {
    errors[field] = error
  } else {
    delete errors[field]
  }
}

const handleRegister = async () => {
  // Validar formulario completo
  const validation = validate(formData)
  
  if (!validation.success) {
    Object.assign(errors, validation.errors)
    toastStore.warning('Formulario inválido', 'Por favor, corrige los errores antes de continuar.')
    return
  }

  loading.value = true
  
  try {
    const response = await authService.register(validation.data!)
    authStore.setAuth(response.token, response.refreshToken, response.user)
    
    toastStore.success('¡Cuenta creada!', `Bienvenido ${response.user.name}`)
    
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Register error:', error)
    
    let errorMessage = 'Error al crear cuenta. Por favor, intenta nuevamente.'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.status === 409) {
      errorMessage = 'El email ya está registrado.'
    }
    
    toastStore.error('Error de registro', errorMessage)
  } finally {
    loading.value = false
  }
}
</script>
