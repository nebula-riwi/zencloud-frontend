import apiClient from './api'
import type { PaymentHistory } from '@/types'

interface PaymentHistoryResponseDto {
  paymentId: string
  amount: number
  currency: string
  status: string
  paymentMethod?: string
  transactionDate: string
  createdAt: string
  mercadoPagoPaymentId?: string
  planName?: string
  subscriptionId?: string
}

interface PaymentHistoryApiResponse {
  data: PaymentHistoryResponseDto[]
}

function mapPaymentResponse(payment: PaymentHistoryResponseDto): PaymentHistory {
  const statusMap: Record<string, 'paid' | 'pending' | 'failed'> = {
    'Approved': 'paid',
    'Pending': 'pending',
    'Rejected': 'failed',
  }

  const date = new Date(payment.transactionDate || payment.createdAt)
  const formattedDate = date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Mapear nombre del plan a español
  const planNameMap: Record<string, string> = {
    'Free': 'Gratis',
    'free': 'Gratis',
    'Intermediate': 'Intermedio',
    'intermediate': 'Intermedio',
    'Advanced': 'Avanzado',
    'advanced': 'Avanzado',
  }
  
  const planNameInSpanish = payment.planName 
    ? planNameMap[payment.planName] || payment.planName
    : null
  
  const description = planNameInSpanish 
    ? `Suscripción ${planNameInSpanish}`
    : 'Pago de suscripción'

  return {
    id: payment.paymentId,
    description,
    amount: `$${payment.amount.toLocaleString('es-CO')} ${payment.currency}`,
    currency: payment.currency,
    status: statusMap[payment.status] || 'pending',
    date: formattedDate,
    method: payment.paymentMethod || 'Mercado Pago',
  }
}

async function fetchPaymentHistory(): Promise<PaymentHistory[]> {
  try {
    const response = await apiClient.get<PaymentHistoryApiResponse>('/api/Payments/history')
    return response.data.data.map(mapPaymentResponse)
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.status === 401) {
      return []
    }
    console.error('Error obteniendo historial de pagos:', error)
    return []
  }
}

async function cancelExpiredPendingPayments(): Promise<{ message: string; cancelled: number }> {
  try {
    const response = await apiClient.post<{ message: string; cancelled: number }>('/api/Payments/cancel-expired-pending')
    return response.data
  } catch (error: any) {
    console.error('Error cancelando pagos pendientes expirados:', error)
    return { message: 'No se pudieron cancelar los pagos expirados', cancelled: 0 }
  }
}

export const paymentService = {
  fetchPaymentHistory,
  cancelExpiredPendingPayments,
}

