import apiClient from './api'
import { getUserIdFromToken } from '@/utils/jwt'
import type { Database, DatabaseInstanceResponse, CreateDatabaseRequestDto } from '@/types'
import type { DatabaseEngine } from '@/types'

/**
 * Servicio para gestionar bases de datos
 */
export const databaseService = {
  /**
   * Obtiene todas las bases de datos del usuario actual
   * @returns Lista de bases de datos
   */
  async fetchDatabases(): Promise<Database[]> {
    try {
      const token = sessionStorage.getItem('Token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const userId = getUserIdFromToken(token)
      if (!userId) {
        throw new Error('No se pudo obtener el userId del token')
      }

      // Llamar al endpoint del backend
      const response = await apiClient.get<{ data: DatabaseInstanceResponse[] }>(
        `/api/DatabaseInstance/user/${userId}`
      )

      // Mapear las respuestas del backend al formato del frontend
      return response.data.data.map((db) => this.mapDatabaseResponse(db))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al obtener bases de datos'
      throw new Error(errorMessage)
    }
  },

  /**
   * Obtiene una base de datos por su ID
   * @param instanceId - ID de la instancia de base de datos
   * @returns Base de datos
   */
  async getDatabaseById(instanceId: string): Promise<Database> {
    try {
      const response = await apiClient.get<{ data: DatabaseInstanceResponse }>(
        `/api/DatabaseInstance/${instanceId}`
      )

      return this.mapDatabaseResponse(response.data.data)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al obtener base de datos'
      throw new Error(errorMessage)
    }
  },

  /**
   * Crea una nueva base de datos
   * @param engineId - ID del motor de base de datos (Guid)
   * @param databaseName - Nombre opcional para la base de datos
   * @returns Base de datos creada
   */
  async createDatabase(engineId: string, databaseName?: string): Promise<Database> {
    try {
      const token = sessionStorage.getItem('Token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const userId = getUserIdFromToken(token)
      if (!userId) {
        throw new Error('No se pudo obtener el userId del token')
      }

      const request: CreateDatabaseRequestDto = {
        userId,
        engineId,
        databaseName: databaseName || undefined,
      }

      const response = await apiClient.post<{ message: string; data: DatabaseInstanceResponse }>(
        '/api/DatabaseInstance',
        request
      )

      return this.mapDatabaseResponse(response.data.data)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear base de datos'
      throw new Error(errorMessage)
    }
  },

  /**
   * Elimina una base de datos
   * @param instanceId - ID de la instancia de base de datos
   */
  async deleteDatabase(instanceId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/DatabaseInstance/${instanceId}`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar base de datos'
      throw new Error(errorMessage)
    }
  },

  /**
   * Activa una base de datos desactivada
   * @param instanceId - ID de la instancia de base de datos
   * @returns Base de datos actualizada
   */
  async activateDatabase(instanceId: string): Promise<Database> {
    try {
      const response = await apiClient.post<{ message: string; data: DatabaseInstanceResponse }>(
        `/api/DatabaseInstance/${instanceId}/activate`
      )
      return this.mapDatabaseResponse(response.data.data)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al activar base de datos'
      throw new Error(errorMessage)
    }
  },

  /**
   * Desactiva una base de datos activa
   * @param instanceId - ID de la instancia de base de datos
   * @returns Base de datos actualizada
   */
  async deactivateDatabase(instanceId: string): Promise<Database> {
    try {
      const response = await apiClient.post<{ message: string; data: DatabaseInstanceResponse }>(
        `/api/DatabaseInstance/${instanceId}/deactivate`
      )
      return this.mapDatabaseResponse(response.data.data)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al desactivar base de datos'
      throw new Error(errorMessage)
    }
  },

  async exportDatabase(instanceId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/databases/${instanceId}/DatabaseManager/export`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al exportar la base de datos'
      throw new Error(errorMessage)
    }
  },

  /**
   * Mapea la respuesta del backend al formato del frontend
   * @param db - Respuesta del backend
   * @returns Base de datos en formato del frontend
   */
  mapDatabaseResponse(db: DatabaseInstanceResponse): Database {
    // Mapear el estado del backend al formato del frontend
    const statusMap: Record<string, Database['status']> = {
      'Active': 'active',
      'Inactive': 'inactive',
      'Creating': 'creating',
      'Stopped': 'stopped',
      'Error': 'error',
      'Deleting': 'deleting',
    }

    // Mapear el nombre del engine (puede venir como "MySQL", "PostgreSQL", etc.)
    // El backend retorna el nombre como string del enum (ej: "MySQL", "PostgreSQL")
    const engineNameMap: Record<string, DatabaseEngine> = {
      'mysql': 'mysql',
      'MySQL': 'mysql',
      'postgresql': 'postgresql',
      'PostgreSQL': 'postgresql',
      'mongodb': 'mongodb',
      'MongoDB': 'mongodb',
      'redis': 'redis',
      'Redis': 'redis',
      'cassandra': 'cassandra',
      'Cassandra': 'cassandra',
      'sqlserver': 'sqlserver',
      'SQLServer': 'sqlserver',
    }
    
    const engineName = engineNameMap[db.engineName] || db.engineName.toLowerCase() as DatabaseEngine

    // Extraer información de la connection string si está disponible
    let host: string | undefined
    let port: number | undefined
    let username: string | undefined

    if (db.connectionString) {
      // Intentar parsear la connection string para extraer host y port
      // Formato típico: "Server=host;Port=port;User=user;Password=password;Database=database"
      const connParts = db.connectionString.split(';')
      connParts.forEach((part) => {
        const trimmedPart = part.trim()
        if (!trimmedPart) return
        
        const equalIndex = trimmedPart.indexOf('=')
        if (equalIndex === -1) return
        
        const key = trimmedPart.substring(0, equalIndex).trim().toLowerCase()
        const value = trimmedPart.substring(equalIndex + 1).trim()
        
        if (key === 'server' || key === 'host') {
          host = value || host
        }
        if (key === 'port') {
          const parsedPort = parseInt(value || '0', 10)
          if (parsedPort > 0) port = parsedPort
        }
        if (key === 'user' || key === 'user id' || key === 'username') {
          username = value || username
        }
      })
    }

    return {
      id: db.instanceId,
      name: db.databaseName,
      engine: engineName,
      status: statusMap[db.status] || 'active',
      createdAt: db.createdAt,
      host: host || db.serverIpAddress || '168.119.182.243',
      port: port || db.assignedPort || 3306,
      username: username || db.databaseUser || '',
      connectionString: db.connectionString || '',
    }
  },

  /**
   * Rota las credenciales de una base de datos
   * @param instanceId - ID de la instancia de base de datos
   * @returns Base de datos actualizada y nueva contraseña
   */
  async rotateCredentials(instanceId: string): Promise<{ database: Database; password: string }> {
    try {
      interface RotateCredentialsResponse {
        instanceId: string
        databaseName: string
        databaseUser: string
        databasePassword: string
        assignedPort: number
        connectionString: string
        status: string
        engineName: string
        createdAt: string
        serverIpAddress?: string
      }

      const response = await apiClient.post<{ message: string; data: RotateCredentialsResponse }>(
        `/api/DatabaseInstance/${instanceId}/rotate-credentials`
      )

      const dbData = response.data.data
      const database = this.mapDatabaseResponse({
        instanceId: dbData.instanceId,
        databaseName: dbData.databaseName,
        databaseUser: dbData.databaseUser,
        assignedPort: dbData.assignedPort,
        connectionString: dbData.connectionString,
        status: dbData.status,
        engineName: dbData.engineName,
        createdAt: dbData.createdAt,
        serverIpAddress: dbData.serverIpAddress,
      })

      return {
        database,
        password: dbData.databasePassword,
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al rotar credenciales'
      throw new Error(errorMessage)
    }
  },
}

/**
 * Mapeo de nombres de engines a IDs (Guid) tal como están registrados en la BD
 * Si se agregan nuevos engines en el backend, recuerda actualizar este objeto.
 */
export const ENGINE_IDS: Partial<Record<DatabaseEngine, string>> = {
  mysql: '11111111-1111-1111-1111-111111111111',
  postgresql: '22222222-2222-2222-2222-222222222222',
  mongodb: '33333333-3333-3333-3333-333333333333',
  sqlserver: '44444444-4444-4444-4444-444444444444',
  redis: '55555555-5555-5555-5555-555555555555',
  // Cassandra aún no está configurado en la BD del backend. Cuando se agregue,
  // incluye aquí el GUID correspondiente.
}

/**
 * Obtiene el EngineId para un nombre de engine
 * @param engineName - Nombre del engine
 * @returns EngineId (Guid)
 */
export function getEngineId(engineName: DatabaseEngine): string {
  const engineId = ENGINE_IDS[engineName]
  if (!engineId) {
    throw new Error(`Engine ${engineName} no tiene un EngineId configurado. Actualiza ENGINE_IDS en database.service.ts`)
  }
  return engineId
}

