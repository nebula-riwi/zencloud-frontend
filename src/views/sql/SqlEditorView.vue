<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="w-1 h-10 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
        <div>
          <h1 class="text-3xl font-bold text-white">SQL Editor</h1>
          <p class="text-white/60 text-sm">Ejecuta consultas SQL en tus bases de datos</p>
        </div>
      </div>

      <!-- Grid Layout: 3 columnas en desktop, stack en mobile -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        <!-- Sidebar: Bases de Datos y Tablas -->
        <Card class="lg:col-span-3 border-white/10">
          <CardHeader class="border-b border-white/10 pb-4">
            <CardTitle class="text-lg text-white flex items-center gap-2">
              <Database class="h-5 w-5 text-[#e78a53]" />
              Bases de Datos
            </CardTitle>
          </CardHeader>
          <CardContent class="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            <p v-if="databases.length > sqlDatabases.length" class="text-xs text-white/50">
              Mostrando solo MySQL y PostgreSQL
            </p>
            <div v-if="sqlDatabases.length === 0" class="text-center text-white/50 text-sm py-8">
              No hay bases de datos SQL
            </div>
            
            <!-- Databases List -->
            <div class="space-y-2">
              <div v-for="engine in groupedDatabases" :key="engine" class="space-y-1">
                <button
                  class="w-full text-left px-3 py-2 text-sm font-semibold text-white/90 rounded-lg hover:bg-white/5 flex items-center justify-between"
                  @click="toggleEngine(engine)"
                >
                  <span>{{ engine }}</span>
                  <ChevronDown 
                    class="h-4 w-4 text-white/50 transition-transform"
                    :class="{ 'rotate-180': expandedEngines.includes(engine) }"
                  />
                </button>
                <div v-if="expandedEngines.includes(engine)" class="ml-4 space-y-1 pl-3 border-l border-white/10">
                  <button
                    v-for="db in getDatabasesByEngine(engine)"
                    :key="db.id"
                    class="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5"
                    :class="{ 
                      'bg-[#e78a53]/20 text-[#e78a53] border border-[#e78a53]/30': selectedDb?.id === db.id,
                      'text-white/70': selectedDb?.id !== db.id
                    }"
                    @click="selectDatabase(db)"
                  >
                    <div class="flex items-center gap-2">
                      <Database class="h-3 w-3" />
                      <span>{{ db.name }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Tables Section -->
            <div v-if="selectedDb" class="pt-4 border-t border-white/10">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#e78a53] rounded-full"></div>
                  Tablas ({{ tables.length }})
                </h3>
                <button
                  @click="loadTables"
                  :disabled="loadingTables"
                  class="p-1 rounded hover:bg-white/5 text-white/60 hover:text-white"
                  title="Actualizar"
                >
                  <RefreshCw class="h-3 w-3" :class="{ 'animate-spin': loadingTables }" />
                </button>
              </div>
              
              <div v-if="loadingTables" class="text-center py-4">
                <RefreshCw class="h-4 w-4 animate-spin text-white/50 mx-auto" />
              </div>
              
              <div v-else-if="tables.length === 0" class="text-center py-4">
                <p class="text-xs text-white/50">No hay tablas</p>
              </div>
              
              <div v-else class="space-y-1 max-h-64 overflow-y-auto">
                <button
                  v-for="table in tables"
                  :key="table.name"
                  class="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-[#e78a53]/10 hover:border-[#e78a53]/20 border border-transparent flex items-center justify-between"
                  @click="insertTableName(table.name)"
                >
                  <span class="font-mono text-white/80">{{ table.name }}</span>
                  <span v-if="table.rowCount !== undefined" class="text-xs text-white/40">
                    {{ table.rowCount.toLocaleString() }}
                  </span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Main Content: Editor + Results -->
        <div class="lg:col-span-6 space-y-4">
          
          <!-- SQL Editor Card -->
          <Card class="border-white/10">
            <CardHeader class="border-b border-white/10 pb-4">
              <div class="flex items-center justify-between">
                <CardTitle class="text-lg text-white flex items-center gap-2">
                  <Terminal class="h-5 w-5 text-[#e78a53]" />
                  Editor de Consultas
                </CardTitle>
                <div class="flex gap-2">
                  <Button 
                    variant="outline" 
                    @click="clear"
                    size="sm"
                    class="border-white/20 hover:bg-white/5"
                  >
                    Limpiar
                  </Button>
                  <Button 
                    @click="executeQuery" 
                    :loading="isRunning"
                    :disabled="!selectedDb || !queryText.trim()"
                    size="sm"
                    class="bg-[#e78a53] hover:bg-[#f59a63] text-white"
                  >
                    Ejecutar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent class="p-4">
              <textarea
                v-model="queryText"
                class="w-full h-32 font-mono text-sm p-3 rounded-lg border border-white/10 bg-black/30 text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50"
                placeholder="SELECT * FROM table_name;"
              />
            </CardContent>
          </Card>

          <!-- Results Card -->
          <Card class="border-white/10">
            <CardHeader class="border-b border-white/10 pb-4">
              <CardTitle class="text-lg text-white flex items-center gap-2">
                <Database class="h-5 w-5 text-[#e78a53]" />
                Resultados
              </CardTitle>
            </CardHeader>
            <CardContent class="p-4">
              <div class="min-h-[300px] max-h-[500px] overflow-auto">
                
                <!-- Empty State -->
                <div v-if="!results" class="flex items-center justify-center h-full text-white/50 text-sm">
                  Ejecuta una consulta para ver los resultados
                </div>
                
                <!-- Error State -->
                <div v-else-if="results.error" class="space-y-3">
                  <div class="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div class="flex items-start gap-3">
                      <AlertCircle class="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div class="flex-1 space-y-2">
                        <p class="font-semibold text-amber-300 text-sm">Error en la consulta</p>
                        <p class="text-amber-200/90 text-xs font-mono break-words">{{ results.error }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <p class="text-xs text-blue-300 font-semibold mb-2">Consejos:</p>
                    <ul class="text-xs text-blue-200/80 space-y-1 list-disc list-inside">
                      <li>Verifica la sintaxis SQL para {{ selectedDb?.engine?.toUpperCase() }}</li>
                      <li>Consultas permitidas: SELECT, INSERT, UPDATE, DELETE, SHOW, etc.</li>
                      <li>No se permiten múltiples sentencias separadas por ;</li>
                    </ul>
                  </div>
                </div>
                
                <!-- Success State with Data -->
                <div v-else-if="results.data && results.data.length > 0" class="space-y-3">
                  <div class="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span class="text-xs text-emerald-300">Consulta ejecutada exitosamente</span>
                    <span v-if="results.affectedRows !== undefined" class="text-xs text-emerald-400 font-semibold">
                      {{ results.affectedRows }} filas afectadas
                    </span>
                  </div>
                  
                  <div class="overflow-x-auto rounded-lg border border-white/10">
                    <table class="w-full text-xs">
                      <thead class="bg-white/5 sticky top-0">
                        <tr class="border-b border-white/10">
                          <th v-for="key in Object.keys(results.data[0])" :key="key" class="text-left p-3 text-white/90 font-semibold">
                            {{ key }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, idx) in results.data" :key="idx" class="border-b border-white/5 hover:bg-white/5">
                          <td v-for="key in Object.keys(row)" :key="key" class="p-3 text-white/80 font-mono">
                            {{ typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key] }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <!-- Success State without Data -->
                <div v-else-if="results.success" class="flex items-center justify-center h-full">
                  <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p class="text-emerald-300 text-sm">Consulta ejecutada exitosamente</p>
                    <p v-if="results.affectedRows !== undefined" class="text-emerald-400/80 text-xs mt-1">
                      {{ results.affectedRows }} filas afectadas
                    </p>
                  </div>
                </div>
                
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- History Sidebar -->
        <Card class="lg:col-span-3 border-white/10">
          <CardHeader class="border-b border-white/10 pb-4">
            <div class="flex items-center justify-between">
              <CardTitle class="text-lg text-white flex items-center gap-2">
                <Terminal class="h-5 w-5 text-[#e78a53]" />
                Historial
              </CardTitle>
              <Badge v-if="history.length" variant="outline" class="border-white/20 text-white/70 text-xs">
                {{ history.length }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            <div v-if="history.length === 0" class="text-center text-white/50 text-sm py-8">
              No hay consultas registradas
            </div>
            
            <div
              v-for="item in history"
              :key="item.id"
              class="p-3 rounded-lg border border-white/10 bg-black/20 space-y-2"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="text-white/50">{{ formatHistoryDate(item.executedAt) }}</span>
                <Badge 
                  :class="item.success ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'"
                  class="text-xs px-2 py-0.5"
                >
                  {{ item.success ? 'OK' : 'Error' }}
                </Badge>
              </div>
              
              <code class="text-white/80 text-xs font-mono block break-words">{{ item.query }}</code>
              
              <div class="flex items-center gap-2 text-xs text-white/50">
                <span v-if="item.rowCount !== undefined">{{ item.rowCount }} filas</span>
                <span v-if="item.executionTimeMs">• {{ Number(item.executionTimeMs).toFixed(2) }} ms</span>
              </div>
              
              <p v-if="item.error" class="text-xs text-amber-300/80 font-mono">{{ item.error }}</p>
            </div>
          </CardContent>
        </Card>

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
import Badge from '@/components/ui/Badge.vue'
import { Database, Terminal, ChevronDown, AlertCircle, RefreshCw } from 'lucide-vue-next'
import type { Database as DatabaseType, DatabaseEngine } from '@/types'
import { storeToRefs } from 'pinia'

const databaseStore = useDatabaseStore()
const sqlStore = useSqlStore()

const { databases } = storeToRefs(databaseStore)
const { selectedDb, queryText, isRunning, results, tables, loadingTables, history } = storeToRefs(sqlStore)

const expandedEngines = ref<string[]>([])
const SQL_ENGINES: DatabaseEngine[] = ['mysql', 'postgresql']

const sqlDatabases = computed(() => databases.value.filter((db) => SQL_ENGINES.includes(db.engine)))

const groupedDatabases = computed(() => {
  const engines = new Set(sqlDatabases.value.map((db) => db.engine))
  return Array.from(engines)
})

function getDatabasesByEngine(engine: string) {
  return sqlDatabases.value.filter((db) => db.engine === engine)
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
  await sqlStore.selectDatabase(db)
  if (db) {
    await loadTables()
  } else {
    sqlStore.tables = []
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

watch(selectedDb, async (db) => {
  if (db && !expandedEngines.value.includes(db.engine)) {
    expandedEngines.value.push(db.engine)
  }
  if (db) {
    await loadTables()
  } else {
    sqlStore.tables = []
    history.value = []
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

function formatHistoryDate(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
}

onMounted(async () => {
  try {
    await databaseStore.fetchDatabases()
    await sqlStore.loadSelectedDatabase(databases.value)
    if (databases.value.length > 0) {
      expandedEngines.value = groupedDatabases.value
    }
    if (selectedDb.value) {
      await sqlStore.fetchTables(selectedDb.value)
    }
  } catch (error) {
    console.error('No se pudieron cargar las bases de datos:', error)
  }
})
</script>

<style scoped>
/* Beautiful scrollbar with better visibility */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  margin: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(231, 138, 83, 0.7) 0%, rgba(245, 154, 99, 0.8) 100%);
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px rgba(231, 138, 83, 0.4);
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(231, 138, 83, 0.9) 0%, rgba(245, 154, 99, 1) 100%);
  box-shadow: 0 0 15px rgba(231, 138, 83, 0.6), 0 0 25px rgba(231, 138, 83, 0.3);
  border-color: rgba(231, 138, 83, 0.3);
}

::-webkit-scrollbar-thumb:active {
  background: linear-gradient(180deg, rgba(214, 122, 67, 1) 0%, rgba(231, 138, 83, 1) 100%);
  box-shadow: 0 0 20px rgba(231, 138, 83, 0.8);
}
</style>
