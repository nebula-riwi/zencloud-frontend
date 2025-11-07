// import apiClient from './api' // Backend will be implemented later
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    // return response.data
    
    // Temporary: Use store login function which accepts any credentials
    const authStore = useAuthStore()
    return await authStore.login(credentials)
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.post<AuthResponse>('/auth/register', data)
    // return response.data
    
    // Temporary: Use store register function which accepts any credentials
    const authStore = useAuthStore()
    return await authStore.register(data)
  },

  async logout(): Promise<void> {
    // TODO: Replace with actual API call when backend is ready
    // await apiClient.post('/auth/logout')
    
    // Temporary: Just clear local auth
    const authStore = useAuthStore()
    authStore.clearAuth()
  },

  async refreshToken(_refreshToken: string): Promise<AuthResponse> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken })
    // return response.data
    
    // Temporary: Use store refresh function
    const authStore = useAuthStore()
    return await authStore.refresh()
  },

  async verifyToken(): Promise<{ valid: boolean }> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<{ valid: boolean }>('/auth/verify')
    // return response.data
    
    // Temporary: Check if user is authenticated
    const authStore = useAuthStore()
    return { valid: authStore.isAuthenticated }
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<AuthResponse['user']>('/auth/me')
    // return response.data
    
    // Temporary: Use store fetchMe function
    const authStore = useAuthStore()
    return await authStore.fetchMe()
  },
}

