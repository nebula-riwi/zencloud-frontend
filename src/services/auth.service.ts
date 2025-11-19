import apiClient from './api'
import { getUserFromToken } from '@/utils/jwt'
import type { LoginCredentials, RegisterData, AuthResponse, LoginResponse, RegisterResponse } from '@/types'

export const authService = {
  /**
   * Inicia sesión en el backend
   * @param credentials - Credenciales de inicio de sesión
   * @returns Respuesta de autenticación con token y usuario
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Llamar al endpoint de login del backend
      const response = await apiClient.post<LoginResponse>('/api/Auth/login', credentials)
      
      const token = response.data.Token || response.data.token
      if (!token) {
        throw new Error('El backend no retornó un token válido')
      }
      
      // Decodificar el token JWT para obtener información del usuario
      const user = getUserFromToken(token)
      if (!user) {
        throw new Error('No se pudo obtener la información del usuario del token')
      }

      return {
        token,
        user,
      }
    } catch (error: any) {
      // Manejar errores del backend
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión'
      throw new Error(errorMessage)
    }
  },

  /**
   * Registra un nuevo usuario
   * @param data - Datos de registro
   * @returns Mensaje de éxito (el backend no retorna token en registro, necesita verificación de email)
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      // Llamar al endpoint de registro del backend
      const response = await apiClient.post<RegisterResponse>('/api/Auth/register', {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        fullName: data.fullName,
      })
      
      return response.data
    } catch (error: any) {
      // Manejar errores del backend
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar usuario'
      throw new Error(errorMessage)
    }
  },

  /**
   * Cierra sesión y notifica al backend
   */
  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout del backend para disparar el webhook
      await apiClient.post('/api/Auth/logout')
    } catch (error) {
      console.error('Error al llamar al endpoint de logout:', error)
    } finally {
      // Siempre limpiar el storage local
      sessionStorage.removeItem('Token')
      sessionStorage.removeItem('Email')
    }
  },

  /**
   * Verifica el token (intenta hacer una petición autenticada)
   * @returns true si el token es válido, false si no
   */
  async verifyToken(): Promise<{ valid: boolean }> {
    try {
      // Intentar obtener las bases de datos del usuario como verificación
      // Si el token es válido, la petición tendrá éxito
      // Si no, el interceptor manejará el 401
      const token = sessionStorage.getItem('Token')
      if (!token) {
        return { valid: false }
      }

      // Verificar que el token no esté expirado
      const { isTokenExpired } = await import('@/utils/jwt')
      if (isTokenExpired(token)) {
        return { valid: false }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false }
    }
  },

  /**
   * Obtiene el usuario actual desde el token JWT
   * @returns Información del usuario
   */
  async getCurrentUser(): Promise<AuthResponse['user']> {
    const token = sessionStorage.getItem('Token')
    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    const user = getUserFromToken(token)
    if (!user) {
      throw new Error('No se pudo obtener la información del usuario del token')
    }

    return user
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/api/Auth/forgot-password', { email })
  },

  async resetPassword(payload: { email: string; token: string; newPassword: string; confirmPassword: string }): Promise<void> {
    await apiClient.post('/api/Auth/reset-password', {
      email: payload.email,
      token: payload.token,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    })
  },
}

