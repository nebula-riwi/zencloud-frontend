import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
// import { useToastStore } from '@/stores/toast' // Will be used when backend error handling is enabled
import type { ApiError } from '@/types'

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://service.voyager.andrescortes.dev/api'

const TIMEOUT = 30000 // 30 segundos

// Crear instancia de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Contador de reintentos por request
const retryCount = new Map<InternalAxiosRequestConfig, number>()

// Interceptor para agregar token JWT
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores y refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Manejo de errores de red (timeout, no internet, etc.)
    // DISABLED: Backend will be implemented later - Silently fail to avoid infinite error loops
    if (!error.response) {
      // Silently reject - Backend not available yet
      retryCount.delete(originalRequest)
      return Promise.reject(error)
    }

    // Limpiar contador de reintentos en respuestas exitosas (aunque tengan error HTTP)
    retryCount.delete(originalRequest)

    // Manejo de 401 - Token expirado
    // DISABLED: Backend will be implemented later
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true
    //   // ... refresh logic will be enabled when backend is ready
    // }

    // Manejo de otros errores HTTP
    // DISABLED: Backend will be implemented later - Silently fail to avoid infinite error loops
    // Error handling will be enabled when backend is ready
    
    return Promise.reject(error)
  }
)

export default apiClient

