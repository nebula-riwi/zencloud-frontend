import apiClient from './api'

export interface AuditLog {
  auditId: string
  userId?: string
  action: string
  entityType: string
  entityId: string
  oldValue?: string
  newValue?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  userEmail?: string
}

export interface AuditLogsPagedResponse {
  logs: AuditLog[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export const auditLogService = {
  async getAccountLogs(page = 1, pageSize = 50): Promise<AuditLogsPagedResponse> {
    const response = await apiClient.get<AuditLogsPagedResponse>('/api/AuditLogs/account', {
      params: { page, pageSize }
    })
    return response.data
  },

  async getDatabaseLogs(instanceId?: string, page = 1, pageSize = 50): Promise<AuditLogsPagedResponse> {
    const response = await apiClient.get<AuditLogsPagedResponse>('/api/AuditLogs/databases', {
      params: { instanceId, page, pageSize }
    })
    return response.data
  }
}
