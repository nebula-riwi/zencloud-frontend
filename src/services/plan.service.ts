import apiClient from './api'
import type { Plan, PlanResponse } from '@/types'
import { getUserFromToken } from '@/utils/jwt'

interface CreateSubscriptionRequestBody {
  userId: string
  planId: number
}

interface CreateSubscriptionResponse {
  payment_url: string
  plan_name: string
  amount: number
}

interface PlanWithMetadata extends Plan {
  backendId: number
  slug: string
}

const PLAN_FEATURES: Record<string, string[]> = {
  Free: [
    '2 bases por motor',
    'Soporte básico',
  ],
  Intermediate: [
    '5 bases por motor',
    'Soporte prioritario',
    'Alertas de uso',
  ],
  Advanced: [
    '10 bases por motor',
    'Soporte 24/7',
    'Backups automatizados',
    'Webhooks avanzados',
  ],
  free: [
    '2 bases por motor',
    'Soporte básico',
  ],
  intermediate: [
    '5 bases por motor',
    'Soporte prioritario',
    'Alertas de uso',
  ],
  advanced: [
    '10 bases por motor',
    'Soporte 24/7',
    'Backups automatizados',
    'Webhooks avanzados',
  ],
}

function mapPlanResponse(plan: PlanResponse): PlanWithMetadata {
  const normalizedName = plan.planName ?? ''
  const slug = normalizedName.toLowerCase()
  const planNameMap: Record<string, string> = {
    free: 'Gratis',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  }

  return {
    id: plan.planId,
    backendId: plan.planId,
    slug,
    name: planNameMap[slug] ?? normalizedName,
    price: Number(plan.priceInCOP),
    currency: 'COP',
    maxDatabases: plan.maxDatabasesPerEngine,
    durationInDays: plan.durationInDays,
    features: PLAN_FEATURES[normalizedName] ?? [],
    description: plan.description ?? undefined,
    popular: slug === 'intermediate',
    isActive: plan.isActive,
  }
}

async function fetchPlans(): Promise<PlanWithMetadata[]> {
  const response = await apiClient.get<PlanResponse[]>('/api/Payments/plans')
  return response.data.map(mapPlanResponse)
}

async function createSubscription(planId: number): Promise<CreateSubscriptionResponse> {
  const token = sessionStorage.getItem('Token')
  if (!token) {
    throw new Error('Usuario no autenticado')
  }

  const user = getUserFromToken(token)
  if (!user?.id) {
    throw new Error('No se pudo obtener el usuario desde el token')
  }

  const body: CreateSubscriptionRequestBody = {
    userId: user.id,
    planId,
  }

  const response = await apiClient.post<CreateSubscriptionResponse>('/api/Payments/create', body)
  return response.data
}

async function fetchCurrentSubscription(): Promise<PlanWithMetadata | null> {
  try {
    const response = await apiClient.get<PlanResponse | { message?: string }>('/api/Payments/current-subscription')
    
    // Si la respuesta tiene un mensaje (no hay suscripción activa), devolver null
    if ('message' in response.data && response.data.message) {
      return null
    }
    
    // Si hay datos de plan, mapearlos
    if ('planId' in response.data) {
      return mapPlanResponse(response.data as PlanResponse)
    }
    
    return null
  } catch (error: any) {
    // Si el endpoint no existe (404) o no hay suscripción activa, devolver null
    if (error.response?.status === 404) {
      console.log('Endpoint de suscripción no disponible, usando plan por defecto')
      return null
    }
    // Si hay otro error, registrarlo pero no fallar
    console.error('Error obteniendo suscripción actual:', error)
    return null
  }
}

export const planService = {
  fetchPlans,
  createSubscription,
  fetchCurrentSubscription,
}

