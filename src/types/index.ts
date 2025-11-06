// Tipos globales de la aplicación

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}

export interface Database {
  id: string
  name: string
  engine: DatabaseEngine
  status: DatabaseStatus
  createdAt: string
  host?: string
  port?: number
  username?: string
}

export type DatabaseEngine = 'mysql' | 'postgresql' | 'mongodb' | 'sqlserver' | 'redis' | 'cassandra'

export type DatabaseStatus = 'active' | 'creating' | 'stopped' | 'error' | 'deleting'

export interface Plan {
  id: string
  name: string
  price: number
  currency: string
  maxDatabases: number
  features: string[]
  popular?: boolean
}

