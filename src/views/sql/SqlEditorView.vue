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

      <!-- Header with advanced styling -->
      <Transition name="fade-up" appear>
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-1 h-12 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
            <div>
              <h1 class="text-5xl font-bold text-white mb-2 tracking-tight" style="text-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 90px rgba(255, 255, 255, 0.2);">
                SQL Editor
              </h1>
              <p class="text-white/70 text-lg">Ejecuta consultas SQL en tus bases de datos</p>
            </div>
          </div>
        </div>
      </Transition>

      <div class="flex h-[calc(100vh-12rem)] gap-6 relative z-10">
        <!-- Sidebar with enhanced styling -->
        <Transition name="fade-up" appear :delay="100">
          <Card class="w-80 flex-shrink-0 border-white/10 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent opacity-50"></div>
            <CardHeader class="relative z-10 border-b border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-1 h-8 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
                <CardTitle class="text-xl text-white" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">Bases de Datos</CardTitle>
              </div>
            </CardHeader>
            <CardContent class="relative z-10 pt-6 overflow-y-auto max-h-[calc(100vh-20rem)]">
              <div class="space-y-3">
                <div v-for="engine in groupedDatabases" :key="engine" class="space-y-2">
                  <button
                    class="w-full text-left px-3 py-2 text-sm font-semibold text-white/90 hover:text-white rounded-lg hover:bg-white/5 transition-colors duration-200 flex items-center justify-between group"
                    @click="toggleEngine(engine)"
                  >
                    <span>{{ engine }}</span>
                    <ChevronDown 
                      class="h-4 w-4 text-white/50 transition-transform duration-200"
                      :class="{ 'rotate-180': expandedEngines.includes(engine) }"
                    />
                  </button>
                  <Transition name="expand">
                    <div v-if="expandedEngines.includes(engine)" class="ml-4 space-y-1 border-l border-white/10 pl-3">
                      <button
                        v-for="db in getDatabasesByEngine(engine)"
                        :key="db.id"
                        class="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 transition-colors duration-200 group"
                        :class="{ 
                          'bg-gradient-to-r from-[#e78a53]/20 to-[#e78a53]/10 text-[#e78a53] border border-[#e78a53]/30': selectedDb?.id === db.id,
                          'text-white/70 hover:text-white': selectedDb?.id !== db.id
                        }"
                        @click="selectDatabase(db)"
                      >
                        <div class="flex items-center gap-2">
                          <Database class="h-3 w-3" />
                          <span class="font-medium">{{ db.name }}</span>
                        </div>
                      </button>
                    </div>
                  </Transition>
                </div>
                
                <!-- Tables Section -->
                <div v-if="selectedDb" class="pt-4 border-t border-white/10 mt-4">
                  <div class="flex items-center justify-between mb-3 px-3">
                    <h3 class="text-sm font-semibold text-white/90">Tablas</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="loadTables"
                      :loading="loadingTables"
                      class="h-6 px-2 text-xs text-white/60 hover:text-white"
                    >
                      <RefreshCw class="h-3 w-3" :class="{ 'animate-spin': loadingTables }" />
                    </Button>
                  </div>
                  <div v-if="loadingTables" class="px-3 text-xs text-white/50">
                    Cargando tablas...
                  </div>
                  <div v-else-if="tables.length === 0" class="px-3 text-xs text-white/50">
                    No hay tablas
                  </div>
                  <div v-else class="space-y-1">
                    <button
                      v-for="table in tables"
                      :key="table.name"
                      class="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 transition-colors duration-200 group flex items-center justify-between"
                      @click="insertTableName(table.name)"
                    >
                      <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-[#e78a53]"></div>
                        <span class="font-mono text-white/80 group-hover:text-white">{{ table.name }}</span>
                      </div>
                      <span v-if="table.rowCount !== undefined" class="text-xs text-white/40">
                        {{ table.rowCount.toLocaleString() }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Transition>

        <!-- Editor with enhanced styling -->
        <div class="flex-1 flex flex-col gap-6">
          <Transition name="fade-up" appear :delay="200">
            <Card class="border-white/10 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent opacity-50"></div>
              <CardHeader class="relative z-10 border-b border-white/10">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-1 h-8 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
                    <CardTitle class="text-xl text-white" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">Editor de Consultas</CardTitle>
                  </div>
                  <div class="flex gap-2">
                    <Button 
                      variant="outline" 
                      @click="clear"
                      class="border-white/10 hover:border-[#e78a53]/40 hover:bg-white/5"
                    >
                      Limpiar
                    </Button>
                    <button
                      @click="executeQuery" 
                      :disabled="!selectedDb || !queryText.trim() || isRunning"
                      class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:to-[#e78a53] shadow-lg shadow-[#e78a53]/50 hover:shadow-[#e78a53]/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e78a53] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#e78a53] disabled:hover:to-[#f59a63]"
                    >
                      <span v-if="isRunning" class="mr-2">
                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Ejecutar
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="relative z-10 pt-6">
                <div class="flex flex-col h-[calc(100vh-20rem)] gap-6">
                  <!-- Query Editor -->
                  <div class="flex flex-col flex-1 min-h-0">
                    <label class="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                      <Terminal class="h-4 w-4 text-[#e78a53]" />
                      Consulta SQL
                    </label>
                    <textarea
                      v-model="queryText"
                      class="flex-1 font-mono text-sm p-4 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all"
                      placeholder="SELECT * FROM table_name;"
                    />
                  </div>

                  <!-- Results -->
                  <div class="flex flex-col flex-1 min-h-0">
                    <label class="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                      <Database class="h-4 w-4 text-[#e78a53]" />
                      Resultados
                    </label>
                    <div class="flex-1 border border-white/10 rounded-xl p-4 overflow-auto bg-black/30 backdrop-blur-sm">
                      <div v-if="!results" class="text-white/50 text-sm h-full flex items-center justify-center">
                        Ejecuta una consulta para ver los resultados
                      </div>
                      <div v-else-if="results.error" class="text-red-400 text-sm p-4 rounded-lg bg-red-950/20 border border-red-500/30">
                        <div class="flex items-center gap-2 mb-2">
                          <AlertCircle class="h-4 w-4" />
                          <span class="font-semibold">Error</span>
                        </div>
                        {{ results.error }}
                      </div>
                      <div v-else-if="results.data" class="space-y-3">
                        <div v-if="results.affectedRows !== undefined" class="text-sm text-white/60 mb-3 p-2 rounded-lg bg-white/5">
                          Filas afectadas: <span class="font-semibold text-[#e78a53]">{{ results.affectedRows }}</span>
                        </div>
                        <div class="overflow-x-auto rounded-lg border border-white/10">
                          <table class="w-full text-xs border-collapse bg-black/20">
                            <thead>
                              <tr class="border-b border-white/10 bg-white/5">
                                <th v-for="key in Object.keys(results.data[0] || {})" :key="key" class="text-left p-3 text-white/90 font-semibold">
                                  {{ key }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, idx) in results.data" :key="idx" class="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td v-for="key in Object.keys(row)" :key="key" class="p-3 text-white/80 font-mono text-xs">
                                  {{ typeof row[key] === 'object' ? JSON.stringify(row[key], null, 2) : row[key] }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Transition>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useSqlStore } from '@/stores/sql'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import { Database, Terminal, ChevronDown, AlertCircle, RefreshCw } from 'lucide-vue-next'
import type { Database as DatabaseType } from '@/types'
import { storeToRefs } from 'pinia'

const databaseStore = useDatabaseStore()
const sqlStore = useSqlStore()

const { databases } = storeToRefs(databaseStore)
const { selectedDb, queryText, isRunning, results, tables, loadingTables } = storeToRefs(sqlStore)

const expandedEngines = ref<string[]>([])

const groupedDatabases = computed(() => {
  const engines = new Set(databases.value.map((db) => db.engine))
  return Array.from(engines)
})

function getDatabasesByEngine(engine: string) {
  return databases.value.filter((db) => db.engine === engine)
}

function toggleEngine(engine: string) {
  const index = expandedEngines.value.indexOf(engine)
  if (index > -1) {
    expandedEngines.value.splice(index, 1)
  } else {
    expandedEngines.value.push(engine)
  }
}

async function selectDatabase(db: DatabaseType) {
  sqlStore.selectDatabase(db)
  // Load tables when database is selected
  if (db) {
    await loadTables()
  }
}

async function loadTables() {
  if (selectedDb.value) {
    await sqlStore.fetchTables(selectedDb.value)
  }
}

function insertTableName(tableName: string) {
  if (queryText.value.trim()) {
    queryText.value += ` ${tableName}`
  } else {
    queryText.value = `SELECT * FROM ${tableName};`
  }
}

watch(selectedDb, (db) => {
  if (db && !expandedEngines.value.includes(db.engine)) {
    expandedEngines.value.push(db.engine)
  }
  // Load tables when database changes
  if (db) {
    loadTables()
  } else {
    sqlStore.tables = []
  }
})

async function executeQuery() {
  if (!selectedDb.value || !queryText.value.trim()) return
  try {
    await sqlStore.runQuery(queryText.value, selectedDb.value)
  } catch (error: any) {
    console.error('Error executing query:', error)
  }
}

function clear() {
  sqlStore.clear()
}

onMounted(async () => {
  // Load mock data - Backend will be implemented later
  try {
    await databaseStore.fetchDatabases()
    sqlStore.loadSelectedDatabase(databases.value)
    if (databases.value.length > 0) {
      expandedEngines.value = groupedDatabases.value
    }
    // Load tables if a database is selected
    if (selectedDb.value) {
      await loadTables()
    }
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

.expand-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
