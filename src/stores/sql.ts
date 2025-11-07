import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SqlQuery, SqlResult, Database } from '@/types'
// import apiClient from '@/services/api' // Backend will be implemented later

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
      // Mock - Backend will be implemented later
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock result
      const mockResult: SqlResult = {
        success: true,
        data: [
          { id: 1, name: 'Mock Row 1', value: 'Value 1' },
          { id: 2, name: 'Mock Row 2', value: 'Value 2' },
        ],
        executionTime: 0.05,
        affectedRows: 2,
      }
      results.value = mockResult

      // Add to history
      const historyItem: QueryHistory = {
        id: `${Date.now()}-${Math.random()}`,
        query,
        dbId: db.id,
        engine: db.engine,
        timestamp: Date.now(),
        success: mockResult.success,
      }
      history.value.unshift(historyItem)
      // Keep only last 50 queries
      if (history.value.length > 50) {
        history.value = history.value.slice(0, 50)
      }
      saveHistory()

      return mockResult
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
      // Mock - Backend will be implemented later
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Mock tables based on engine
      const mockTables: DatabaseTable[] = [
        { name: 'users', type: 'table', rowCount: 1250 },
        { name: 'products', type: 'table', rowCount: 340 },
        { name: 'orders', type: 'table', rowCount: 890 },
        { name: 'categories', type: 'table', rowCount: 15 },
      ]
      
      tables.value = mockTables
      return mockTables
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

