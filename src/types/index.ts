// Tipos globales de la aplicación

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}

// Respuesta del backend para login
export interface LoginResponse {
  token?: string
  Token?: string
}

// Respuesta del backend para register
export interface RegisterResponse {
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
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
  id: string // InstanceId del backend
  name: string // DatabaseName del backend
  engine: DatabaseEngine // EngineName del backend
  status: DatabaseStatus // Status del backend
  createdAt: string
  host?: string
  port?: number // AssignedPort del backend
  username?: string // DatabaseUser del backend
  connectionString?: string // ConnectionString del backend (opcional, para mostrar)
}

// Respuesta del backend para DatabaseInstance
export interface DatabaseInstanceResponse {
  instanceId: string
  databaseName: string
  databaseUser: string
  assignedPort: number
  connectionString: string
  status: string
  engineName: string
  createdAt: string
  serverIpAddress?: string
}

// Request para crear base de datos
export interface CreateDatabaseRequestDto {
  userId: string // Guid como string
  engineId: string // Guid como string
  databaseName?: string // Nombre opcional para la base de datos
}

export type DatabaseEngine = 'mysql' | 'postgresql' | 'mongodb' | 'sqlserver' | 'redis' | 'cassandra'

export type DatabaseStatus = 'active' | 'inactive' | 'creating' | 'stopped' | 'error' | 'deleting'

export interface DatabaseEngineInfo {
  id: string
  name: string
  slug: string
  defaultPort: number
  description?: string
  isActive: boolean
}

export interface Plan {
  id: string | number // PlanId del backend
  name: string // PlanName del backend
  price: number // PriceInCOP del backend
  currency: string
  maxDatabases: number // MaxDatabasesPerEngine del backend
  features: string[]
  popular?: boolean
  durationInDays?: number
  description?: string
  isActive?: boolean
  backendId?: number
  slug?: string
  startDate?: string
  endDate?: string
  autoRenewEnabled?: boolean
}

// Respuesta del backend para Plan
export interface PlanResponse {
  planId: number
  planName: string
  maxDatabasesPerEngine: number
  priceInCOP: number
  durationInDays: number
  description: string
  isActive: boolean
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
  connectionString?: string
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

export type WebhookEventType = 
  | 'account_created'
  | 'account_updated'
  | 'database_created'
  | 'database_deleted'
  | 'database_status_changed'
  | 'subscription_created'
  | 'subscription_expired'
  | 'payment_received'
  | 'payment_failed'

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

export interface QueryHistoryItem {
  id: string
  query: string
  success: boolean
  rowCount?: number
  executionTimeMs?: number
  error?: string
  executedAt: string
  databaseName?: string
  engineType?: string
}

export interface DatabaseTable {
  name: string
  type: string
  rowCount: number
}

export interface SqlResult {
  success: boolean
  data?: any[]
  columns?: string[]
  rows?: any[][]
  error?: string
  errorMessage?: string
  executionTime?: number
  affectedRows?: number
}

// Respuesta del backend para QueryResult
export interface QueryResultResponse {
  success: boolean
  columns: string[]
  rows: any[][]
  executionTime: number
  affectedRows: number
  errorMessage?: string
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
  init_point?: string
  checkout_url?: string
  preference_id?: string
  payment_url?: string // URL de pago del backend
  plan_name?: string
  amount?: number
}

