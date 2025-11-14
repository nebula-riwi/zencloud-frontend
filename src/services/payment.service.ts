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

  const description = payment.planName 
    ? `Suscripción ${payment.planName}`
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

export const paymentService = {
  fetchPaymentHistory,
}

