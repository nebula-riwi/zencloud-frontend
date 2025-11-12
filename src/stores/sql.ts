import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SqlResult, Database } from '@/types'
import { sqlService } from '@/services/sql.service'

interface QueryHistory {
  id: string
  query: string
  dbId: string
  engine: string
  timestamp: number
  success: boolean
}

export interface DatabaseTable {
  name: string
  type?: string
  rowCount?: number
}

export const useSqlStore = defineStore('sql', () => {
  const selectedDb = ref<Database | null>(null)
  const queryText = ref('')
  const history = ref<QueryHistory[]>([])
  const isRunning = ref(false)
  const results = ref<SqlResult | null>(null)
  const tables = ref<DatabaseTable[]>([])
  const loadingTables = ref(false)

  // Load history from localStorage
  function loadHistory() {
    const stored = localStorage.getItem('sql_query_history')
    if (stored) {
      try {
        history.value = JSON.parse(stored)
      } catch {
        history.value = []
      }
    }
  }

  // Save history to localStorage
  function saveHistory() {
    localStorage.setItem('sql_query_history', JSON.stringify(history.value))
  }

  // Initialize
  loadHistory()

  async function runQuery(query: string, db: Database): Promise<SqlResult> {
    if (!db) throw new Error('No database selected')
    
    isRunning.value = true
    try {
      // Ejecutar query en el backend
      const result = await sqlService.executeQuery(db.id, query)
      
      results.value = result

      // Add to history
      const historyItem: QueryHistory = {
        id: `${Date.now()}-${Math.random()}`,
        query,
        dbId: db.id,
        engine: db.engine,
        timestamp: Date.now(),
        success: result.success,
      }
      history.value.unshift(historyItem)
      // Keep only last 50 queries
      if (history.value.length > 50) {
        history.value = history.value.slice(0, 50)
      }
      saveHistory()

      return result
    } catch (error: any) {
      console.error('Error running query:', error)
      const errorResult: SqlResult = {
        success: false,
        error: error.message || 'Error al ejecutar query',
        errorMessage: error.message || 'Error al ejecutar query',
        executionTime: 0,
        affectedRows: 0,
      }
      results.value = errorResult
      return errorResult
    } finally {
      isRunning.value = false
    }
  }

  function clear() {
    queryText.value = ''
    results.value = null
  }

  function pushHistory(item: QueryHistory) {
    history.value.unshift(item)
    saveHistory()
  }

  function clearHistory() {
    history.value = []
    saveHistory()
  }

  function selectDatabase(db: Database | null) {
    selectedDb.value = db
    // Save to localStorage
    if (db) {
      localStorage.setItem('sql_selected_db', db.id)
    } else {
      localStorage.removeItem('sql_selected_db')
    }
  }

  function loadSelectedDatabase(databases: Database[]) {
    const storedId = localStorage.getItem('sql_selected_db')
    if (storedId) {
      const db = databases.find((d) => d.id === storedId)
      if (db) {
        selectedDb.value = db
      }
    }
  }

  async function fetchTables(db: Database): Promise<DatabaseTable[]> {
    if (!db) return []
    
    loadingTables.value = true
    try {
      // Obtener tablas del backend
      const fetchedTables = await sqlService.getTables(db.id)
      tables.value = fetchedTables
      return fetchedTables
    } catch (error: any) {
      console.error('Error fetching tables:', error)
      // En caso de error, retornar array vacío
      tables.value = []
      return []
    } finally {
      loadingTables.value = false
    }
  }

  return {
    selectedDb,
    queryText,
    history,
    isRunning,
    results,
    tables,
    loadingTables,
    runQuery,
    clear,
    pushHistory,
    clearHistory,
    selectDatabase,
    loadSelectedDatabase,
    fetchTables,
  }
})

