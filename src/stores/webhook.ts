import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Webhook, WebhookEventType, WebhookTestResult } from '@/types'

const STORAGE_KEY = 'zencloud_webhooks'

function loadPersistedWebhooks(): Webhook[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Webhook[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (error) {
    console.error('Error leyendo webhooks almacenados:', error)
    return []
  }
}

function persistWebhooks(webhooks: Webhook[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(webhooks))
  } catch (error) {
    console.error('Error guardando webhooks:', error)
  }
}

export const useWebhookStore = defineStore('webhook', () => {
  const webhooks = ref<Webhook[]>([])
  const loading = ref(false)

  async function fetchWebhooks(): Promise<Webhook[]> {
    loading.value = true
    try {
      const stored = loadPersistedWebhooks()
      webhooks.value = stored
      return stored
    } finally {
      loading.value = false
    }
  }

  async function createWebhook(data: {
    name: string
    url: string
    eventType: WebhookEventType
    active: boolean
  }): Promise<Webhook> {
    const mockWebhook: Webhook = {
      id: `mock-${Date.now()}`,
      name: data.name,
      url: data.url,
      eventType: data.eventType,
      active: data.active,
      createdAt: new Date().toISOString(),
    }
    webhooks.value.push(mockWebhook)
    persistWebhooks(webhooks.value)
    return mockWebhook
  }

  async function updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook> {
    const index = webhooks.value.findIndex((w) => w.id === id)
    if (index !== -1) {
      webhooks.value[index] = {
        ...webhooks.value[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      persistWebhooks(webhooks.value)
      return webhooks.value[index]
    }
    throw new Error('Webhook not found')
  }

  async function toggleWebhook(id: string): Promise<Webhook> {
    const index = webhooks.value.findIndex((w) => w.id === id)
    if (index !== -1) {
      webhooks.value[index].active = !webhooks.value[index].active
      webhooks.value[index].updatedAt = new Date().toISOString()
      persistWebhooks(webhooks.value)
      return webhooks.value[index]
    }
    throw new Error('Webhook not found')
  }

  async function deleteWebhook(id: string): Promise<void> {
    webhooks.value = webhooks.value.filter((w) => w.id !== id)
    persistWebhooks(webhooks.value)
  }

  async function testWebhook(_id: string): Promise<WebhookTestResult> {
    return {
      success: true,
      message: 'Webhook test successful (mock)',
      statusCode: 200,
    }
  }

  return {
    webhooks,
    loading,
    fetchWebhooks,
    createWebhook,
    updateWebhook,
    toggleWebhook,
    deleteWebhook,
    testWebhook,
  }
})

