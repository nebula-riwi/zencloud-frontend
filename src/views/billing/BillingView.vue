<template>
  <DashboardLayout>
    <div class="space-y-8 relative">
      <!-- Animated background particles -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          v-for="i in 20"
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
          <div class="flex items-center gap-4 mb-6">
            <div class="w-1 h-12 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
            <div>
              <h1 class="text-5xl font-bold text-white mb-2 tracking-tight" style="text-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 90px rgba(255, 255, 255, 0.2);">
                Facturación
              </h1>
              <p class="text-white/70 text-lg">Gestiona tu plan y pagos</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Plans with individual animations -->
      <div class="relative z-10">
        <Transition name="fade-up" appear>
          <Card
            v-if="currentPlan"
            class="mb-8 border-white/10 bg-black/40 backdrop-blur-sm shadow-xl shadow-black/40"
          >
            <CardHeader class="flex flex-wrap items-center justify-between gap-6 border-b border-white/10">
              <div>
                <CardTitle class="text-2xl text-white">Plan actual: {{ currentPlan?.name }}</CardTitle>
                <CardDescription class="text-white/60 mt-1">
                  {{ formattedEndDate ? `Renueva el ${formattedEndDate}` : 'Plan sin fecha de expiración' }}
                </CardDescription>
              </div>
              <div class="flex items-center gap-4">
                <div>
                  <p class="text-sm font-semibold text-white/80">Renovación automática</p>
                  <p class="text-xs text-white/45">
                    {{ isPaidPlan ? 'Controla si el plan se renueva al vencer' : 'Disponible solo para planes de pago' }}
                  </p>
                </div>
                <Switch
                  :model-value="autoRenewState"
                  :disabled="autoRenewLoading || !isPaidPlan"
                  @update:modelValue="onToggleAutoRenew"
                  class="scale-110"
                />
              </div>
            </CardHeader>
            <CardContent class="space-y-4 text-white/80">
              <div class="flex flex-wrap items-center justify-center gap-4 px-6 py-3">
                <Badge variant="outline" class="border-white/20 text-white/90">
                  {{ isPaidPlan ? 'Plan de pago' : 'Plan gratuito' }}
                </Badge>
                <Badge
                  v-if="formattedEndDate && daysRemaining !== null"
                  :variant="daysRemaining && daysRemaining > 3 ? 'success' : 'warning'"
                  class="capitalize"
                >
                  {{ daysRemaining === 0 ? 'Vence hoy' : `Quedan ${daysRemaining} días` }}
                </Badge>
                <p class="text-sm text-white/60">
                  {{ (currentPlan?.price || 0) === 0 ? 'Sin costo mensual' : `Valor mensual: $${currentPlan?.price.toLocaleString()} COP` }}
                </p>
              </div>
              
              <!-- Usage Statistics with Progress Bars -->
              <div v-if="usageStats" class="space-y-4 pt-4 border-t border-white/10">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-semibold text-white/90">Uso de Bases de Datos</p>
                    <span class="text-xs text-white/60">
                      {{ usageStats.totalActive }} / {{ displayTotalLimit }} activas
                    </span>
                  </div>
                  <div v-if="usageStats.totalLimit !== null" class="flex items-center gap-2">
                    <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-[#e78a53] to-[#f59a63] rounded-full transition-all duration-500" 
                        :style="{ width: `${Math.min(usageStats.globalPercentage, 100)}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-white/50 font-medium min-w-[3rem] text-right">
                      {{ usageStats.globalPercentage.toFixed(1) }}%
                    </span>
                  </div>
                  <div v-else class="text-xs text-white/50 mt-2">
                    Límite por motor: {{ currentPlan?.maxDatabases || 0 }} bases
                  </div>
                </div>
                
                <!-- Per Engine Usage -->
                <div v-if="usageStats.byEngine.length > 0" class="space-y-2">
                  <p class="text-xs font-semibold text-white/70 uppercase tracking-wider">Por Motor</p>
                  <div 
                    v-for="engine in usageStats.byEngine" 
                    :key="engine.engineId"
                    class="space-y-1"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-white/80 capitalize">{{ engine.engineName }}</span>
                      <span class="text-xs text-white/60">
                        {{ engine.used }} / {{ engine.limit }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-500"
                          :class="engine.percentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : engine.percentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-[#e78a53] to-[#f59a63]'"
                          :style="{ width: `${Math.min(engine.percentage, 100)}%` }"
                        ></div>
                      </div>
                      <span class="text-xs text-white/50 font-medium min-w-[2.5rem] text-right">
                        {{ engine.percentage.toFixed(0) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Transition>

        <div v-if="loadingPlans" class="grid gap-6 md:grid-cols-3">
          <div v-for="index in 3" :key="`plan-skeleton-${index}`" class="h-72 rounded-2xl bg-white/5 animate-pulse border border-white/10"></div>
        </div>
        <div v-else class="grid gap-6 md:grid-cols-3">
          <TransitionGroup name="fade-up" appear>
            <Card
              v-for="(plan, index) in displayPlans"
              :key="plan.slug ?? plan.id ?? index"
              class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300"
              :class="{ 'border-[#e78a53]/50': plan.popular }"
              :style="{ transitionDelay: `${(index + 1) * 100}ms` }"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
              <CardHeader class="relative z-10">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <CardTitle class="text-2xl text-white" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">
                        {{ plan.name }}
                      </CardTitle>
                      <Badge 
                        v-if="plan.popular" 
                        class="bg-gradient-to-r from-[#e78a53] to-[#f59a63] text-white border-0 shadow-lg shadow-[#e78a53]/30 text-xs px-2 py-0.5"
                      >
                        Popular
                      </Badge>
                    </div>
                    <CardDescription class="text-white/60">
                      {{ plan.maxDatabases }} bases por motor
                    </CardDescription>
                  </div>
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30">
                    <Sparkles v-if="plan.slug === 'free'" class="h-5 w-5 text-[#e78a53]" />
                    <Zap v-else-if="plan.slug === 'intermediate'" class="h-5 w-5 text-[#e78a53]" />
                    <Crown v-else class="h-5 w-5 text-[#e78a53]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent class="relative z-10">
                <div class="text-4xl font-bold mb-6 text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);">
                  {{ plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString()}/mes` }}
                </div>
                <ul class="space-y-3 text-sm">
                  <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-white/80">
                    <div class="w-2 h-2 rounded-full bg-[#e78a53] shadow-lg shadow-[#e78a53]/50"></div>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter class="relative z-10">
                <Button 
                  class="w-full font-semibold" 
                  :variant="isPlanActive(plan) ? 'outline' : (canUpgradeToPlan(plan) ? 'primary' : 'outline')"
                  :class="isPlanActive(plan) 
                    ? 'border-white/20 bg-black/40 text-white/70 hover:bg-black/50 hover:border-white/30 cursor-default' 
                    : canUpgradeToPlan(plan)
                      ? 'bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] text-white shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50'
                      : 'border-white/10 bg-black/30 text-white/40 opacity-60 cursor-not-allowed'"
                  @click="upgradeToPlan(plan)"
                  :disabled="isPlanActive(plan) || !canUpgradeToPlan(plan)"
                  :title="isPlanActive(plan) ? 'Este es tu plan actual' : (!canUpgradeToPlan(plan) ? 'No puedes cambiar a un plan inferior' : 'Actualizar a este plan')"
                >
                  {{ isPlanActive(plan) ? 'Plan Actual' : (canUpgradeToPlan(plan) ? 'Actualizar Plan' : 'No disponible') }}
                </Button>
              </CardFooter>
            </Card>
          </TransitionGroup>
        </div>
      </div>

      <!-- Payment Warning Dialog -->
      <AlertDialog
        v-model="showPaymentWarningDialog"
        title="Compatibilidad con el navegador"
        description="Tu navegador tiene configurada la protección de rastreo que puede bloquear recursos necesarios para completar el pago. Esto no es peligroso, simplemente ayuda a las páginas a cargar correctamente."
        confirm-text="Continuar de todos modos"
        cancel-text="Cancelar"
        confirm-variant="primary"
        @confirm="handlePaymentWarningConfirm"
      >
        <div class="space-y-3 text-sm text-white/70 mt-4">
          <p class="font-semibold text-white/90">Para asegurar una experiencia óptima:</p>
          <ul class="space-y-2 list-disc list-inside ml-2">
            <li>Desactiva temporalmente "Tracking Prevention" en Edge (Configuración > Privacidad > Tracking Prevention)</li>
            <li>O usa otro navegador como Chrome/Firefox para el pago</li>
            <li>Asegúrate de que no hay bloqueadores de anuncios activos</li>
          </ul>
          <p class="text-xs text-white/50 mt-4">
            Si prefieres continuar ahora, es posible que algunas partes del proceso de pago no carguen correctamente.
          </p>
        </div>
      </AlertDialog>

      <!-- Payment History with enhanced styling -->
      <Transition name="fade-up" appear :delay="400">
        <Card class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent opacity-50"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
          <CardHeader class="relative z-10 border-b border-white/10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-1 h-8 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
                <div>
                  <CardTitle class="text-2xl text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);">Historial de Pagos</CardTitle>
                  <CardDescription class="text-white/60 mt-1">Registro de todas tus transacciones</CardDescription>
                </div>
              </div>
              <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 shadow-lg shadow-[#e78a53]/20">
                <Receipt class="w-6 h-6 text-[#e78a53]" />
              </div>
            </div>
          </CardHeader>
          <CardContent class="relative z-10 pt-6">
            <div v-if="payments.length === 0" class="text-center py-16">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 border border-[#e78a53]/30 mb-6">
                <Receipt class="h-10 w-10 text-[#e78a53] opacity-70" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-3" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);">No hay pagos registrados</h3>
              <p class="text-white/60 text-lg max-w-md mx-auto">Tu historial de pagos aparecerá aquí cuando realices tu primera transacción</p>
            </div>
            <div v-else class="space-y-3">
              <TransitionGroup name="list" tag="div">
                <div 
                  v-for="(payment, index) in payments" 
                  :key="payment.id" 
                  class="group/item flex items-center justify-between p-5 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40 hover:border-[#e78a53]/30 transition-all duration-300"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <div class="flex items-center gap-4 flex-1">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30">
                      <Receipt class="h-6 w-6 text-[#e78a53]" />
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-white mb-1 text-lg">{{ payment.description }}</p>
                      <p class="text-sm text-white/60 flex items-center gap-2">
                        <span>{{ payment.date }}</span>
                        <span class="text-white/40">•</span>
                        <span>{{ payment.method || 'Mercado Pago' }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="text-right ml-4">
                    <p class="font-bold text-white mb-2 text-xl" style="text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);">{{ payment.amount }}</p>
                    <Badge 
                      :variant="payment.status === 'paid' ? 'success' : 'warning'"
                      class="shadow-lg"
                    >
                      {{ payment.status === 'paid' ? 'Pagado' : 'Pendiente' }}
                    </Badge>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </CardContent>
        </Card>
      </Transition>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { usePlanStore } from '@/stores/plan'
import { useToastStore } from '@/stores/toast'
import { paymentService } from '@/services/payment.service'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Switch from '@/components/ui/Switch.vue'
import AlertDialog from '@/components/ui/AlertDialog.vue'
import { Crown, Sparkles, Zap, Receipt } from 'lucide-vue-next'
import type { Plan, PaymentHistory } from '@/types'
import { storeToRefs } from 'pinia'
import { planService } from '@/services/plan.service'

const planStore = usePlanStore()
const toastStore = useToastStore()
const { currentPlan, plans, loadingPlans } = storeToRefs(planStore)

const usageStats = ref<{
  totalActive: number
  totalLimit: number | null
  globalPercentage: number
  byEngine: Array<{
    engineId: string
    engineName: string
    used: number
    limit: number
    percentage: number
    canCreate: boolean
  }>
} | null>(null)
const loadingUsageStats = ref(false)

const fallbackPlans: Plan[] = [
  { id: 'free', slug: 'free', name: 'Gratis', price: 0, currency: 'COP', maxDatabases: 2, features: ['2 bases por motor', 'Soporte básico'] },
  { id: 'intermediate', slug: 'intermediate', name: 'Intermedio', price: 5000, currency: 'COP', maxDatabases: 5, features: ['5 bases por motor', 'Soporte prioritario'], popular: true },
  { id: 'advanced', slug: 'advanced', name: 'Avanzado', price: 10000, currency: 'COP', maxDatabases: 10, features: ['10 bases por motor', 'Soporte 24/7'] },
]

const displayPlans = computed<Plan[]>(() => {
  // Siempre mostrar todos los planes disponibles
  return plans.value.length > 0 ? plans.value : fallbackPlans
})

const isPaidPlan = computed(() => (currentPlan.value?.price ?? 0) > 0)
const autoRenewState = ref(false)
const autoRenewLoading = ref(false)

const displayTotalLimit = computed(() => {
  if (!usageStats.value || !currentPlan.value) {
    // Fallback si no hay datos
    if (currentPlan.value) {
      const maxPerEngine = currentPlan.value.maxDatabases || 0
      return maxPerEngine > 0 ? `${maxPerEngine} por motor` : '∞'
    }
    return '∞'
  }
  
  // Si hay límite global del backend, usarlo
  if (usageStats.value.totalLimit !== null) {
    return usageStats.value.totalLimit
  }
  
  // Si no hay límite global, significa que el plan tiene límite por motor
  // No es "infinito", es limitado por motor (plan pago)
  const maxPerEngine = currentPlan.value.maxDatabases || 0
  if (maxPerEngine > 0) {
    return `${maxPerEngine} por motor`
  }
  
  // Último fallback
  return '∞'
})

watch(
  currentPlan,
  (plan) => {
    autoRenewState.value = plan?.autoRenewEnabled ?? false
  },
  { immediate: true }
)

const formattedEndDate = computed(() => {
  if (!currentPlan.value?.endDate) return null
  const date = new Date(currentPlan.value.endDate)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
})

const daysRemaining = computed(() => {
  if (!currentPlan.value?.endDate) return null
  const diff = new Date(currentPlan.value.endDate).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
})

async function onToggleAutoRenew(value: boolean) {
  if (!isPaidPlan.value) {
    return
  }
  autoRenewLoading.value = true
  try {
    await planStore.toggleAutoRenew(value)
    toastStore.success('Renovación automática', value ? 'Se activó la renovación automática.' : 'Se desactivó la renovación automática.')
    autoRenewState.value = value
  } catch (error: any) {
    autoRenewState.value = !value
    const message = error?.response?.data?.message || error?.message || 'No se pudo actualizar la renovación automática'
    toastStore.error('Error', message)
  } finally {
    autoRenewLoading.value = false
  }
}

function isPlanActive(plan: Plan): boolean {
  // Si no hay plan actual, ningún plan está activo
  if (!currentPlan.value) {
    return false
  }

  // Comparar por backendId primero (más confiable)
  if (plan.backendId !== undefined && currentPlan.value.backendId !== undefined) {
    return plan.backendId === currentPlan.value.backendId
  }

  // Comparar por slug
  if (plan.slug && currentPlan.value.slug) {
    return plan.slug === currentPlan.value.slug
  }

  // Comparar por id (puede ser string o number)
  if (plan.id && currentPlan.value.id) {
    return String(plan.id) === String(currentPlan.value.id)
  }

  return false
}

function canUpgradeToPlan(plan: Plan): boolean {
  // Si no hay plan actual, puede elegir cualquier plan
  if (!currentPlan.value) {
    return true
  }
  
  // Si el plan es el mismo, no puede "mejorar"
  if (isPlanActive(plan)) {
    return false
  }
  
  const currentPlanPrice = currentPlan.value.price ?? 0
  const planPrice = plan.price ?? 0
  
  // Solo puede cambiar a un plan mejor (precio mayor)
  // No puede empeorar su plan directamente
  return planPrice > currentPlanPrice
}

const payments = ref<PaymentHistory[]>([])
const showPaymentWarningDialog = ref(false)
const pendingPlan = ref<Plan | null>(null)

async function upgradeToPlan(plan: Plan) {
  // Detectar si el navegador NO es Chrome ni Firefox (recomendados)
  const userAgent = navigator.userAgent.toLowerCase()
  const isChrome = userAgent.includes('chrome/') && !userAgent.includes('edg/') && !userAgent.includes('opr/')
  const isFirefox = userAgent.includes('firefox/') || userAgent.includes('fxios/')
  
  // Mostrar advertencia solo si NO es Chrome ni Firefox
  if (!isChrome && !isFirefox) {
    pendingPlan.value = plan
    showPaymentWarningDialog.value = true
    return
  }
  
  // Continuar con el pago directamente si es Chrome o Firefox
  await proceedWithPayment(plan)
}

async function proceedWithPayment(plan: Plan) {
  try {
    const identifier = plan.backendId ?? plan.id
    const preference = await planStore.upgradePlan(identifier)
    const redirectUrl = preference.payment_url || preference.checkout_url || preference.init_point
    if (redirectUrl) {
      window.location.href = redirectUrl
    } else {
      throw new Error('No se recibió una URL de pago')
    }
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'No se pudo procesar la actualización del plan'
    toastStore.error('Error', message)
  } finally {
    showPaymentWarningDialog.value = false
    pendingPlan.value = null
  }
}

async function handlePaymentWarningConfirm() {
  if (pendingPlan.value) {
    await proceedWithPayment(pendingPlan.value)
  }
}

onMounted(async () => {
  // Cargar planes y plan actual en paralelo
  try {
    await Promise.all([
      planStore.fetchPlans(),
      planStore.fetchPlan(), // Asegurar que el plan actual esté actualizado
    ])
  } catch (error) {
    console.error('Error cargando planes:', error)
  }

  // Cancelar pagos pendientes expirados primero (en background)
  try {
    await paymentService.cancelExpiredPendingPayments()
  } catch (error) {
    // No bloquear la carga si falla
    console.warn('No se pudieron cancelar pagos expirados:', error)
  }

  // Cargar historial de pagos y estadísticas de uso en paralelo
  try {
    const [paymentHistory, stats] = await Promise.all([
      paymentService.fetchPaymentHistory().catch(() => []),
      planService.fetchUsageStats().catch(() => null),
    ])
    payments.value = paymentHistory
    usageStats.value = stats
  } catch (error) {
    console.error('Error cargando historial de pagos o estadísticas:', error)
    payments.value = []
  }

  // Verificar si se regresó de un pago (aunque esto debería manejarse en PaymentResultView)
  const params = new URLSearchParams(window.location.search)
  const statusParam = params.get('status') || params.get('collection_status')

  if (statusParam === 'approved') {
    toastStore.success('Plan actualizado', 'Tu plan ha sido actualizado correctamente')
    // Actualizar el plan actual después de un pago exitoso
    try {
      await planStore.fetchPlan()
      // Recargar historial de pagos después de un pago exitoso
      const paymentHistory = await paymentService.fetchPaymentHistory()
      payments.value = paymentHistory
    } catch (error) {
      console.error('Error actualizando plan después del pago:', error)
    }
  } else if (statusParam === 'failure' || statusParam === 'rejected' || statusParam === 'cancelled') {
    toastStore.error('Pago cancelado', 'El pago fue rechazado, cancelado o no se completó. Los pagos pendientes se cancelan automáticamente después de 10 minutos.')
    // Cancelar pagos pendientes expirados cuando se regresa de un pago fallido
    try {
      await paymentService.cancelExpiredPendingPayments()
      // Recargar historial de pagos después de cancelar
      const paymentHistory = await paymentService.fetchPaymentHistory()
      payments.value = paymentHistory
    } catch (error) {
      console.error('Error cancelando pagos pendientes:', error)
    }
  }

  if (statusParam) {
    window.history.replaceState(null, '', window.location.pathname)
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

.list-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}
</style>
