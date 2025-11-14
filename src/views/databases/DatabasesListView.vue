<template>
  <DashboardLayout>
    <div class="space-y-8 relative">
      <!-- Animated background particles -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          v-for="i in 15"
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

      <!-- Header with advanced styling -->
      <Transition name="fade-up" appear>
        <div class="flex items-center justify-between relative z-10">
          <div>
            <div class="flex items-center gap-4 mb-3">
              <div class="w-1 h-12 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
              <div>
                <h1 class="text-5xl font-bold text-white mb-2 tracking-tight" style="text-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 90px rgba(255, 255, 255, 0.2);">
                  Bases de Datos
                </h1>
                <p class="text-white/70 text-lg">Gestiona todas tus bases de datos</p>
              </div>
            </div>
          </div>
          <Button
            @click="showCreateModal = true"
            class="bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300"
          >
            <Plus class="h-4 w-4 mr-2" />
            Crear Base de Datos
          </Button>
        </div>
      </Transition>

      <!-- Plan Quota Info with enhanced styling -->
      <Transition name="fade-up" appear :delay="100">
        <Card v-if="currentPlan" class="relative z-10 border-white/10 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-[#e78a53]/5 via-transparent to-transparent"></div>
          <CardContent class="pt-6 relative z-10">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-2 h-2 rounded-full bg-[#e78a53] animate-pulse"></div>
                  <p class="text-sm font-semibold text-white/90 uppercase tracking-wider">Plan {{ currentPlan.name }}</p>
                </div>
                <p class="text-xs text-white/60 font-medium">
                  {{ usedCount }}/{{ currentPlan.maxDatabases }} bases de datos por motor
                </p>
                <div class="mt-3 h-2 bg-white/5 rounded-full overflow-hidden max-w-md">
                  <div
                    class="h-full bg-gradient-to-r from-[#e78a53] to-[#f59a63] rounded-full transition-all duration-500"
                    :style="{ width: `${(usedCount / currentPlan.maxDatabases) * 100}%` }"
                  ></div>
                </div>
              </div>
              <Badge v-if="!canCreate" variant="warning" class="text-xs px-3 py-1.5">
                Límite alcanzado
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Transition>

      <!-- Tabs with advanced styling -->
      <Transition name="fade-up" appear :delay="200">
        <Card class="relative z-10 border-white/10 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent opacity-50"></div>
          <CardHeader class="relative z-10 border-b border-white/10">
            <TabsList v-model="selectedEngine" class="grid w-full grid-cols-7">
              <TabsTrigger :modelValue="selectedEngine" value="all" @update:modelValue="selectedEngine = $event as DatabaseEngine | 'all'">Todas</TabsTrigger>
              <TabsTrigger :modelValue="selectedEngine" value="mysql" @update:modelValue="selectedEngine = $event as DatabaseEngine | 'all'">MySQL</TabsTrigger>
              <TabsTrigger :modelValue="selectedEngine" value="postgresql" @update:modelValue="selectedEngine = $event as DatabaseEngine | 'all'">PostgreSQL</TabsTrigger>
              <TabsTrigger :modelValue="selectedEngine" value="mongodb" @update:modelValue="selectedEngine = $event as DatabaseEngine | 'all'">MongoDB</TabsTrigger>
              <TabsTrigger :modelValue="selectedEngine" value="sqlserver" @update:modelValue="selectedEngine = $event as DatabaseEngine | 'all'">SQL Server</TabsTrigger>
              <TabsTrigger :modelValue="selectedEngine" value="redis" @update:modelValue="selectedEngine = $event as DatabaseEngine | 'all'">Redis</TabsTrigger>
              <TabsTrigger :modelValue="selectedEngine" value="cassandra" @update:modelValue="selectedEngine = $event as DatabaseEngine | 'all'">Cassandra</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent class="relative z-10 pt-6">
            <Loading v-if="loading" text="Cargando bases de datos..." />
            
            <div v-else-if="filteredDatabases.length === 0" class="text-center py-16">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 border border-[#e78a53]/30 mb-6">
                <Database class="h-10 w-10 text-[#e78a53] opacity-70" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">No hay bases de datos</h3>
              <p class="text-white/60 mb-6 text-lg">
                {{ selectedEngine === 'all' ? 'Crea tu primera base de datos' : `No tienes bases de datos ${selectedEngine}` }}
              </p>
              <Button
                @click="showCreateModal = true"
                class="bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] shadow-lg shadow-[#e78a53]/30"
              >
                <Plus class="h-4 w-4 mr-2" />
                Crear Base de Datos
              </Button>
            </div>

            <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <TransitionGroup name="list" tag="div" class="contents">
                <Card
                  v-for="(db, index) in filteredDatabases"
                  :key="db.id"
                  class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300"
                  :style="{ animationDelay: `${300 + index * 50}ms` }"
                >
                  <!-- Gradient overlay on hover -->
                  <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
                  
                  <CardHeader class="relative z-10 border-b border-white/10 pb-4">
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-2">
                          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 shrink-0">
                            <Database class="h-4 w-4 text-[#e78a53]" />
                          </div>
                          <CardTitle class="text-xl text-white truncate">{{ db.name }}</CardTitle>
                        </div>
                        <CardDescription class="text-white/60 font-medium">{{ db.engine }}</CardDescription>
                      </div>
                      <Badge :variant="getStatusVariant(db.status)" class="shrink-0 text-xs px-2 py-1 whitespace-nowrap">
                        {{ getStatusLabel(db.status) }}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent class="relative z-10 pt-6">
                    <div class="space-y-3 text-sm">
                      <div v-if="db.host" class="flex justify-between items-center p-2 rounded-lg bg-white/5">
                        <span class="text-white/60 font-medium">Host:</span>
                        <span class="font-mono text-white/90 text-xs">{{ db.host }}</span>
                      </div>
                      <div v-if="db.port" class="flex justify-between items-center p-2 rounded-lg bg-white/5">
                        <span class="text-white/60 font-medium">Puerto:</span>
                        <span class="text-white/90 font-semibold">{{ db.port }}</span>
                      </div>
                      <div class="flex justify-between items-center p-2 rounded-lg bg-white/5">
                        <span class="text-white/60 font-medium">Creada:</span>
                        <span class="text-white/90">{{ formatDate(db.createdAt) }}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter class="relative z-10 flex gap-2 pt-4 border-t border-white/10">
                    <template v-if="db.status === 'active'">
                      <Button
                        variant="outline"
                        size="sm"
                        @click="showCredentials(db.id)"
                        class="flex-1 border-white/10 hover:border-[#e78a53]/40 hover:bg-[#e78a53]/10 transition-all"
                      >
                        Credenciales
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        @click="confirmDeactivate(db.id)"
                        class="flex-1"
                      >
                        Desactivar
                      </Button>
                    </template>
                    <template v-else-if="db.status === 'inactive'">
                      <Button
                        variant="outline"
                        size="sm"
                        @click="confirmActivate(db.id)"
                        class="flex-1 border-white/10 hover:border-[#e78a53]/40 hover:bg-[#e78a53]/10 transition-all"
                      >
                        Reactivar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        @click="confirmDelete(db.id)"
                        class="flex-1"
                      >
                        Eliminar
                      </Button>
                    </template>
                    <template v-else>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        class="flex-1 border-white/10 opacity-50"
                      >
                        {{ getStatusLabel(db.status) }}
                      </Button>
                    </template>
                  </CardFooter>
                  
                  <!-- Shine effect on hover -->
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </Card>
              </TransitionGroup>
            </div>
          </CardContent>
        </Card>
      </Transition>
    </div>

    <!-- Create Database Modal -->
    <CreateDatabaseModal
      v-model="showCreateModal"
      :preselected-engine="selectedEngine !== 'all' ? selectedEngine : undefined"
      @created="handleDatabaseCreated"
    />

    <!-- Credentials Modal -->
    <CredentialsModal
      v-model="showCredentialsModal"
      :database-id="selectedDatabaseId"
      @credentials-rotated="handleCredentialsRotated"
    />

    <!-- Delete Confirmation -->
    <AlertDialog
      v-model="showDeleteDialog"
      title="Eliminar Base de Datos"
      description="¿Estás seguro de que deseas eliminar esta base de datos? Esta acción eliminará permanentemente la base de datos y todos sus datos. Esta acción no se puede deshacer."
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      confirm-variant="danger"
      @confirm="handleDelete"
    />

    <!-- Deactivate Confirmation -->
    <AlertDialog
      v-model="showDeactivateDialog"
      title="Desactivar Base de Datos"
      description="¿Estás seguro de que deseas desactivar esta base de datos? La base de datos dejará de estar disponible pero permanecerá en el sistema. Podrás reactivarla más tarde."
      confirm-text="Desactivar"
      cancel-text="Cancelar"
      confirm-variant="warning"
      @confirm="handleDeactivate"
    />

    <!-- Activate Confirmation -->
    <AlertDialog
      v-model="showActivateDialog"
      title="Reactivar Base de Datos"
      description="¿Estás seguro de que deseas reactivar esta base de datos? Asegúrate de no haber alcanzado el límite de bases de datos activas según tu plan."
      confirm-text="Reactivar"
      cancel-text="Cancelar"
      confirm-variant="primary"
      @confirm="handleActivate"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { usePlanStore } from '@/stores/plan'
import { useToastStore } from '@/stores/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Loading from '@/components/ui/Loading.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import AlertDialog from '@/components/ui/AlertDialog.vue'
import CreateDatabaseModal from '@/components/databases/CreateDatabaseModal.vue'
import CredentialsModal from '@/components/databases/CredentialsModal.vue'
import { Database, Plus } from 'lucide-vue-next'
import type { DatabaseEngine, DatabaseStatus } from '@/types'
import { storeToRefs } from 'pinia'

const route = useRoute()
const databaseStore = useDatabaseStore()
const planStore = usePlanStore()
const toastStore = useToastStore()

const { databases, loading } = storeToRefs(databaseStore)
const { currentPlan } = storeToRefs(planStore)

const selectedEngine = ref<DatabaseEngine | 'all'>('all')
const showCreateModal = ref(false)
const showCredentialsModal = ref(false)
const showDeleteDialog = ref(false)
const showDeactivateDialog = ref(false)
const showActivateDialog = ref(false)
const selectedDatabaseId = ref<string | null>(null)
const databaseToDelete = ref<string | null>(null)
const databaseToDeactivate = ref<string | null>(null)
const databaseToActivate = ref<string | null>(null)

const filteredDatabases = computed(() => {
  if (selectedEngine.value === 'all') return databases.value
  return databases.value.filter((db) => db.engine === selectedEngine.value)
})

const usedCount = computed(() => {
  const filtered = selectedEngine.value === 'all' 
    ? databases.value 
    : databases.value.filter((db) => db.engine === selectedEngine.value)
  // Contar solo bases activas
  return filtered.filter((db) => db.status === 'active').length
})

const canCreate = computed(() => {
  if (!currentPlan.value) return true
  if (selectedEngine.value === 'all') return true
  return planStore.canCreateDatabase(selectedEngine.value)
})

function getStatusVariant(status: DatabaseStatus) {
  const variants: Record<DatabaseStatus, 'success' | 'warning' | 'error' | 'info'> = {
    active: 'success',
    inactive: 'info',
    creating: 'warning',
    stopped: 'info',
    error: 'error',
    deleting: 'warning',
  }
  return variants[status] || 'info'
}

function getStatusLabel(status: DatabaseStatus): string {
  const labels: Record<DatabaseStatus, string> = {
    active: 'Activo',
    inactive: 'Desactivada',
    creating: 'Creando',
    stopped: 'Detenida',
    error: 'Error',
    deleting: 'Eliminando',
  }
  return labels[status] || status
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES')
}

function showCredentials(dbId: string) {
  selectedDatabaseId.value = dbId
  showCredentialsModal.value = true
}

function confirmDelete(dbId: string) {
  databaseToDelete.value = dbId
  showDeleteDialog.value = true
}

function confirmDeactivate(dbId: string) {
  databaseToDeactivate.value = dbId
  showDeactivateDialog.value = true
}

function confirmActivate(dbId: string) {
  databaseToActivate.value = dbId
  showActivateDialog.value = true
}

async function handleDelete() {
  if (!databaseToDelete.value) return
  try {
    await databaseStore.deleteDatabase(databaseToDelete.value)
    toastStore.success('Base de datos eliminada', 'La base de datos ha sido eliminada correctamente')
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'No se pudo eliminar la base de datos'
    toastStore.error('Error', errorMessage)
  } finally {
    databaseToDelete.value = null
    showDeleteDialog.value = false
  }
}

async function handleDeactivate() {
  if (!databaseToDeactivate.value) return
  try {
    await databaseStore.deactivateDatabase(databaseToDeactivate.value)
    toastStore.success('Base de datos desactivada', 'La base de datos ha sido desactivada correctamente')
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'No se pudo desactivar la base de datos'
    toastStore.error('Error', errorMessage)
  } finally {
    databaseToDeactivate.value = null
    showDeactivateDialog.value = false
  }
}

async function handleActivate() {
  if (!databaseToActivate.value) return
  try {
    await databaseStore.activateDatabase(databaseToActivate.value)
    toastStore.success('Base de datos activada', 'La base de datos ha sido activada correctamente')
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'No se pudo activar la base de datos'
    if (error?.response?.status === 409) {
      toastStore.error('Límite alcanzado', errorMessage)
    } else {
      toastStore.error('Error', errorMessage)
    }
  } finally {
    databaseToActivate.value = null
    showActivateDialog.value = false
  }
}

function handleDatabaseCreated() {
  databaseStore.fetchDatabases()
  showCreateModal.value = false
}

function handleCredentialsRotated() {
  databaseStore.fetchDatabases()
}

// Watch for engine query param
watch(
  () => route.query.engine,
  (engine) => {
    if (engine && typeof engine === 'string') {
      selectedEngine.value = engine as DatabaseEngine
    }
  },
  { immediate: true }
)

onMounted(async () => {
  // Load mock data - Backend will be implemented later
  try {
    await Promise.all([
      databaseStore.fetchDatabases(),
      planStore.fetchPlan(),
    ])
  } catch (error) {
    // Silently fail - using mock data
    console.log('Using mock data - backend not available yet')
  }
})
</script>

<style scoped>
@keyframes floatParticle {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  50% {
    transform: translateY(-100px) translateX(50px) scale(1.5);
    opacity: 0.6;
  }
  90% {
    opacity: 0.3;
  }
}

.floating-particle {
  animation: floatParticle infinite ease-in-out;
}

.fade-up-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.list-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.list-move {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
