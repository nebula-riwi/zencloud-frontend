import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Webhook, WebhookEventType } from '@/types'
import { webhookService } from '@/services/webhook.service'

export const useWebhookStore = defineStore('webhook', () => {
  const webhooks = ref<Webhook[]>([])
  const loading = ref(false)

  async function fetchWebhooks(): Promise<Webhook[]> {
    loading.value = true
    try {
      const data = await webhookService.fetchWebhooks()
      webhooks.value = data
      return data
    } catch (error) {
      console.error('Error fetching webhooks:', error)
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
    const webhook = await webhookService.createWebhook(data)
    await fetchWebhooks()
    return webhook
  }

  async function updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook> {
    const webhook = await webhookService.updateWebhook(id, {
      name: data.name,
      url: data.url,
      eventType: data.eventType,
      active: data.active,
    })
    await fetchWebhooks()
    return webhook
  }

  async function toggleWebhook(id: string): Promise<Webhook> {
    const webhook = await webhookService.toggleWebhook(id)
    await fetchWebhooks()
    return webhook
  }

  async function deleteWebhook(id: string): Promise<void> {
    await webhookService.deleteWebhook(id)
    await fetchWebhooks()
  }

  return {
    webhooks,
    loading,
    fetchWebhooks,
    createWebhook,
    updateWebhook,
    toggleWebhook,
    deleteWebhook,
  }
})

