import apiClient from './api'
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken })
    return response.data
  },

  async verifyToken(): Promise<{ valid: boolean }> {
    const response = await apiClient.get<{ valid: boolean }>('/auth/verify')
    return response.data
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await apiClient.get<AuthResponse['user']>('/auth/me')
    return response.data
  },
}

