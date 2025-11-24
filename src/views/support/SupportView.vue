<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Soporte Técnico</h1>
        <p class="text-muted-foreground mt-2">
          ¿Necesitas ayuda? Completa el formulario y te contactaremos por WhatsApp.
        </p>
      </div>

      <Card>
        <CardContent class="p-6">
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-white mb-2">
                Nombre completo <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-white mb-2">
                Correo electrónico <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-white mb-2">
                Asunto <span class="text-red-500">*</span>
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="" disabled>Selecciona un tema</option>
                <option value="Problema técnico">Problema técnico</option>
                <option value="Error en la aplicación">Error en la aplicación</option>
                <option value="Consulta sobre facturación">Consulta sobre facturación</option>
                <option value="Problema con base de datos">Problema con base de datos</option>
                <option value="Sugerencia de mejora">Sugerencia de mejora</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-white mb-2">
                Describe tu problema <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="8"
                class="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe detalladamente tu problema o consulta..."
              />
            </div>

            <div class="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                @click="resetForm"
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                :disabled="!isFormValid"
                class="min-w-[180px]"
              >
                <span class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Abrir WhatsApp</span>
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

const toastStore = useToastStore()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.email.trim() !== '' &&
         form.value.subject !== '' &&
         form.value.message.trim() !== ''
})

function submitForm() {
  if (!isFormValid.value) return

  // Construir mensaje para WhatsApp
  const whatsappMessage = `*SOLICITUD DE SOPORTE - ZENCLOUD*

*Información de Contacto:*
• Nombre: ${form.value.name}
• Email: ${form.value.email}
• Asunto: ${form.value.subject}

*Descripción del Problema:*
${form.value.message}

---
_Mensaje generado desde el panel de soporte de ZenCloud_`

  // Codificar mensaje para URL
  const encodedMessage = encodeURIComponent(whatsappMessage)
  
  // Abrir WhatsApp con mensaje pre-cargado
  const whatsappUrl = `https://wa.me/573195256897?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')

  toastStore.success('Redirigiendo a WhatsApp', 'Se abrirá WhatsApp con tu mensaje de soporte pre-cargado.')
  
  // Resetear formulario después de un breve delay
  setTimeout(() => {
    resetForm()
  }, 1000)
}

function resetForm() {
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}
</script>
