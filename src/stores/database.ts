import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Database, DatabaseEngine, DatabaseCredentials, DatabaseEngineInfo } from '@/types'
import { databaseService } from '@/services/database.service'

export const useDatabaseStore = defineStore('database', () => {
  const databases = ref<Database[]>([])
  const loading = ref(false)
  const availableEngines = ref<DatabaseEngineInfo[]>([])
  const selectedEngine = ref<DatabaseEngine | 'all'>('all')

  async function fetchDatabases(_engine?: DatabaseEngine): Promise<Database[]> {
    loading.value = true
    try {
      const fetchedDatabases = await databaseService.fetchDatabases()
      databases.value = fetchedDatabases
      if (availableEngines.value.length === 0) {
        try {
          availableEngines.value = await databaseService.fetchEngines()
        } catch (error) {
          console.error('Error fetching engines:', error)
          availableEngines.value = []
        }
      }
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
      const newDatabase = await databaseService.createDatabase(data.engine, data.name || undefined)
      
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

  async function activateDatabase(id: string): Promise<Database> {
    try {
      const updatedDatabase = await databaseService.activateDatabase(id)
      
      // Actualizar en la lista local
      const index = databases.value.findIndex((db) => db.id === id)
      if (index !== -1) {
        databases.value[index] = updatedDatabase
      } else {
        databases.value.push(updatedDatabase)
      }
      
      return updatedDatabase
    } catch (error: any) {
      console.error('Error activating database:', error)
      throw error
    }
  }

  async function deactivateDatabase(id: string): Promise<Database> {
    try {
      const updatedDatabase = await databaseService.deactivateDatabase(id)
      
      // Actualizar en la lista local
      const index = databases.value.findIndex((db) => db.id === id)
      if (index !== -1) {
        databases.value[index] = updatedDatabase
      } else {
        databases.value.push(updatedDatabase)
      }
      
      return updatedDatabase
    } catch (error: any) {
      console.error('Error deactivating database:', error)
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
      // Usar puerto 3307 para MySQL, 5432 para PostgreSQL, etc.
      let port = response.port || (response.engine === 'mysql' ? 3307 : (response.engine === 'postgresql' ? 5432 : 3306))
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
    try {
      // Llamar al endpoint de rotación de credenciales
      const { database, password } = await databaseService.rotateCredentials(id)
      
      // Construir las credenciales con la contraseña recibida
      const credentials: DatabaseCredentials = {
        host: database.host || '168.119.182.243',
        port: database.port || 3306,
        username: database.username || database.name || '',
        password: password, // Usar la contraseña recibida de la rotación
        database: database.name || '',
        firstView: true, // Marcar como primera vista para mostrar la contraseña
        connectionString: database.connectionString || '',
      }
      
      return credentials
    } catch (error: any) {
      console.error('Error rotating credentials:', error)
      throw error
    }
  }

  async function exportDatabase(id: string): Promise<Blob> {
    try {
      return await databaseService.exportDatabase(id)
    } catch (error: any) {
      console.error('Error exporting database:', error)
      throw error
    }
  }

  function getDatabasesByEngine(engine: DatabaseEngine | 'all'): Database[] {
    if (engine === 'all') return databases.value
    return databases.value.filter((db) => db.engine === engine)
  }

  return {
    databases,
    loading,
    availableEngines,
    selectedEngine,
    fetchDatabases,
    createDatabase,
    deleteDatabase,
    activateDatabase,
    deactivateDatabase,
    getCredentials,
    rotateCredentials,
    exportDatabase,
    getDatabasesByEngine,
  }
})

