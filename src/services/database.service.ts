import apiClient from './api'
import { getUserIdFromToken } from '@/utils/jwt'
import type { Database, DatabaseInstanceResponse, CreateDatabaseRequestDto, DatabaseEngine, DatabaseEngineInfo } from '@/types'

const SUPPORTED_ENGINES: DatabaseEngine[] = ['mysql', 'postgresql', 'mongodb', 'sqlserver', 'redis', 'cassandra']
let engineIdCache: Partial<Record<DatabaseEngine, string>> = {}
let fetchEnginesPromise: Promise<DatabaseEngineInfo[]> | null = null
let engineListCache: DatabaseEngineInfo[] = []

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
   * @param engineName - Motor seleccionado
   * @param databaseName - Nombre opcional para la base de datos
   * @returns Base de datos creada
   */
  async createDatabase(engineName: DatabaseEngine, databaseName?: string): Promise<Database> {
    try {
      const token = sessionStorage.getItem('Token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const userId = getUserIdFromToken(token)
      if (!userId) {
        throw new Error('No se pudo obtener el userId del token')
      }

      const engineId = await resolveEngineId(engineName)

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
      // Preservar toda la información del error del backend
      const backendError = error.response?.data || {}
      const errorMessage = backendError.message || error.message || 'Error al crear base de datos'
      
      // Crear un error extendido que preserve la información del backend
      const extendedError: any = new Error(errorMessage)
      extendedError.response = {
        ...error.response,
        data: {
          ...backendError,
          message: errorMessage,
          errorCode: backendError.errorCode || 'UNKNOWN_ERROR',
          details: backendError.details || backendError.errors,
        }
      }
      
      throw extendedError
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

  async fetchEngines(): Promise<DatabaseEngineInfo[]> {
    return await loadEngineCatalog()
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
      port: port || db.assignedPort || (engineName === 'mysql' ? 3307 : (engineName === 'postgresql' ? 5433 : 3307)),
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
async function loadEngineCatalog(): Promise<DatabaseEngineInfo[]> {
  if (engineListCache.length > 0 && !fetchEnginesPromise) {
    return engineListCache
  }

  if (!fetchEnginesPromise) {
    fetchEnginesPromise = fetchEnginesFromApi().finally(() => {
      fetchEnginesPromise = null
    })
  }

  engineListCache = await fetchEnginesPromise
  return engineListCache
}

async function fetchEnginesFromApi(): Promise<DatabaseEngineInfo[]> {
  const response = await apiClient.get<{ data: Array<{
    id: string
    name: string
    slug?: string
    defaultPort: number
    description?: string
    isActive: boolean
  }> }>('/api/DatabaseInstance/engines')

  const engines: DatabaseEngineInfo[] = response.data.data.map((engine) => {
    const slug = normalizeEngineSlug(engine.slug || engine.name)
    return {
      id: engine.id,
      name: engine.name,
      slug: slug ?? (engine.slug || engine.name).toLowerCase(),
      defaultPort: engine.defaultPort,
      description: engine.description,
      isActive: engine.isActive,
    }
  })

  cacheEngineIds(engines)
  engineListCache = engines
  return engines
}

function cacheEngineIds(engines: DatabaseEngineInfo[]) {
  engines.forEach((engine) => {
    const normalized = normalizeEngineSlug(engine.slug)
    if (normalized) {
      engineIdCache[normalized] = engine.id
    }
  })
}

function normalizeEngineSlug(slug?: string | DatabaseEngine): DatabaseEngine | null {
  if (!slug) return null
  const normalized = slug.toString().toLowerCase() as DatabaseEngine
  return SUPPORTED_ENGINES.includes(normalized) ? normalized : null
}

async function resolveEngineId(engineName: DatabaseEngine): Promise<string> {
  if (!engineIdCache[engineName]) {
    await loadEngineCatalog()
  }

  const engineId = engineIdCache[engineName]
  if (!engineId) {
    throw new Error(`No se encontró un EngineId para el motor ${engineName}.`)
  }
  return engineId
}

