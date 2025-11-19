import apiClient from './api'
import type { Webhook, WebhookEventType } from '@/types'

export interface CreateWebhookRequest {
  name: string
  url: string
  eventType: WebhookEventType
  active: boolean
}

export interface UpdateWebhookRequest {
  name?: string
  url?: string
  eventType?: WebhookEventType
  active?: boolean
}

export interface WebhookResponse {
  webhookId: string
  name: string
  webhookUrl: string
  eventType: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

const mapEventType = (eventType: string): WebhookEventType => {
  const mapping: Record<string, WebhookEventType> = {
    'AccountCreated': 'account_created',
    'AccountUpdated': 'account_updated',
    'DatabaseCreated': 'database_created',
    'DatabaseDeleted': 'database_deleted',
    'DatabaseStatusChanged': 'database_status_changed',
    'SubscriptionCreated': 'subscription_created',
    'SubscriptionExpired': 'subscription_expired',
    'PaymentReceived': 'payment_received',
    'PaymentFailed': 'payment_failed',
  }
  return mapping[eventType] || 'database_created'
}

const mapEventTypeToBackend = (eventType: WebhookEventType): number => {
  const mapping: Record<WebhookEventType, number> = {
    'account_created': 1,
    'account_updated': 2,
    'database_created': 3,
    'database_deleted': 4,
    'database_status_changed': 5,
    'subscription_created': 6,
    'subscription_expired': 7,
    'payment_received': 8,
    'payment_failed': 9,
  }
  return mapping[eventType] || 3
}

export const webhookService = {
  async fetchWebhooks(): Promise<Webhook[]> {
    const response = await apiClient.get<{ data: WebhookResponse[] }>('/api/Webhooks')
    return response.data.data.map(w => ({
      id: w.webhookId,
      name: w.name,
      url: w.webhookUrl,
      eventType: mapEventType(w.eventType),
      active: w.isActive,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }))
  },

  async createWebhook(data: CreateWebhookRequest): Promise<Webhook> {
    const response = await apiClient.post<{ data: WebhookResponse }>('/api/Webhooks', {
      name: data.name,
      url: data.url,
      eventType: mapEventTypeToBackend(data.eventType) as any,
      active: data.active,
    })
    const w = response.data.data
    return {
      id: w.webhookId,
      name: w.name,
      url: w.webhookUrl,
      eventType: mapEventType(w.eventType),
      active: w.isActive,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }
  },

  async updateWebhook(id: string, data: UpdateWebhookRequest): Promise<Webhook> {
    const response = await apiClient.put<{ data: WebhookResponse }>(`/api/Webhooks/${id}`, {
      name: data.name,
      url: data.url,
      eventType: data.eventType ? (mapEventTypeToBackend(data.eventType) as any) : undefined,
      active: data.active,
    })
    const w = response.data.data
    return {
      id: w.webhookId,
      name: w.name,
      url: w.webhookUrl,
      eventType: mapEventType(w.eventType),
      active: w.isActive,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }
  },

  async deleteWebhook(id: string): Promise<void> {
    await apiClient.delete(`/api/Webhooks/${id}`)
  },

  async toggleWebhook(id: string): Promise<Webhook> {
    // Primero obtener el webhook actual
    const webhooks = await this.fetchWebhooks()
    const webhook = webhooks.find(w => w.id === id)
    if (!webhook) {
      throw new Error('Webhook no encontrado')
    }
    // Actualizar con el estado opuesto
    return await this.updateWebhook(id, { active: !webhook.active })
  },

  async testWebhook(id: string): Promise<void> {
    await apiClient.post(`/api/Webhooks/${id}/test`)
  },
}

