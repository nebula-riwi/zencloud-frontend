import apiClient from './api'
import type { SqlResult, QueryResultResponse, DatabaseTable, QueryHistoryItem } from '@/types'

/**
 * Servicio para ejecutar queries SQL y obtener información de bases de datos
 */
export const sqlService = {
  /**
   * Ejecuta una query SQL en una base de datos
   * @param instanceId - ID de la instancia de base de datos
   * @param query - Query SQL a ejecutar
   * @returns Resultado de la query
   */
  async executeQuery(instanceId: string, query: string): Promise<SqlResult> {
    try {
      const response = await apiClient.post<QueryResultResponse>(
        `/api/databases/${instanceId}/DatabaseManager/execute`,
        { query }
      )

      const result = response.data

      // Mapear la respuesta del backend al formato del frontend
      return {
        success: result.success,
        columns: result.columns,
        rows: result.rows,
        data: this.mapRowsToData(result.columns, result.rows),
        error: result.errorMessage,
        errorMessage: result.errorMessage,
        executionTime: result.executionTime / 1000, // Convertir de ms a segundos
        affectedRows: result.affectedRows,
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.errorMessage ||
        error.message ||
        'Error al ejecutar query'
      
      return {
        success: false,
        error: errorMessage,
        errorMessage: errorMessage,
        executionTime: 0,
        affectedRows: 0,
      }
    }
  },

  /**
   * Obtiene las tablas de una base de datos
   * @param instanceId - ID de la instancia de base de datos
   * @returns Lista de tablas
   */
  async getTables(instanceId: string): Promise<DatabaseTable[]> {
    try {
      // El backend retorna TableInfo[] con tableName, tableType, rowCount
      interface TableInfoResponse {
        tableName: string
        tableType: string
        rowCount: number
        createTime?: string
      }

      const response = await apiClient.get<TableInfoResponse[]>(
        `/api/databases/${instanceId}/DatabaseManager/tables`
      )

      return response.data.map((table) => ({
        name: table.tableName,
        type: table.tableType,
        rowCount: table.rowCount,
      }))
    } catch (error: any) {
      console.error('Error getting tables:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Error al obtener tablas'
      throw new Error(errorMessage)
    }
  },

  async getHistory(instanceId: string, limit = 20): Promise<QueryHistoryItem[]> {
    try {
      const response = await apiClient.get<{ data: QueryHistoryItem[] }>(
        `/api/databases/${instanceId}/DatabaseManager/history`,
        { params: { limit } }
      )
      return response.data.data
    } catch (error: any) {
      console.error('Error getting query history:', error)
      throw new Error(error.response?.data?.error || 'No se pudo obtener el historial de consultas')
    }
  },

  /**
   * Mapea las filas y columnas a un array de objetos para facilitar el uso
   * @param columns - Nombres de las columnas
   * @param rows - Filas de datos
   * @returns Array de objetos con los datos
   */
  mapRowsToData(columns: string[], rows: any[][]): any[] {
    return rows.map((row) => {
      const obj: Record<string, any> = {}
      columns.forEach((col, index) => {
        obj[col] = row[index]
      })
      return obj
    })
  },
}

