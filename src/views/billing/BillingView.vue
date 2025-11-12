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
                  :variant="isPlanActive(plan) ? 'outline' : 'primary'"
                  :class="isPlanActive(plan) 
                    ? 'border-white/20 bg-black/40 text-white/70 hover:bg-black/50 hover:border-white/30' 
                    : 'bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] text-white shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50'"
                  @click="upgradeToPlan(plan)"
                  :disabled="isPlanActive(plan)"
                >
                  {{ isPlanActive(plan) ? 'Plan Actual' : 'Actualizar Plan' }}
                </Button>
              </CardFooter>
            </Card>
          </TransitionGroup>
        </div>
      </div>

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
import { ref, onMounted, computed } from 'vue'
import { usePlanStore } from '@/stores/plan'
import { useToastStore } from '@/stores/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { Crown, Sparkles, Zap, Receipt } from 'lucide-vue-next'
import type { Plan, PaymentHistory } from '@/types'
import { storeToRefs } from 'pinia'

const planStore = usePlanStore()
const toastStore = useToastStore()
const { currentPlan, plans, loadingPlans } = storeToRefs(planStore)

const fallbackPlans: Plan[] = [
  { id: 'free', slug: 'free', name: 'Gratis', price: 0, currency: 'COP', maxDatabases: 2, features: ['2 bases por motor', 'Soporte básico'] },
  { id: 'intermediate', slug: 'intermediate', name: 'Intermedio', price: 5000, currency: 'COP', maxDatabases: 5, features: ['5 bases por motor', 'Soporte prioritario'], popular: true },
  { id: 'advanced', slug: 'advanced', name: 'Avanzado', price: 10000, currency: 'COP', maxDatabases: 10, features: ['10 bases por motor', 'Soporte 24/7'] },
]

const displayPlans = computed<Plan[]>(() => {
  if (plans.value.length > 0) return plans.value
  return fallbackPlans
})

const activePlanInfo = computed(() => ({
  backendId: currentPlan.value?.backendId,
  slug: currentPlan.value?.slug,
  id: currentPlan.value?.id,
}))

function isPlanActive(plan: Plan): boolean {
  if (plan.backendId !== undefined && activePlanInfo.value.backendId !== undefined) {
    return plan.backendId === activePlanInfo.value.backendId
  }

  if (plan.slug && activePlanInfo.value.slug) {
    return plan.slug === activePlanInfo.value.slug
  }

  if (plan.id && activePlanInfo.value.id) {
    return plan.id === activePlanInfo.value.id
  }

  // Si todavía no tenemos información del backend, asumimos que el plan gratuito es el activo por defecto
  return plan.slug === 'free'
}

const payments = ref<PaymentHistory[]>([])

async function upgradeToPlan(plan: Plan) {
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
  }
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const statusParam = params.get('status') || params.get('collection_status')

  if (statusParam === 'approved') {
    toastStore.success('Plan actualizado', 'Tu plan ha sido actualizado correctamente')
  } else if (statusParam === 'failure' || statusParam === 'rejected') {
    toastStore.error('Pago rechazado', 'El pago fue rechazado o cancelado')
  }

  if (statusParam) {
    window.history.replaceState(null, '', window.location.pathname)
  }

  try {
    await planStore.fetchPlans()
  } catch (error) {
    console.error('No se pudieron cargar los planes desde el backend')
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
