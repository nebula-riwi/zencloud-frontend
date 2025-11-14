<template>
  <DashboardLayout>
    <div class="min-h-screen flex items-center justify-center p-4">
      <Transition name="fade-up" appear>
        <Card class="max-w-2xl w-full border-white/10">
          <CardContent class="pt-12 pb-12">
            <div class="text-center">
              <!-- Icono de estado -->
              <div 
                class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 transition-all duration-500"
                :class="isSuccess 
                  ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-2 border-green-500/50 shadow-lg shadow-green-500/30' 
                  : 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/50 shadow-lg shadow-red-500/30'"
              >
                <CheckCircle2 
                  v-if="isSuccess" 
                  class="w-12 h-12 text-green-500" 
                />
                <XCircle 
                  v-else 
                  class="w-12 h-12 text-red-500" 
                />
              </div>

              <!-- Título -->
              <h1 
                class="text-4xl font-bold mb-4 transition-all duration-500"
                :class="isSuccess ? 'text-green-400' : 'text-red-400'"
                style="text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);"
              >
                {{ isSuccess ? '¡Pago Exitoso!' : 'Pago No Realizado' }}
              </h1>

              <!-- Mensaje -->
              <p class="text-white/80 text-lg mb-8 max-w-md mx-auto">
                {{ isSuccess 
                  ? 'Tu plan ha sido actualizado correctamente. Ya puedes disfrutar de todas las características de tu nuevo plan.' 
                  : 'El pago fue rechazado o cancelado. Por favor, intenta nuevamente o contacta con soporte si el problema persiste.' 
                }}
              </p>

              <!-- Información adicional si es éxito -->
              <div v-if="isSuccess && paymentInfo" class="mb-8 p-6 rounded-xl bg-black/30 border border-white/10">
                <div class="space-y-3 text-left">
                  <div class="flex justify-between items-center">
                    <span class="text-white/60">Plan:</span>
                    <span class="text-white font-semibold">{{ paymentInfo.planName || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-white/60">Estado:</span>
                    <Badge variant="success" class="bg-green-500/20 text-green-400 border-green-500/50">
                      Aprobado
                    </Badge>
                  </div>
                  <div v-if="paymentInfo.paymentId" class="flex justify-between items-center">
                    <span class="text-white/60">ID de Pago:</span>
                    <span class="text-white/80 font-mono text-sm">{{ paymentInfo.paymentId }}</span>
                  </div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  @click="goToBilling"
                  class="bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] text-white shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50"
                >
                  <ArrowLeft class="w-4 h-4 mr-2" />
                  Volver a Facturación
                </Button>
                <Button
                  v-if="!isSuccess"
                  @click="retryPayment"
                  variant="outline"
                  class="border-white/20 bg-black/40 text-white hover:bg-black/50"
                >
                  Intentar Nuevamente
                </Button>
                <Button
                  @click="goToDashboard"
                  variant="outline"
                  class="border-white/20 bg-black/40 text-white hover:bg-black/50"
                >
                  Ir al Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Transition>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePlanStore } from '@/stores/plan'
import { useToastStore } from '@/stores/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const planStore = usePlanStore()
const toastStore = useToastStore()

const isSuccess = ref(false)
const paymentInfo = ref<{
  planName?: string
  paymentId?: string
  status?: string
} | null>(null)

const status = computed(() => {
  const statusParam = route.query.status as string || route.query.collection_status as string
  return statusParam?.toLowerCase()
})

onMounted(async () => {
  // Determinar si el pago fue exitoso
  const statusValue = status.value
  isSuccess.value = statusValue === 'approved' || statusValue === 'success'

  // Extraer información del pago de los query params
  paymentInfo.value = {
    paymentId: (route.query.payment_id || route.query.collection_id) as string,
    status: statusValue,
    planName: undefined, // Se actualizará cuando obtengamos el plan
  }

  // Actualizar el plan inmediatamente
  try {
    await planStore.fetchPlan()
    
    // Obtener el nombre del plan actualizado
    if (planStore.currentPlan) {
      paymentInfo.value.planName = planStore.currentPlan.name
    }

    // Mostrar toast según el resultado
    if (isSuccess.value) {
      toastStore.success('Plan actualizado', 'Tu plan ha sido actualizado correctamente')
    } else {
      toastStore.error('Pago rechazado', 'El pago fue rechazado o cancelado')
    }
  } catch (error) {
    console.error('Error actualizando plan después del pago:', error)
    if (isSuccess.value) {
      toastStore.warning('Plan actualizado', 'El pago fue exitoso, pero hubo un problema al actualizar la información. Por favor, recarga la página.')
    }
  }

  // Limpiar los query params de la URL después de procesarlos
  if (Object.keys(route.query).length > 0) {
    router.replace({ path: route.path })
  }
})

function goToBilling() {
  router.push('/billing')
}

function goToDashboard() {
  router.push('/dashboard')
}

function retryPayment() {
  router.push('/billing')
}
</script>

<style scoped>
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

