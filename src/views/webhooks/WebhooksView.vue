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
      <DialogHeader>
        <DialogTitle class="text-white" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">
          {{ editingWebhook ? 'Editar' : 'Crear' }} Webhook
        </DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form @submit.prevent="handleSave" class="space-y-5">
          <div>
            <label class="text-sm font-semibold text-white/90 mb-2 block">Nombre</label>
            <Input 
              v-model="formData.name" 
              required 
              class="bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-[#e78a53]/50"
            />
          </div>
          <div>
            <label class="text-sm font-semibold text-white/90 mb-2 block">URL</label>
            <Input 
              v-model="formData.url" 
              type="url" 
              required 
              class="bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-[#e78a53]/50 font-mono text-sm"
            />
          </div>
          <div>
            <label class="text-sm font-semibold text-white/90 mb-2 block">Tipo de Evento</label>
            <Select 
              v-model="formData.eventType" 
              required
              class="bg-black/40 border-white/10 text-white focus:border-[#e78a53]/50"
            >
              <option value="database_created">Base de datos creada</option>
              <option value="account_created">Cuenta creada</option>
              <option value="production_error">Error de producción</option>
            </Select>
          </div>
          <div class="flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
            <Switch v-model="formData.active" />
            <label class="text-sm text-white/90 font-medium">Activo</label>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              @click="closeModal"
              class="border-white/10 hover:border-[#e78a53]/40"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              :loading="saving"
              class="bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] shadow-lg shadow-[#e78a53]/30"
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
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
import DialogHeader from '@/components/ui/DialogHeader.vue'
import DialogTitle from '@/components/ui/DialogTitle.vue'
import DialogContent from '@/components/ui/DialogContent.vue'
import DialogFooter from '@/components/ui/DialogFooter.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
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
