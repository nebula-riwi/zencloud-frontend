import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'https://service.voyager.andrescortes.dev/api'

// Configuración de retry
const MAX_RETRIES = 3
const RETRY_DELAY = 1000
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
    if (!error.response) {
      const toastStore = useToastStore()
      
      if (error.code === 'ECONNABORTED') {
        toastStore.error('Tiempo de espera agotado', 'La solicitud tardó demasiado. Por favor, intenta nuevamente.')
      } else if (error.message === 'Network Error') {
        toastStore.error('Error de conexión', 'Verifica tu conexión a internet.')
      }

      // Retry logic para errores de red
      const currentRetries = retryCount.get(originalRequest) || 0
      if (currentRetries < MAX_RETRIES) {
        retryCount.set(originalRequest, currentRetries + 1)
        
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (currentRetries + 1)))
        
        return apiClient(originalRequest)
      }
      
      retryCount.delete(originalRequest)
      return Promise.reject(error)
    }

    // Limpiar contador de reintentos en respuestas exitosas (aunque tengan error HTTP)
    retryCount.delete(originalRequest)

    // Manejo de 401 - Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const authStore = useAuthStore()
      if (authStore.refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: authStore.refreshToken,
          })

          const { token, refreshToken } = response.data
          authStore.setAuth(token, refreshToken, authStore.user!)

          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          authStore.clearAuth()
          const toastStore = useToastStore()
          toastStore.error('Sesión expirada', 'Por favor, inicia sesión nuevamente.')
          
          // Redirigir al login después de un breve delay
          setTimeout(() => {
            window.location.href = '/auth/login'
          }, 1500)
          
          return Promise.reject(refreshError)
        }
      } else {
        // No hay refresh token, limpiar auth y redirigir
        const authStore = useAuthStore()
        authStore.clearAuth()
        window.location.href = '/auth/login'
      }
    }

    // Manejo de otros errores HTTP
    const toastStore = useToastStore()
    const status = error.response?.status
    
    if (status === 403) {
      toastStore.error('Acceso denegado', 'No tienes permisos para realizar esta acción.')
    } else if (status === 404) {
      toastStore.error('No encontrado', 'El recurso solicitado no existe.')
    } else if (status === 429) {
      toastStore.error('Demasiadas solicitudes', 'Por favor, espera un momento antes de intentar nuevamente.')
    } else if (status && status >= 500) {
      toastStore.error('Error del servidor', 'Ocurrió un error en el servidor. Por favor, intenta más tarde.')
    }

    return Promise.reject(error)
  }
)

export default apiClient

