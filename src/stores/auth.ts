import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthResponse, LoginCredentials, RegisterData } from '@/types'
// import apiClient from '@/services/api' // Backend will be implemented later

// Usar sessionStorage para tokens (más seguro que localStorage)
// y mantener localStorage solo para "remember me" si se implementa
const STORAGE_KEY_TOKEN = 'auth_token'
const STORAGE_KEY_REFRESH = 'auth_refresh_token'
const STORAGE_KEY_USER = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  function setAuth(t: string, rt: string, u: User) {
    token.value = t
    refreshToken.value = rt
    user.value = u
    
    // Usar sessionStorage para mayor seguridad (se borra al cerrar pestaña)
    // El token de acceso es temporal
    sessionStorage.setItem(STORAGE_KEY_TOKEN, t)
    
    // Refresh token en localStorage (persiste entre sesiones)
    localStorage.setItem(STORAGE_KEY_REFRESH, rt)
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u))
  }

  function clearAuth() {
    token.value = null
    refreshToken.value = null
    user.value = null
    
    // Limpiar todos los storages
    sessionStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_REFRESH)
    localStorage.removeItem(STORAGE_KEY_USER)
  }

  function initializeAuth() {
    // Intentar cargar desde sessionStorage primero (sesión activa)
    let storedToken = sessionStorage.getItem(STORAGE_KEY_TOKEN)
    const storedRefresh = localStorage.getItem(STORAGE_KEY_REFRESH)
    const storedUser = localStorage.getItem(STORAGE_KEY_USER)

    // Si no hay token en session pero hay refresh token, intentar refrescar
    if (!storedToken && storedRefresh && storedUser) {
      // El token se refrescará automáticamente en la primera petición
      refreshToken.value = storedRefresh
      user.value = JSON.parse(storedUser)
    } else if (storedToken && storedUser) {
      token.value = storedToken
      refreshToken.value = storedRefresh
      user.value = JSON.parse(storedUser)
    }
  }

  function updateUser(updatedUser: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user.value))
    }
  }

  async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 500))
    const mockUser: User = {
      id: 'mock-user-id',
      email: credentials.email,
      name: credentials.email.split('@')[0],
    }
    const mockResponse: AuthResponse = {
      token: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: mockUser,
    }
    setAuth(mockResponse.token, mockResponse.refreshToken, mockResponse.user)
    return mockResponse
  }

  async function register(data: RegisterData): Promise<AuthResponse> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 500))
    const mockUser: User = {
      id: 'mock-user-id',
      email: data.email,
      name: data.name,
    }
    const mockResponse: AuthResponse = {
      token: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: mockUser,
    }
    setAuth(mockResponse.token, mockResponse.refreshToken, mockResponse.user)
    return mockResponse
  }

  async function refresh(): Promise<AuthResponse> {
    // Mock - Backend will be implemented later
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    const mockResponse: AuthResponse = {
      token: 'mock-new-access-token',
      refreshToken: refreshToken.value,
      user: user.value!,
    }
    setAuth(mockResponse.token, mockResponse.refreshToken, mockResponse.user)
    return mockResponse
  }

  async function fetchMe(): Promise<User> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    if (user.value) {
      return user.value
    }
    const mockUser: User = {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Usuario Mock',
    }
    user.value = mockUser
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser))
    return mockUser
  }

  return {
    token,
    refreshToken,
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
  }
})

