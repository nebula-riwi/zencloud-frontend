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
  lastName?: string
  acceptTerms?: boolean
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

export interface PlanQuota {
  engine: DatabaseEngine
  used: number
  limit: number
}

export interface DatabaseCredentials {
  host: string
  port: number
  username: string
  password: string
  database: string
  firstView: boolean
}

export interface Webhook {
  id: string
  name: string
  url: string
  eventType: WebhookEventType
  active: boolean
  createdAt: string
  updatedAt?: string
}

export type WebhookEventType = 'database_created' | 'account_created' | 'production_error'

export interface WebhookTestResult {
  success: boolean
  message: string
  statusCode?: number
}

export interface SqlQuery {
  dbId: string
  engine: DatabaseEngine
  query: string
}

export interface SqlResult {
  success: boolean
  data?: any[]
  error?: string
  executionTime?: number
  affectedRows?: number
}

export interface UserPreferences {
  emailNotifications: boolean
}

export interface PaymentHistory {
  id: string
  description: string
  amount: string
  currency: string
  status: 'paid' | 'pending' | 'failed'
  date: string
  method?: string
}

export interface MercadoPagoPreference {
  init_point: string
  checkout_url: string
  preference_id: string
}

