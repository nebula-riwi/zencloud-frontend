import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Database, DatabaseEngine, DatabaseCredentials } from '@/types'
import { databaseService, getEngineId } from '@/services/database.service'

export const useDatabaseStore = defineStore('database', () => {
  const databases = ref<Database[]>([])
  const loading = ref(false)
  const selectedEngine = ref<DatabaseEngine | 'all'>('all')

  async function fetchDatabases(_engine?: DatabaseEngine): Promise<Database[]> {
    loading.value = true
    try {
      const fetchedDatabases = await databaseService.fetchDatabases()
      databases.value = fetchedDatabases
      return fetchedDatabases
    } catch (error: any) {
      console.error('Error fetching databases:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createDatabase(data: { name: string; engine: DatabaseEngine }): Promise<Database> {
    try {
      // Obtener el EngineId del engine seleccionado
      const engineId = getEngineId(data.engine)
      
      // Crear la base de datos en el backend con el nombre proporcionado
      const newDatabase = await databaseService.createDatabase(engineId, data.name || undefined)
      
      // Agregar a la lista local
      databases.value.push(newDatabase)
      
      return newDatabase
    } catch (error: any) {
      console.error('Error creating database:', error)
      throw error
    }
  }

  async function deleteDatabase(id: string): Promise<void> {
    try {
      await databaseService.deleteDatabase(id)
      
      // Remover de la lista local
    databases.value = databases.value.filter((db) => db.id !== id)
    } catch (error: any) {
      console.error('Error deleting database:', error)
      throw error
    }
  }

  async function getCredentials(_id: string): Promise<DatabaseCredentials> {
    try {
      // Obtener la base de datos directamente del backend
      const response = await databaseService.getDatabaseById(_id)
      
      console.log('Response completo del backend:', response)
      
      // Usar los datos directamente del backend con valores por defecto
      let host = response.host || '168.119.182.243' // IP por defecto del servidor
      let port = response.port || 3306
      let username = response.username || ''
      let databaseName = response.name || ''
      
      // Intentar parsear la connection string para obtener más información
      if (response.connectionString) {
        console.log('Parseando connection string:', response.connectionString)
        const connParts = response.connectionString.split(';')
        connParts.forEach((part) => {
          const trimmedPart = part.trim()
          if (!trimmedPart) return
          
          const equalIndex = trimmedPart.indexOf('=')
          if (equalIndex === -1) return
          
          const key = trimmedPart.substring(0, equalIndex).trim().toLowerCase()
          const value = trimmedPart.substring(equalIndex + 1).trim()
          
          console.log(`Parsing: ${key} = ${value}`)
          
          if ((key === 'server' || key === 'host') && value) {
            host = value
          }
          if (key === 'port' && value) {
            const parsedPort = parseInt(value, 10)
            if (!isNaN(parsedPort) && parsedPort > 0) port = parsedPort
          }
          if ((key === 'user' || key === 'user id' || key === 'username' || key === 'uid') && value) {
            username = value
          }
          if ((key === 'database' || key === 'initial catalog' || key === 'db') && value) {
            databaseName = value
          }
        })
      }
      
      // Asegurar que siempre tengamos valores válidos
      // Si después de parsear aún no tenemos valores, usar los del response
      if (!host || host.trim() === '' || host === '168.119.182.243') {
        host = response.host || '168.119.182.243'
      }
      if (!port || port === 0) {
        port = response.port || 3306
      }
      if (!username || username.trim() === '') {
        username = response.username || ''
      }
      if (!databaseName || databaseName.trim() === '') {
        databaseName = response.name || ''
      }
      
      // Validar que tengamos valores mínimos
      if (!host || host.trim() === '') {
        host = '168.119.182.243'
      }
      if (!port || port === 0) {
        port = 3306
      }
      if (!username || username.trim() === '') {
        username = 'N/A'
      }
      if (!databaseName || databaseName.trim() === '') {
        databaseName = 'N/A'
      }
      
      const credentials = {
        host: host.trim(),
        port: port,
        username: username.trim(),
        password: '***La contraseña se envió por correo electrónico***', // El backend no expone la contraseña por seguridad
        database: databaseName.trim(),
        firstView: false,
        connectionString: response.connectionString || '',
      }
      
      console.log('Credenciales finales:', credentials)
      
      return credentials
    } catch (error: any) {
      console.error('Error getting credentials:', error)
      console.error('Error stack:', error.stack)
      throw error
    }
  }

  async function rotateCredentials(id: string): Promise<DatabaseCredentials> {
    // El backend no tiene endpoint para rotar credenciales aún
    // Por ahora, retornamos las credenciales actuales
    // TODO: Implementar cuando el backend tenga este endpoint
    return await getCredentials(id)
  }

  function getDatabasesByEngine(engine: DatabaseEngine | 'all'): Database[] {
    if (engine === 'all') return databases.value
    return databases.value.filter((db) => db.engine === engine)
  }

  return {
    databases,
    loading,
    selectedEngine,
    fetchDatabases,
    createDatabase,
    deleteDatabase,
    getCredentials,
    rotateCredentials,
    getDatabasesByEngine,
  }
})

