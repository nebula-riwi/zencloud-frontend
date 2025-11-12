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
      
      // Crear la base de datos en el backend
      const newDatabase = await databaseService.createDatabase(engineId)
      
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
      // Obtener la base de datos para extraer las credenciales
      const database = await databaseService.getDatabaseById(_id)
      
      // El backend no tiene un endpoint específico para obtener credenciales
      // Por ahora, construimos las credenciales desde la información disponible
      // NOTA: El backend puede necesitar un endpoint específico para esto
    return {
        host: database.host || '168.119.182.243', // IP del servidor (del backend)
        port: database.port || 3306,
        username: database.username || '',
        password: '', // El backend no expone la contraseña por seguridad
        database: database.name,
      firstView: true,
        connectionString: database.connectionString,
      }
    } catch (error: any) {
      console.error('Error getting credentials:', error)
      throw error
    }
  }

  async function rotateCredentials(_id: string): Promise<DatabaseCredentials> {
    // El backend no tiene endpoint para rotar credenciales aún
    // Por ahora, retornamos las credenciales actuales
    // TODO: Implementar cuando el backend tenga este endpoint
    return await this.getCredentials(_id)
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

