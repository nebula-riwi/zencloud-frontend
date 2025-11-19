import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthResponse, LoginCredentials, RegisterData } from '@/types'
import { authService } from '@/services/auth.service'
import { getUserFromToken, isTokenExpired } from '@/utils/jwt'

const STORAGE_KEY_TOKEN = 'Token'
const STORAGE_KEY_EMAIL = 'Email'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  function setAuth(t: string, _rt: string, u: User) {
    token.value = t
    user.value = u
    sessionStorage.setItem(STORAGE_KEY_TOKEN, t)
    sessionStorage.setItem(STORAGE_KEY_EMAIL, u.email)
  }

  function clearAuth() {
    token.value = null
    user.value = null
    sessionStorage.removeItem(STORAGE_KEY_TOKEN)
    sessionStorage.removeItem(STORAGE_KEY_EMAIL)
  }

  function initializeAuth() {
    const storedToken = sessionStorage.getItem(STORAGE_KEY_TOKEN)
    const storedEmail = sessionStorage.getItem(STORAGE_KEY_EMAIL)

    if (storedToken && storedEmail) {
      if (!isTokenExpired(storedToken)) {
        token.value = storedToken
        const userFromToken = getUserFromToken(storedToken)
        if (userFromToken) {
          user.value = userFromToken
          sessionStorage.setItem(STORAGE_KEY_EMAIL, userFromToken.email)
        }
      } else {
        clearAuth()
      }
    }
  }

  function updateUser(updatedUser: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
      if (user.value.email) {
        sessionStorage.setItem(STORAGE_KEY_EMAIL, user.value.email)
      }
    }
  }

  async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authService.login(credentials)
    setAuth(response.token, '', response.user)
    return response
  }

  async function register(data: RegisterData): Promise<void> {
    await authService.register(data)
  }

  async function refresh(): Promise<AuthResponse> {
    throw new Error('Refresh token no disponible. Por favor inicia sesión nuevamente.')
  }

  async function fetchMe(): Promise<User> {
    if (token.value) {
      const userFromToken = getUserFromToken(token.value)
      if (userFromToken) {
        user.value = userFromToken
        sessionStorage.setItem(STORAGE_KEY_EMAIL, userFromToken.email)
        return userFromToken
      }
    }

    const userData = await authService.getCurrentUser()
    user.value = userData
    sessionStorage.setItem(STORAGE_KEY_EMAIL, userData.email)
    return userData
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Error en logout del backend:', error)
    } finally {
      clearAuth()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
    initializeAuth,
    updateUser,
    login,
    register,
    refresh,
    fetchMe,
    logout,
  }
})

