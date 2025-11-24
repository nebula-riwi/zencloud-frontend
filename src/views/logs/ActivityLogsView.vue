<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Registro de Actividad</h1>
          <p class="text-muted-foreground mt-2">
            Historial completo de acciones en tu cuenta y bases de datos
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'account'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'account'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <UserCircle :size="20" />
              <span>Cuenta</span>
            </div>
          </button>
          <button
            @click="activeTab = 'databases'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'databases'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <Database :size="20" />
              <span>Bases de Datos</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Content -->
      <Card>
        <CardContent class="p-6">
          <!-- Account Logs -->
          <div v-if="activeTab === 'account'">
            <div v-if="accountLoading" class="flex justify-center py-12">
              <Loading />
            </div>
            <div v-else-if="accountLogs.length === 0" class="text-center py-12">
              <p class="text-muted-foreground">No hay registros de actividad en tu cuenta</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="log in accountLogs"
                :key="log.auditId"
                class="flex items-start space-x-4 p-4 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getActionColor(log.action)"
                >
                  <component :is="getActionIcon(log.action)" :size="20" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-medium text-white">{{ getActionLabel(log.action) }}</p>
                      <p v-if="log.oldValue" class="text-sm text-muted-foreground mt-1">
                        {{ log.oldValue }}
                      </p>
                      <div class="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span class="flex items-center space-x-1">
                          <Globe :size="14" />
                          <span>{{ log.ipAddress || 'Unknown' }}</span>
                        </span>
                        <span>{{ formatDate(log.createdAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="accountPagination.totalPages > 1" class="flex justify-center items-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  @click="loadAccountLogs(accountPagination.page - 1)"
                  :disabled="accountPagination.page <= 1"
                >
                  Anterior
                </Button>
                <span class="text-sm text-muted-foreground">
                  Página {{ accountPagination.page }} de {{ accountPagination.totalPages }}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  @click="loadAccountLogs(accountPagination.page + 1)"
                  :disabled="accountPagination.page >= accountPagination.totalPages"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>

          <!-- Database Logs -->
          <div v-if="activeTab === 'databases'">
            <div v-if="databaseLoading" class="flex justify-center py-12">
              <Loading />
            </div>
            <div v-else-if="databaseLogs.length === 0" class="text-center py-12">
              <p class="text-muted-foreground">No hay registros de actividad en tus bases de datos</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="log in databaseLogs"
                :key="log.auditId"
                class="flex items-start space-x-4 p-4 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getDatabaseActionColor(log.action)"
                >
                  <component :is="getDatabaseActionIcon(log.action)" :size="20" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-medium text-white">{{ getDatabaseActionLabel(log.action) }}</p>
                      <p v-if="log.oldValue" class="text-sm text-muted-foreground mt-1">
                        {{ log.oldValue }}
                      </p>
                      <div class="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span class="flex items-center space-x-1">
                          <Globe :size="14" />
                          <span>{{ log.ipAddress || 'Unknown' }}</span>
                        </span>
                        <span>{{ formatDate(log.createdAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="databasePagination.totalPages > 1" class="flex justify-center items-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  @click="loadDatabaseLogs(databasePagination.page - 1)"
                  :disabled="databasePagination.page <= 1"
                >
                  Anterior
                </Button>
                <span class="text-sm text-muted-foreground">
                  Página {{ databasePagination.page }} de {{ databasePagination.totalPages }}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  @click="loadDatabaseLogs(databasePagination.page + 1)"
                  :disabled="databasePagination.page >= databasePagination.totalPages"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuditLogStore } from '@/stores/auditLog'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import { UserCircle, Database, Globe, LogIn, LogOut, Key, Shield, Plus, Trash2, Edit } from 'lucide-vue-next'

const auditLogStore = useAuditLogStore()
const { accountLogs, databaseLogs, accountLoading, databaseLoading, accountPagination, databasePagination } = storeToRefs(auditLogStore)

const activeTab = ref<'account' | 'databases'>('account')

onMounted(async () => {
  await loadAccountLogs()
  await loadDatabaseLogs()
})

async function loadAccountLogs(page = 1) {
  await auditLogStore.fetchAccountLogs(page)
}

async function loadDatabaseLogs(page = 1) {
  await auditLogStore.fetchDatabaseLogs(undefined, page)
}

function getActionIcon(action: string) {
  const icons: Record<string, any> = {
    UserLogin: LogIn,
    UserLogout: LogOut,
    PasswordChanged: Key,
    UserCreated: Plus,
    UserUpdated: Edit,
    EmailVerified: Shield,
  }
  return icons[action] || UserCircle
}

function getActionColor(action: string) {
  const colors: Record<string, string> = {
    UserLogin: 'bg-green-500/20 text-green-400',
    UserLogout: 'bg-gray-500/20 text-gray-400',
    PasswordChanged: 'bg-orange-500/20 text-orange-400',
    UserCreated: 'bg-blue-500/20 text-blue-400',
    UserUpdated: 'bg-yellow-500/20 text-yellow-400',
    EmailVerified: 'bg-purple-500/20 text-purple-400',
  }
  return colors[action] || 'bg-gray-500/20 text-gray-400'
}

function getActionLabel(action: string) {
  const labels: Record<string, string> = {
    UserLogin: 'Inicio de sesión',
    UserLogout: 'Cierre de sesión',
    PasswordChanged: 'Cambio de contraseña',
    UserCreated: 'Cuenta creada',
    UserUpdated: 'Cuenta actualizada',
    EmailVerified: 'Email verificado',
  }
  return labels[action] || action
}

function getDatabaseActionIcon(action: string) {
  const icons: Record<string, any> = {
    DatabaseCreated: Plus,
    DatabaseDeleted: Trash2,
    DatabaseUpdated: Edit,
    DatabaseStatusChanged: Database,
  }
  return icons[action] || Database
}

function getDatabaseActionColor(action: string) {
  const colors: Record<string, string> = {
    DatabaseCreated: 'bg-green-500/20 text-green-400',
    DatabaseDeleted: 'bg-red-500/20 text-red-400',
    DatabaseUpdated: 'bg-blue-500/20 text-blue-400',
    DatabaseStatusChanged: 'bg-yellow-500/20 text-yellow-400',
  }
  return colors[action] || 'bg-gray-500/20 text-gray-400'
}

function getDatabaseActionLabel(action: string) {
  const labels: Record<string, string> = {
    DatabaseCreated: 'Base de datos creada',
    DatabaseDeleted: 'Base de datos eliminada',
    DatabaseUpdated: 'Query ejecutado',
    DatabaseStatusChanged: 'Estado cambiado',
  }
  return labels[action] || action
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
