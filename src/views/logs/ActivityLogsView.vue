<template>
  <DashboardLayout>
    <div class="space-y-8 relative">
      <!-- Animated background particles -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          v-for="i in 12"
          :key="i"
          class="absolute w-1 h-1 bg-white/5 rounded-full floating-particle"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }"
        />
      </div>

      <!-- Header -->
      <Transition name="fade-up" appear>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-1 h-12 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
              <div>
                <h1 class="text-5xl font-bold text-white mb-2 tracking-tight" style="text-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3);">
                  Actividad
                </h1>
                <p class="text-white/70 text-lg">Historial completo de acciones en tus bases de datos</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Filters -->
      <Transition name="fade-up" appear :delay="50">
        <div class="relative z-10">
          <div class="flex gap-2 mb-4">
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="activeFilter = filter.value"
              :class="[
                'px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300',
                activeFilter === filter.value
                  ? 'bg-gradient-to-r from-[#e78a53] to-[#f59a63] text-white shadow-lg shadow-[#e78a53]/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              ]"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- Content -->
      <Transition name="fade-up" appear :delay="100">
        <Card class="relative z-10 border-white/10 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent opacity-50"></div>
          <CardContent class="relative z-10 pt-6">
            <!-- Database Logs -->
            <div v-if="databaseLoading" class="flex justify-center py-12">
              <Loading text="Cargando actividad..." />
            </div>
            <div v-else-if="databaseLogs.length === 0" class="text-center py-16">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 border border-[#e78a53]/30 mb-6">
                <Database class="h-10 w-10 text-[#e78a53] opacity-70" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-3" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);">No hay registros de bases de datos</h3>
              <p class="text-white/60 max-w-md mx-auto">Las acciones en tus bases de datos aparecerán aquí</p>
            </div>
            <div v-else-if="filteredDatabaseLogs.length === 0" class="text-center py-12">
              <p class="text-white/60">No hay registros para el filtro seleccionado</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="log in filteredDatabaseLogs"
                :key="log.auditId"
                class="group relative rounded-xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-xl overflow-hidden hover:border-[#e78a53]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#e78a53]/10"
              >
                <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 via-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:via-[#e78a53]/3 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div class="relative z-10 p-5">
                  <div class="flex items-start gap-4">
                    <div
                      class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      :class="getDatabaseActionColor(log.action)"
                    >
                      <component :is="getDatabaseActionIcon(log.action)" :size="22" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                          <p class="font-semibold text-white mb-1" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);">{{ getDatabaseActionLabel(log.action) }}</p>
                          <p v-if="log.oldValue" class="text-sm text-white/60 mb-2 font-mono">
                            {{ log.oldValue }}
                          </p>
                          <div class="flex items-center gap-4 text-xs text-white/40">
                            <span class="flex items-center gap-1.5">
                              <Globe :size="14" />
                              <span class="font-mono">{{ log.ipAddress || 'N/A' }}</span>
                            </span>
                            <span class="flex items-center gap-1.5">
                              <Clock :size="14" />
                              <span>{{ formatDate(log.createdAt) }}</span>
                            </span>
                          </div>
                          </div>
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
          </CardContent>
        </Card>
      </Transition>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuditLogStore } from '@/stores/auditLog'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import { Database, Globe, Plus, Trash2, Edit, Clock } from 'lucide-vue-next'

const auditLogStore = useAuditLogStore()
const { databaseLogs, databaseLoading, databasePagination } = storeToRefs(auditLogStore)

const activeFilter = ref('all')

const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Hoy', value: 'today' },
  { label: 'Esta Semana', value: 'week' },
  { label: 'Este Mes', value: 'month' }
]

const filteredDatabaseLogs = computed(() => {
  if (activeFilter.value === 'all') return databaseLogs.value
  
  const now = new Date()
  const filtered = databaseLogs.value.filter(log => {
    const logDate = new Date(log.createdAt)
    
    if (activeFilter.value === 'today') {
      return logDate.toDateString() === now.toDateString()
    } else if (activeFilter.value === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return logDate >= weekAgo
    } else if (activeFilter.value === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return logDate >= monthAgo
    }
    return true
  })
  
  return filtered
})

onMounted(async () => {
  await loadDatabaseLogs()
})

async function loadDatabaseLogs(page = 1) {
  await auditLogStore.fetchDatabaseLogs(undefined, page)
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

<style scoped>
@keyframes floating {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-40px) translateX(-10px);
    opacity: 0.3;
  }
  75% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.5;
  }
}

.floating-particle {
  animation: floating 15s ease-in-out infinite;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-to,
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
