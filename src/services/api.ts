import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'
import { useToastStore } from '@/stores/toast'

let toastStoreInstance: ReturnType<typeof useToastStore> | null = null

function getToastStore() {
  if (typeof window === 'undefined') return null
  if (!toastStoreInstance) {
    try {
      toastStoreInstance = useToastStore()
    } catch (error) {
      console.warn('Pinia no está disponible para useToastStore todavía', error)
      return null
    }
  }
  return toastStoreInstance
}

// Constantes para las claves de storage (deben coincidir con auth.ts)
const STORAGE_KEY_TOKEN = 'Token'

// Configuración de la URL del API
// Usa VITE_API_BASE_URL si está definida. Si no:
// - Por defecto apunta al backend desplegado.
// - Para forzar el backend local, establece VITE_USE_LOCAL_API=true
const DEFAULT_REMOTE_API = 'https://service.nebula.andrescortes.dev'
const DEFAULT_LOCAL_API = 'http://localhost:5089'

const shouldUseLocalApi = import.meta.env.VITE_USE_LOCAL_API === 'true'

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (shouldUseLocalApi ? DEFAULT_LOCAL_API : DEFAULT_REMOTE_API)

const TIMEOUT = 60000 // 60 segundos (aumentado para operaciones de creación de BD)

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
    // Leer token directamente de sessionStorage (más confiable en interceptores)
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem(STORAGE_KEY_TOKEN)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
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
      retryCount.delete(originalRequest)
      console.error('Network error:', error.message)
      const toast = getToastStore()
      toast?.error('Error de red', 'No se pudo conectar con el servidor. Inténtalo nuevamente en unos segundos.')
      return Promise.reject(error)
    }

    // Limpiar contador de reintentos
    retryCount.delete(originalRequest)

    // Manejo de 401 - Token expirado o inválido
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Limpiar tokens de storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY_TOKEN)
        localStorage.removeItem('auth_refresh_token')
        localStorage.removeItem('auth_user')
        
        // Redirigir a login si no estamos ya ahí
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }
      
      return Promise.reject(error)
    }

    // Manejo de otros errores HTTP
    const status = error.response?.status
    const errorData = error.response?.data as ApiError
    const errorMessage = errorData?.message || error.message || 'An error occurred'
    
    if (status && status >= 500) {
      console.error('Server error:', status, errorMessage)
    const toast = getToastStore()
    toast?.error('Error del servidor', 'Ocurrió un problema interno. Inténtalo más tarde.')
    } else if (status === 422) {
      // Errores de validación - mostrar el primer error o el mensaje general
      console.warn('Validation error:', status, errorData)
      const toast = getToastStore()
      
      // Si hay errores de campos específicos, mostrar el primero
      if (errorData?.errors && Object.keys(errorData.errors).length > 0) {
        const firstField = Object.keys(errorData.errors)[0]
        const firstError = errorData.errors[firstField]?.[0] || errorMessage
        toast?.warning('Error de validación', firstError)
      } else {
        toast?.warning('Error de validación', errorMessage)
      }
    } else if (status && status >= 400) {
      console.warn('Client error:', status, errorMessage)
      // No mostrar toast aquí, dejar que cada servicio maneje su propio error
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

