import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Plan, PlanQuota, MercadoPagoPreference } from '@/types'
import { planService } from '@/services/plan.service'

export const usePlanStore = defineStore('plan', () => {
  const currentPlan = ref<Plan | null>(null)
  const plans = ref<Plan[]>([])
  const quotasByEngine = ref<PlanQuota[]>([])
  const loadingPlans = ref(false)

  const plansById = computed(() => {
    const map = new Map<number | string, Plan>()
    plans.value.forEach((plan) => {
      map.set(plan.id, plan)
      if (plan.backendId !== undefined) {
        map.set(plan.backendId, plan)
      }
      if (plan.slug) {
        map.set(plan.slug, plan)
      }
    })
    return map
  })

  async function ensurePlansLoaded() {
    if (plans.value.length > 0) return
    await fetchPlans()
  }

  async function fetchPlans(): Promise<Plan[]> {
    loadingPlans.value = true
    try {
      const fetchedPlans = await planService.fetchPlans()
      plans.value = fetchedPlans

      if (!currentPlan.value) {
        const defaultPlan = fetchedPlans.find((plan) => plan.slug === 'free') ?? fetchedPlans[0] ?? null
        currentPlan.value = defaultPlan ?? null
      }

      return fetchedPlans
    } finally {
      loadingPlans.value = false
    }
  }

  async function fetchPlan(): Promise<Plan> {
    // Asegurar que los planes estén cargados primero
    if (plans.value.length === 0) {
      await fetchPlans()
    }
    
    // Intentar obtener la suscripción actual del usuario
    try {
      const currentSubscription = await planService.fetchCurrentSubscription()
      if (currentSubscription) {
        // Buscar el plan en la lista de planes para asegurar consistencia
        const matchingPlan = plans.value.find(
          (p) => p.backendId === currentSubscription.backendId || 
                 p.slug === currentSubscription.slug ||
                 String(p.id) === String(currentSubscription.id)
        )
        
        if (matchingPlan) {
          // Actualizar el plan actual con el plan de la lista (más completo)
          currentPlan.value = { ...matchingPlan, ...currentSubscription }
        } else {
          // Si no se encuentra en la lista, usar el de la suscripción
          currentPlan.value = currentSubscription
        }
        return currentPlan.value
      }
    } catch (error) {
      console.log('No se pudo obtener la suscripción actual:', error)
    }
    
    // Si no hay suscripción activa, usar el plan gratuito por defecto
    // Solo si realmente no hay suscripción (no si hubo un error)
    if (!currentPlan.value && plans.value.length > 0) {
      const defaultPlan = plans.value.find((plan) => plan.slug === 'free') ?? plans.value[0]
      currentPlan.value = defaultPlan ?? null
    }
    
    if (!currentPlan.value) {
      throw new Error('No hay planes disponibles')
    }
    return currentPlan.value
  }

  async function fetchQuotas(): Promise<PlanQuota[]> {
    // Mock - Backend will be implemented later
    return quotasByEngine.value
  }

  async function upgradePlan(planIdentifier: string | number): Promise<MercadoPagoPreference> {
    await ensurePlansLoaded()

    const plan = plansById.value.get(planIdentifier)
    if (!plan || plan.backendId === undefined) {
      throw new Error('Plan no encontrado')
    }

    const response = await planService.createSubscription(plan.backendId)

    const paymentPreference: MercadoPagoPreference = {
      init_point: response.payment_url,
      checkout_url: response.payment_url,
      payment_url: response.payment_url,
      plan_name: response.plan_name,
      amount: response.amount,
    }

    return paymentPreference
  }

  async function checkCheckoutStatus(_preferenceId: string): Promise<{ status: string; plan?: Plan }> {
    // No hay endpoint dedicado aún, devolver estado desconocido
    return { status: 'unknown' }
  }

  function updateQuota(engine: string, used: number) {
    const quota = quotasByEngine.value.find((q) => q.engine === engine)
    if (quota) {
      quota.used = used
    } else {
      quotasByEngine.value.push({
        engine: engine as any,
        used,
        limit: currentPlan.value?.maxDatabases || 2,
      })
    }
  }

  function getQuotaForEngine(engine: string): PlanQuota | null {
    return quotasByEngine.value.find((q) => q.engine === engine) || null
  }

  function canCreateDatabase(engine: string): boolean {
    const quota = getQuotaForEngine(engine)
    if (!quota) return true
    return quota.used < quota.limit
  }

  return {
    currentPlan,
    quotasByEngine,
    fetchPlan,
    fetchQuotas,
    upgradePlan,
    checkCheckoutStatus,
    updateQuota,
    getQuotaForEngine,
    canCreateDatabase,
    plans,
    loadingPlans,
    fetchPlans,
  }
})

