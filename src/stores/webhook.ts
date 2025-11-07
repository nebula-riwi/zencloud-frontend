import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Webhook, WebhookEventType, WebhookTestResult } from '@/types'
import apiClient from '@/services/api'

export const useWebhookStore = defineStore('webhook', () => {
  const webhooks = ref<Webhook[]>([])
  const loading = ref(false)

  async function fetchWebhooks(): Promise<Webhook[]> {
    loading.value = true
    try {
      // Mock data - Backend will be implemented later
      await new Promise(resolve => setTimeout(resolve, 300))
      webhooks.value = []
      return []
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
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    const mockWebhook: Webhook = {
      id: `mock-${Date.now()}`,
      name: data.name,
      url: data.url,
      eventType: data.eventType,
      active: data.active,
      createdAt: new Date().toISOString(),
    }
    webhooks.value.push(mockWebhook)
    return mockWebhook
  }

  async function updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = webhooks.value.findIndex((w) => w.id === id)
    if (index !== -1) {
      webhooks.value[index] = { ...webhooks.value[index], ...data }
      return webhooks.value[index]
    }
    throw new Error('Webhook not found')
  }

  async function toggleWebhook(id: string): Promise<Webhook> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = webhooks.value.findIndex((w) => w.id === id)
    if (index !== -1) {
      webhooks.value[index].active = !webhooks.value[index].active
      return webhooks.value[index]
    }
    throw new Error('Webhook not found')
  }

  async function deleteWebhook(id: string): Promise<void> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    webhooks.value = webhooks.value.filter((w) => w.id !== id)
  }

  async function testWebhook(id: string): Promise<WebhookTestResult> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
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

