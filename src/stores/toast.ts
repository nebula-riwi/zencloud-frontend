import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast, ToastType } from '@/types'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function addToast(type: ToastType, title: string, message?: string, duration = 5000) {
    const id = `${Date.now()}-${Math.random()}`
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration,
    }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(title: string, message?: string, duration?: number) {
    return addToast('success', title, message, duration)
  }

  function error(title: string, message?: string, duration?: number) {
    return addToast('error', title, message, duration)
  }

  function warning(title: string, message?: string, duration?: number) {
    return addToast('warning', title, message, duration)
  }

  function info(title: string, message?: string, duration?: number) {
    return addToast('info', title, message, duration)
  }

  function clear() {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear,
  }
})

