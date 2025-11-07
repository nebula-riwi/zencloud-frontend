import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Plan, PlanQuota, MercadoPagoPreference } from '@/types'
// import apiClient from '@/services/api' // Backend will be implemented later

export const usePlanStore = defineStore('plan', () => {
  const currentPlan = ref<Plan | null>(null)
  const quotasByEngine = ref<PlanQuota[]>([])

  async function fetchPlan(): Promise<Plan> {
    // Mock data - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    const mockPlan: Plan = {
      id: 'free',
      name: 'Gratis',
      price: 0,
      currency: 'COP',
      maxDatabases: 2,
      features: ['2 bases por motor', 'Soporte básico'],
    }
    currentPlan.value = mockPlan
    return mockPlan
  }

  async function fetchQuotas(): Promise<PlanQuota[]> {
    // Mock - Backend will be implemented later
    return quotasByEngine.value
  }

  async function upgradePlan(_planId: string): Promise<MercadoPagoPreference> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      init_point: 'https://sandbox.mercadopago.com/checkout/v1/redirect?pref_id=mock',
      checkout_url: 'https://sandbox.mercadopago.com/checkout/v1/redirect?pref_id=mock',
      preference_id: 'mock-preference-id',
    }
  }

  async function checkCheckoutStatus(_preferenceId: string): Promise<{ status: string; plan?: Plan }> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    return { status: 'approved' }
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
  }
})

