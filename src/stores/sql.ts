import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SqlResult, Database, QueryHistoryItem } from '@/types'
import { sqlService } from '@/services/sql.service'

export interface DatabaseTable {
  name: string
  type?: string
  rowCount?: number
}

export const useSqlStore = defineStore('sql', () => {
  const selectedDb = ref<Database | null>(null)
  const queryText = ref('')
  const history = ref<QueryHistoryItem[]>([])
  const isRunning = ref(false)
  const results = ref<SqlResult | null>(null)
  const tables = ref<DatabaseTable[]>([])
  const loadingTables = ref(false)

  async function runQuery(query: string, db: Database): Promise<SqlResult> {
    if (!db) throw new Error('No database selected')
    
    isRunning.value = true
    try {
      // Ejecutar query en el backend
      const result = await sqlService.executeQuery(db.id, query)
      
      results.value = result

      await fetchHistory(db)

      return result
    } catch (error: any) {
      console.error('Error running query:', error)
      const errorCode = error?.response?.data?.errorCode
      let backendMessage = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Error al ejecutar query'
      
      // Mejorar mensajes de error específicos
      if (errorCode === 'VALIDATION_ERROR' || errorCode === 'INVALID_QUERY') {
        backendMessage = error?.response?.data?.message || 'La consulta no es válida. Verifica la sintaxis.'
      } else if (errorCode === 'TIMEOUT') {
        backendMessage = 'La consulta tardó más de 60 segundos en ejecutarse y fue cancelada. Considera optimizar tu consulta o dividirla en consultas más pequeñas.'
      } else if (errorCode === 'CONNECTION_ERROR' || error?.response?.status === 502 || error?.response?.status === 503) {
        backendMessage = 'Error de conexión con la base de datos. Verifica que la base de datos esté activa y disponible.'
      } else if (error?.response?.status === 400) {
        backendMessage = error?.response?.data?.message || 'Error en la consulta. Verifica la sintaxis y las restricciones.'
      } else if (error?.response?.status === 401) {
        backendMessage = 'No tienes permisos para ejecutar esta consulta.'
      } else if (error?.response?.status === 403) {
        backendMessage = 'No tienes acceso a esta base de datos.'
      }
      
      const errorResult: SqlResult = {
        success: false,
        error: backendMessage,
        errorMessage: backendMessage,
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

  async function selectDatabase(db: Database | null) {
    selectedDb.value = db
    if (db) {
      localStorage.setItem('sql_selected_db', db.id)
      try {
        await fetchHistory(db)
      } catch {
        history.value = []
      }
    } else {
      localStorage.removeItem('sql_selected_db')
      history.value = []
    }
  }

  async function loadSelectedDatabase(databases: Database[]) {
    const storedId = localStorage.getItem('sql_selected_db')
    if (storedId) {
      const db = databases.find((d) => d.id === storedId)
      if (db) {
        selectedDb.value = db
        try {
          await fetchHistory(db)
        } catch {
          history.value = []
        }
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

  async function fetchHistory(db: Database, limit = 20): Promise<QueryHistoryItem[]> {
    if (!db) {
      history.value = []
      return []
    }

    try {
      const items = await sqlService.getHistory(db.id, limit)
      history.value = items
      return items
    } catch (error) {
      history.value = []
      throw error
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
    selectDatabase,
    loadSelectedDatabase,
    fetchTables,
    fetchHistory,
  }
})

