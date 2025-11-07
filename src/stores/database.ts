import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Database, DatabaseEngine, DatabaseCredentials } from '@/types'
import apiClient from '@/services/api'

export const useDatabaseStore = defineStore('database', () => {
  const databases = ref<Database[]>([])
  const loading = ref(false)
  const selectedEngine = ref<DatabaseEngine | 'all'>('all')

  async function fetchDatabases(engine?: DatabaseEngine): Promise<Database[]> {
    loading.value = true
    try {
      // Mock data - Backend will be implemented later
      await new Promise(resolve => setTimeout(resolve, 500))
      databases.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function createDatabase(data: { name: string; engine: DatabaseEngine }): Promise<Database> {
    // Mock - Backend will be implemented later
    const mockDb: Database = {
      id: `mock-${Date.now()}`,
      name: data.name,
      engine: data.engine,
      status: 'creating',
      createdAt: new Date().toISOString(),
    }
    databases.value.push(mockDb)
    return mockDb
  }

  async function deleteDatabase(id: string): Promise<void> {
    // Mock - Backend will be implemented later
    databases.value = databases.value.filter((db) => db.id !== id)
  }

  async function getCredentials(id: string): Promise<DatabaseCredentials> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      host: 'mock-host.example.com',
      port: 3306,
      username: 'mock_user',
      password: 'mock_password',
      database: 'mock_db',
      firstView: true,
    }
  }

  async function rotateCredentials(id: string): Promise<DatabaseCredentials> {
    // Mock - Backend will be implemented later
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      host: 'mock-host.example.com',
      port: 3306,
      username: 'mock_user',
      password: 'new_mock_password',
      database: 'mock_db',
      firstView: true,
    }
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

