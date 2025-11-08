<template>
  <DashboardLayout>
    <div class="space-y-8 relative">
      <!-- Animated background particles -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          v-for="i in 12"
          :key="i"
          class="absolute w-1 h-1 bg-white/5 rounded-full floating-particle"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }"
        />
      </div>

      <!-- Header with advanced styling -->
      <Transition name="fade-up" appear>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-1 h-12 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
              <div>
                <h1 class="text-5xl font-bold text-white mb-2 tracking-tight" style="text-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 90px rgba(255, 255, 255, 0.2);">
                  Webhooks
                </h1>
                <p class="text-white/70 text-lg">Gestiona tus notificaciones y eventos</p>
              </div>
            </div>
            <Button 
              @click="showCreateModal = true"
              class="bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] shadow-lg shadow-[#e78a53]/30"
            >
              <Plus class="h-4 w-4 mr-2" />
              Nuevo Webhook
            </Button>
          </div>
        </div>
      </Transition>

      <Transition name="fade-up" appear :delay="100">
        <Card class="relative z-10 border-white/10 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent opacity-50"></div>
          <CardContent class="relative z-10 pt-6">
            <Loading v-if="loading" text="Cargando webhooks..." />
            
            <div v-else-if="webhooks.length === 0" class="text-center py-16">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 border border-[#e78a53]/30 mb-6">
                <WebhookIcon class="h-10 w-10 text-[#e78a53] opacity-70" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-3" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);">No hay webhooks</h3>
              <p class="text-white/60 mb-6 max-w-md mx-auto">Crea tu primer webhook para recibir notificaciones en tiempo real sobre eventos importantes</p>
              <Button 
                @click="showCreateModal = true"
                class="bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] shadow-lg shadow-[#e78a53]/30"
              >
                <Plus class="h-4 w-4 mr-2" />
                Crear Webhook
              </Button>
            </div>

            <div v-else class="space-y-4">
              <Card 
                v-for="webhook in webhooks" 
                :key="webhook.id" 
                class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300"
              >
                <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-300"></div>
                <CardHeader class="relative z-10">
                  <div class="flex items-start justify-between">
                    <div class="flex-1 space-y-3">
                      <div class="flex items-center gap-3">
                        <CardTitle class="text-xl text-white" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">{{ webhook.name }}</CardTitle>
                        <Badge 
                          :variant="webhook.active ? 'success' : 'warning'" 
                          class="shadow-lg"
                        >
                          {{ webhook.active ? 'Activo' : 'Inactivo' }}
                        </Badge>
                      </div>
                      <CardDescription class="font-mono text-xs break-all text-white/60 bg-black/30 px-3 py-2 rounded-lg border border-white/10">
                        {{ webhook.url }}
                      </CardDescription>
                      <div class="flex items-center gap-2 text-sm text-white/50">
                        <WebhookIcon class="h-4 w-4" />
                        <span>Evento: {{ getEventLabel(webhook.eventType) }}</span>
                      </div>
                    </div>
                    <div class="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        @click="editWebhook(webhook)"
                        class="border-white/10 hover:border-[#e78a53]/40"
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        @click="toggleWebhook(webhook.id)"
                        class="border-white/10 hover:border-[#e78a53]/40"
                      >
                        {{ webhook.active ? 'Desactivar' : 'Activar' }}
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        @click="confirmDelete(webhook.id)"
                        class="bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </CardContent>
        </Card>
      </Transition>
    </div>

    <!-- Create/Edit Modal -->
    <Dialog :model-value="showCreateModal || editingWebhook !== null" @update:model-value="closeModal">
      <div class="relative w-full max-w-[500px] mx-auto">
        <!-- Main Modal Container -->
        <div class="bg-gradient-to-br from-black/98 via-black/95 to-black/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
          <!-- Close Button -->
          <button
            @click="closeModal"
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
              <div class="mb-6">
                <span class="text-4xl font-bold tracking-tight">
                  <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">Zen</span><span class="text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">Cloud</span>
                </span>
              </div>
              <h2 class="text-2xl font-bold text-white mb-2">{{ editingWebhook ? 'Editar' : 'Crear' }} Webhook</h2>
              <p class="text-white/60 text-sm text-center">
                {{ editingWebhook ? 'Modifica la configuración del webhook' : 'Crea un nuevo webhook para recibir notificaciones en tiempo real' }}
              </p>
            </div>

            <form @submit.prevent="handleSave" class="space-y-5">
              <!-- Name -->
              <div class="space-y-2">
                <label for="webhook-name" class="block text-sm font-semibold text-white/90 transition-colors duration-200">
                  Nombre
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <input
                    id="webhook-name"
                    v-model="formData.name"
                    type="text"
                    placeholder="Mi Webhook"
                    required
                    :disabled="saving"
                    autocomplete="off"
                    class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                </div>
              </div>

              <!-- URL -->
              <div class="space-y-2">
                <label for="webhook-url" class="block text-sm font-semibold text-white/90 transition-colors duration-200">
                  URL
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    id="webhook-url"
                    v-model="formData.url"
                    type="url"
                    placeholder="https://example.com/webhook"
                    required
                    :disabled="saving"
                    autocomplete="off"
                    class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20 font-mono text-sm"
                  />
                </div>
              </div>

              <!-- Event Type -->
              <div class="space-y-2">
                <label for="webhook-event" class="block text-sm font-semibold text-white/90 transition-colors duration-200">
                  Tipo de Evento
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110 z-10">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <select
                    id="webhook-event"
                    v-model="formData.eventType"
                    required
                    :disabled="saving"
                    class="w-full pl-12 pr-10 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  >
                    <option value="database_created">Base de datos creada</option>
                    <option value="account_created">Cuenta creada</option>
                    <option value="production_error">Error de producción</option>
                  </select>
                </div>
              </div>

              <!-- Active Switch -->
              <div class="flex items-center space-x-3 p-4 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all duration-300">
                <Switch v-model="formData.active" />
                <label class="text-sm text-white/90 font-medium">Webhook activo</label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="saving || !formData.name.trim() || !formData.url.trim()"
                class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e78a53] via-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:via-[#f59a63] hover:to-[#e78a53] text-white font-semibold text-base shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <span v-if="saving" class="mr-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ saving ? 'Guardando...' : 'Guardar Webhook' }}
              </button>

              <!-- Cancel Button -->
              <button
                type="button"
                @click="closeModal"
                class="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-medium text-sm transition-all duration-300 focus:outline-none active:scale-95 hover:scale-[1.02]"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </div>
    </Dialog>

    <AlertDialog
      v-model="showDeleteDialog"
      title="Eliminar Webhook"
      description="¿Estás seguro de que deseas eliminar este webhook?"
      @confirm="handleDelete"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useWebhookStore } from '@/stores/webhook'
import { useToastStore } from '@/stores/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Loading from '@/components/ui/Loading.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Switch from '@/components/ui/Switch.vue'
import AlertDialog from '@/components/ui/AlertDialog.vue'
import { Webhook as WebhookIcon, Plus } from 'lucide-vue-next'
import type { Webhook, WebhookEventType } from '@/types'
import { storeToRefs } from 'pinia'

const webhookStore = useWebhookStore()
const toastStore = useToastStore()
const { webhooks, loading } = storeToRefs(webhookStore)

const showCreateModal = ref(false)
const editingWebhook = ref<Webhook | null>(null)
const showDeleteDialog = ref(false)
const webhookToDelete = ref<string | null>(null)
const saving = ref(false)

const formData = reactive({
  name: '',
  url: '',
  eventType: 'database_created' as WebhookEventType,
  active: true,
})

function getEventLabel(eventType: WebhookEventType): string {
  const labels: Record<WebhookEventType, string> = {
    database_created: 'Base de datos creada',
    account_created: 'Cuenta creada',
    production_error: 'Error de producción',
  }
  return labels[eventType] || eventType
}

function editWebhook(webhook: Webhook) {
  editingWebhook.value = webhook
  formData.name = webhook.name
  formData.url = webhook.url
  formData.eventType = webhook.eventType
  formData.active = webhook.active
}

function closeModal() {
  showCreateModal.value = false
  editingWebhook.value = null
  formData.name = ''
  formData.url = ''
  formData.eventType = 'database_created'
  formData.active = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editingWebhook.value) {
      await webhookStore.updateWebhook(editingWebhook.value.id, formData)
      toastStore.success('Webhook actualizado', 'El webhook ha sido actualizado correctamente')
    } else {
      await webhookStore.createWebhook(formData)
      toastStore.success('Webhook creado', 'El webhook ha sido creado correctamente')
    }
    closeModal()
  } catch (error: any) {
    toastStore.error('Error', error.response?.data?.message || 'No se pudo guardar el webhook')
  } finally {
    saving.value = false
  }
}

async function toggleWebhook(id: string) {
  try {
    await webhookStore.toggleWebhook(id)
    toastStore.success('Webhook actualizado', 'El estado del webhook ha sido cambiado')
  } catch (error: any) {
    toastStore.error('Error', 'No se pudo cambiar el estado del webhook')
  }
}

function confirmDelete(id: string) {
  webhookToDelete.value = id
  showDeleteDialog.value = true
}

async function handleDelete() {
  if (!webhookToDelete.value) return
  try {
    await webhookStore.deleteWebhook(webhookToDelete.value)
    toastStore.success('Webhook eliminado', 'El webhook ha sido eliminado correctamente')
  } catch (error: any) {
    toastStore.error('Error', 'No se pudo eliminar el webhook')
  }
  webhookToDelete.value = null
}

onMounted(async () => {
  // Load mock data - Backend will be implemented later
  try {
    await webhookStore.fetchWebhooks()
  } catch (error) {
    // Silently fail - using mock data
    console.log('Using mock data - backend not available yet')
  }
})
</script>

<style scoped>
@keyframes floatParticle {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  50% {
    transform: translateY(-100px) translateX(50px) scale(1.5);
    opacity: 0.6;
  }
  90% {
    opacity: 0.3;
  }
}

.floating-particle {
  animation: floatParticle infinite ease-in-out;
}

.fade-up-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
