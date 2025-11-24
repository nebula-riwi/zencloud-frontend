import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuditLog, AuditLogsPagedResponse } from '@/services/auditLog.service'
import { auditLogService } from '@/services/auditLog.service'

export const useAuditLogStore = defineStore('auditLog', () => {
  const accountLogs = ref<AuditLog[]>([])
  const databaseLogs = ref<AuditLog[]>([])
  const accountLoading = ref(false)
  const databaseLoading = ref(false)
  const accountPagination = ref({
    page: 1,
    pageSize: 50,
    totalCount: 0,
    totalPages: 0
  })
  const databasePagination = ref({
    page: 1,
    pageSize: 50,
    totalCount: 0,
    totalPages: 0
  })

  async function fetchAccountLogs(page = 1): Promise<void> {
    accountLoading.value = true
    try {
      const response = await auditLogService.getAccountLogs(page, accountPagination.value.pageSize)
      accountLogs.value = response.logs
      accountPagination.value = {
        page: response.page,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        totalPages: response.totalPages
      }
    } catch (error) {
      console.error('Error fetching account logs:', error)
      accountLogs.value = []
    } finally {
      accountLoading.value = false
    }
  }

  async function fetchDatabaseLogs(instanceId?: string, page = 1): Promise<void> {
    databaseLoading.value = true
    try {
      const response = await auditLogService.getDatabaseLogs(instanceId, page, databasePagination.value.pageSize)
      databaseLogs.value = response.logs
      databasePagination.value = {
        page: response.page,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        totalPages: response.totalPages
      }
    } catch (error) {
      console.error('Error fetching database logs:', error)
      databaseLogs.value = []
    } finally {
      databaseLoading.value = false
    }
  }

  return {
    accountLogs,
    databaseLogs,
    accountLoading,
    databaseLoading,
    accountPagination,
    databasePagination,
    fetchAccountLogs,
    fetchDatabaseLogs
  }
})
