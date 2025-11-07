import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserPreferences } from '@/types'
// import apiClient from '@/services/api' // Backend will be implemented later

export const useUserPrefsStore = defineStore('userPrefs', () => {
  const preferences = ref<UserPreferences>({
    emailNotifications: true,
  })

  async function fetchPrefs(): Promise<UserPreferences> {
    // Mock data - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    return preferences.value
  }

  async function updatePrefs(data: Partial<UserPreferences>): Promise<UserPreferences> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    preferences.value = { ...preferences.value, ...data }
    return preferences.value
  }

  return {
    preferences,
    fetchPrefs,
    updatePrefs,
  }
})

