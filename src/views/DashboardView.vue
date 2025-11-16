<template>
  <DashboardLayout>
    <div class="space-y-8 relative">
      <!-- Animated background particles -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          v-for="i in 20"
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

      <!-- Welcome Section with advanced effects -->
      <div class="relative z-10">
        <Transition name="fade-up" appear>
          <div class="mb-8">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-1 h-12 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
              <div>
                <h1 class="text-5xl font-bold text-white mb-2 tracking-tight" style="text-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 90px rgba(255, 255, 255, 0.2);">
                  Bienvenido de vuelta, <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">{{ user?.name || 'Usuario' }}</span>
                </h1>
                <p class="text-white/70 text-lg">Gestiona tus bases de datos desde un solo lugar</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Stats Cards with advanced styling -->
      <div class="grid gap-6 md:grid-cols-3 relative z-10">
        <Transition name="fade-up" appear :delay="100">
          <Card class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300">
            <!-- Gradient overlay on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
            
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <CardTitle class="text-sm font-semibold text-white/90 uppercase tracking-wider" style="text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);">Total Bases de Datos</CardTitle>
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 transition-colors duration-300">
                <Database class="h-5 w-5 text-[#e78a53]" />
              </div>
            </CardHeader>
            <CardContent class="relative z-10">
              <div class="text-4xl font-bold text-white mb-2" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);">
                {{ totalDatabases }}
              </div>
              <p class="text-xs text-white/60 font-medium">Todas las bases de datos activas</p>
              <div class="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[#e78a53] to-[#f59a63] rounded-full" style="width: 75%"></div>
              </div>
            </CardContent>
          </Card>
        </Transition>

        <Transition name="fade-up" appear :delay="200">
          <Card class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300">
            <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
            
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <CardTitle class="text-sm font-semibold text-white/90 uppercase tracking-wider" style="text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);">Plan Actual</CardTitle>
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 transition-colors duration-300">
                <CreditCard class="h-5 w-5 text-[#e78a53]" />
              </div>
            </CardHeader>
            <CardContent class="relative z-10">
              <div class="text-4xl font-bold text-white mb-2" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);">
                {{ currentPlan?.name || 'Gratis' }}
              </div>
              <p class="text-xs text-white/60 font-medium">
                {{ currentPlan?.price === 0 ? 'Plan gratuito' : `$${currentPlan?.price}/mes` }}
              </p>
              <div class="mt-4 flex items-center gap-2">
                <div class="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-[#e78a53] to-[#f59a63] rounded-full transition-all duration-500" 
                    :style="{ width: `${Math.min(planUsagePercentage, 100)}%` }"
                  ></div>
                </div>
                <span class="text-xs text-white/50 font-medium">{{ planUsagePercentage.toFixed(0) }}%</span>
              </div>
              <p v-if="planUsageStats" class="text-xs text-white/50 mt-2">
                {{ planUsageStats.totalActive }} / {{ planUsageStats.totalLimit ?? '∞' }} bases activas
              </p>
            </CardContent>
          </Card>
        </Transition>

        <Transition name="fade-up" appear :delay="300">
          <Card class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300">
            <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
            
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <CardTitle class="text-sm font-semibold text-white/90 uppercase tracking-wider" style="text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);">Webhooks Activos</CardTitle>
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 transition-colors duration-300">
                <Webhook class="h-5 w-5 text-[#e78a53]" />
              </div>
            </CardHeader>
            <CardContent class="relative z-10">
              <div class="text-4xl font-bold text-white mb-2" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);">
                {{ activeWebhooks }}
              </div>
              <p class="text-xs text-white/60 font-medium">Webhooks configurados</p>
              <div class="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[#e78a53] to-[#f59a63] rounded-full" style="width: 45%"></div>
              </div>
            </CardContent>
          </Card>
        </Transition>
      </div>

      <!-- Engine Selection Grid with advanced effects -->
      <Transition name="fade-up" appear :delay="400">
        <Card class="relative z-10 border-white/10 overflow-hidden">
          <!-- Animated background gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent opacity-50"></div>
          
          <CardHeader class="relative z-10 border-b border-white/10">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-1 h-8 bg-gradient-to-b from-[#e78a53] to-transparent rounded-full"></div>
              <CardTitle class="text-2xl text-white" style="text-shadow: 0 0 25px rgba(255, 255, 255, 0.6), 0 0 50px rgba(255, 255, 255, 0.4), 0 0 75px rgba(255, 255, 255, 0.2);">Seleccionar Motor de Base de Datos</CardTitle>
            </div>
            <CardDescription class="text-white/70 text-base">Elige un motor para ver o crear bases de datos</CardDescription>
          </CardHeader>
          <CardContent class="relative z-10 pt-6">
            <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <button
                v-for="(engine, index) in engines"
                :key="engine.value"
                class="group relative flex flex-col items-center justify-center p-6 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40 hover:border-[#e78a53]/40 transition-colors duration-300 overflow-hidden"
                :style="{ animationDelay: `${500 + index * 100}ms` }"
                @click="goToDatabases(engine.value as DatabaseEngine)"
              >
                <!-- Hover gradient effect -->
                <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/10 group-hover:to-transparent transition-all duration-300"></div>
                
                <!-- Translucent database logo with glow -->
                <div class="relative z-10 mb-4 transition-opacity duration-300" :class="engine.shadow">
                  <img
                    :src="engine.logo"
                    :alt="engine.label"
                    class="h-16 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    @error="(e) => (e.target as HTMLImageElement).src = engine.fallback"
                    loading="lazy"
                  />
                </div>
                
                <span class="relative z-10 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  {{ engine.label }}
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </Transition>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePlanStore } from '@/stores/plan'
import { useDatabaseStore } from '@/stores/database'
// import { useWebhookStore } from '@/stores/webhook' // Deshabilitado temporalmente
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Database, CreditCard, Webhook } from 'lucide-vue-next'
import { ENGINE_FALLBACKS } from '@/composables/useImageFallback'
import type { DatabaseEngine } from '@/types'
import { storeToRefs } from 'pinia'
import { planService } from '@/services/plan.service'

const router = useRouter()
const authStore = useAuthStore()
const planStore = usePlanStore()
const databaseStore = useDatabaseStore()
// const webhookStore = useWebhookStore() // Deshabilitado temporalmente

const { user } = storeToRefs(authStore)
const { currentPlan } = storeToRefs(planStore)
const { databases } = storeToRefs(databaseStore)

const engines = [
  {
    value: 'mysql',
    label: 'MySQL',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg',
    fallback: ENGINE_FALLBACKS.mysql,
    shadow: 'drop-shadow-[0_0_15px_rgba(0,117,143,0.7)] hover:drop-shadow-[0_0_20px_rgba(0,117,143,0.9)]',
  },
  {
    value: 'postgresql',
    label: 'PostgreSQL',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg',
    fallback: ENGINE_FALLBACKS.postgresql,
    shadow: 'drop-shadow-[0_0_15px_rgba(51,103,145,0.7)] hover:drop-shadow-[0_0_20px_rgba(51,103,145,0.9)]',
  },
  {
    value: 'mongodb',
    label: 'MongoDB',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg',
    fallback: ENGINE_FALLBACKS.mongodb,
    shadow: 'drop-shadow-[0_0_15px_rgba(71,162,72,0.7)] hover:drop-shadow-[0_0_20px_rgba(71,162,72,0.9)]',
  },
  {
    value: 'sqlserver',
    label: 'SQL Server',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain-wordmark.svg',
    fallback: ENGINE_FALLBACKS.sqlserver,
    shadow: 'drop-shadow-[0_0_15px_rgba(204,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(204,0,0,0.9)]',
  },
  {
    value: 'redis',
    label: 'Redis',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original-wordmark.svg',
    fallback: ENGINE_FALLBACKS.redis,
    shadow: 'drop-shadow-[0_0_15px_rgba(220,50,47,0.7)] hover:drop-shadow-[0_0_20px_rgba(220,50,47,0.9)]',
  },
  {
    value: 'cassandra',
    label: 'Cassandra',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Cassandra_logo.svg',
    fallback: ENGINE_FALLBACKS.cassandra,
    shadow: 'drop-shadow-[0_0_15px_rgba(28,101,221,0.7)] hover:drop-shadow-[0_0_20px_rgba(28,101,221,0.9)]',
  },
]

const totalDatabases = computed(() => databases.value.length)
const activeWebhooks = computed(() => 0) // Webhooks deshabilitados temporalmente

const planUsageStats = ref<{
  totalActive: number
  totalLimit: number | null
  globalPercentage: number
} | null>(null)

const planUsagePercentage = computed(() => {
  if (!planUsageStats.value) return 0
  return planUsageStats.value.globalPercentage
})

function goToDatabases(engine: DatabaseEngine) {
  router.push(`/databases?engine=${engine}`)
}

// Watcher para actualizar cuando cambie el plan
watch(() => currentPlan.value, async (newPlan, oldPlan) => {
  // Si el plan cambió, refrescar los datos
  if (newPlan && oldPlan && newPlan.id !== oldPlan.id) {
    try {
      await databaseStore.fetchDatabases()
    } catch (error) {
      console.error('Error actualizando bases de datos después del cambio de plan:', error)
    }
  }
}, { deep: true })

onMounted(async () => {
  try {
    await Promise.all([
      planStore.fetchPlan(),
      databaseStore.fetchDatabases(),
      planService.fetchUsageStats().then(stats => {
        planUsageStats.value = {
          totalActive: stats.totalActive,
          totalLimit: stats.totalLimit,
          globalPercentage: stats.globalPercentage,
        }
      }).catch(() => {
        console.warn('No se pudieron cargar las estadísticas de uso')
      }),
      // webhookStore.fetchWebhooks().catch(() => {
      //   console.warn('Webhooks deshabilitados temporalmente')
      // }),
    ])
  } catch (error) {
    console.error('No fue posible cargar la información del dashboard:', error)
  }
  
  // Verificar si se regresó de un pago exitoso
  const params = new URLSearchParams(window.location.search)
  const statusParam = params.get('status') || params.get('collection_status')
  
  if (statusParam === 'approved') {
    // Actualizar el plan después de un pago exitoso
    try {
      await planStore.fetchPlan()
      await databaseStore.fetchDatabases()
    } catch (error) {
      console.error('Error actualizando plan después del pago:', error)
    }
    
    // Limpiar la URL
    window.history.replaceState(null, '', window.location.pathname)
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
</style>
