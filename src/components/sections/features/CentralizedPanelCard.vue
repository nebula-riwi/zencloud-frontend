<template>
  <div class="flex grow items-center justify-center select-none relative min-h-[300px] p-2 sm:p-4">
    <div class="relative w-full max-w-lg h-[300px] sm:h-[400px]">
      <!-- Terminal-style Activity Monitor -->
      <div class="relative w-full h-full bg-black/40 backdrop-blur-md border border-[#e78a53]/30 rounded-xl overflow-hidden shadow-2xl">
        <!-- Terminal Header -->
        <div class="bg-white/5 border-b border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3">
          <div class="flex gap-1.5 flex-shrink-0">
            <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)] cursor-pointer hover:bg-red-400 transition-colors"></div>
            <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.4)] cursor-pointer hover:bg-yellow-400 transition-colors"></div>
            <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)] cursor-pointer hover:bg-green-400 transition-colors"></div>
          </div>
        </div>
        
        <!-- Activity Logs - Infinite Scroll -->
        <div
          ref="consoleScrollRef"
          class="p-2 sm:p-4 font-mono text-[10px] sm:text-xs h-[calc(100%-38px)] sm:h-[calc(100%-44px)] overflow-y-scroll overflow-x-hidden scrollbar-hide leading-tight"
          style="scrollbar-width: none; ms-overflow-style: none;"
        >
          <div ref="scrollContentRef" class="will-change-transform">
            <div v-for="(log, idx) in logs" :key="idx" class="flex items-start gap-1 sm:gap-2 flex-wrap leading-tight mb-1">
              <span class="text-white/30 text-[9px] sm:text-[10px] flex-shrink-0">{{ log.time }}</span>
              <span :class="['flex-shrink-0 font-semibold', log.statusColor]">{{ log.status }}</span>
              <span class="text-white/80 break-words max-w-full" v-html="log.message"></span>
              <span v-if="log.dot" class="text-green-400">●</span>
            </div>
            <!-- Duplicated for seamless infinite scroll -->
            <div v-for="(log, idx) in logs" :key="`dup-${idx}`" class="flex items-start gap-1 sm:gap-2 flex-wrap leading-tight mb-1">
              <span class="text-white/30 text-[9px] sm:text-[10px] flex-shrink-0">{{ log.time }}</span>
              <span :class="['flex-shrink-0 font-semibold', log.statusColor]">{{ log.status }}</span>
              <span class="text-white/80 break-words max-w-full" v-html="log.message"></span>
              <span v-if="log.dot" class="text-green-400">●</span>
            </div>
          </div>
        </div>

        <!-- Glowing effect -->
        <Transition name="fade">
          <div
            v-if="isHovering"
            class="absolute inset-0 bg-gradient-to-t from-[#e78a53]/10 via-transparent to-transparent pointer-events-none"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  isHovering?: boolean
}

withDefaults(defineProps<Props>(), {
  isHovering: false,
})

const consoleScrollRef = ref<HTMLDivElement | null>(null)
const scrollContentRef = ref<HTMLDivElement | null>(null)
let scrollPosition = 0
let scrollInterval: ReturnType<typeof setInterval> | null = null
let animationFrame: number | null = null

const logs = [
  { time: '12:04:23', status: 'SUCCESS', statusColor: 'text-green-400', message: 'MySQL created <span class="text-[#e78a53]">production_db</span>', dot: false },
  { time: '12:04:45', status: 'EMAIL', statusColor: 'text-blue-400', message: 'Credentials sent to <span class="text-blue-300">user@email.com</span>', dot: false },
  { time: '12:05:12', status: 'SUCCESS', statusColor: 'text-green-400', message: 'PostgreSQL created <span class="text-[#e78a53]">analytics_db</span>', dot: false },
  { time: '12:05:34', status: 'WEBHOOK', statusColor: 'text-purple-400', message: 'Event: <span class="text-purple-300">database.created</span>', dot: false },
  { time: '12:06:01', status: 'SUCCESS', statusColor: 'text-green-400', message: 'Redis created <span class="text-[#e78a53]">cache_db</span>', dot: false },
  { time: '12:06:15', status: 'HEALTH', statusColor: 'text-emerald-400', message: 'Health check passed <span class="text-emerald-300">production_db</span>', dot: false },
  { time: '12:06:23', status: 'UPGRADE', statusColor: 'text-[#e78a53]', message: 'Plan: <span class="text-white/40">Free</span> → <span class="text-[#e78a53]">Intermediate</span>', dot: false },
  { time: '12:06:48', status: 'API', statusColor: 'text-indigo-400', message: 'Endpoint <span class="text-indigo-300">/api/v1/databases</span> connected', dot: false },
  { time: '12:07:15', status: 'SECURITY', statusColor: 'text-yellow-400', message: 'Credentials rotated <span class="text-[#e78a53]">production_db</span>', dot: false },
  { time: '12:07:33', status: 'DEPLOY', statusColor: 'text-pink-400', message: 'Deployment started <span class="text-pink-300">v2.1.0</span>', dot: false },
  { time: '12:08:02', status: 'SCALE', statusColor: 'text-green-400', message: 'Scaled <span class="text-[#e78a53]">analytics_db</span> to <span class="text-green-300">4GB RAM</span>', dot: false },
  { time: '12:08:42', status: 'BACKUP', statusColor: 'text-cyan-400', message: 'Snapshot: <span class="text-[#e78a53]">analytics_db</span>', dot: false },
  { time: '12:08:57', status: 'WEBHOOK', statusColor: 'text-purple-400', message: 'Event: <span class="text-purple-300">backup.completed</span>', dot: false },
  { time: '12:09:18', status: 'ACTIVE', statusColor: 'text-green-400', message: 'All databases running', dot: true },
  { time: '12:09:35', status: 'USER', statusColor: 'text-blue-400', message: 'User <span class="text-blue-300">admin@zencloud.io</span> logged in', dot: false },
  { time: '12:09:51', status: 'MONITOR', statusColor: 'text-emerald-400', message: 'Performance metrics updated', dot: false },
  { time: '12:10:05', status: 'SUCCESS', statusColor: 'text-green-400', message: 'MongoDB created <span class="text-[#e78a53]">dev_db</span>', dot: false },
  { time: '12:10:20', status: 'HEALTH', statusColor: 'text-emerald-400', message: 'Health check passed <span class="text-emerald-300">dev_db</span>', dot: false },
  { time: '12:10:35', status: 'DEPLOY', statusColor: 'text-pink-400', message: 'New feature flag enabled', dot: false },
  { time: '12:10:50', status: 'SECURITY', statusColor: 'text-yellow-400', message: 'Firewall rules updated', dot: false },
  { time: '12:11:05', status: 'BACKUP', statusColor: 'text-cyan-400', message: 'Full backup initiated for all dbs', dot: false },
  { time: '12:11:20', status: 'SCALE', statusColor: 'text-green-400', message: 'Scaled <span class="text-[#e78a53]">production_db</span> to <span class="text-green-300">8GB RAM</span>', dot: false },
  { time: '12:11:35', status: 'API', statusColor: 'text-indigo-400', message: 'New API key generated', dot: false },
  { time: '12:11:50', status: 'USER', statusColor: 'text-blue-400', message: 'User <span class="text-blue-300">support@zencloud.io</span> logged out', dot: false },
  { time: '12:12:05', status: 'MONITOR', statusColor: 'text-emerald-400', message: 'CPU usage spike detected on <span class="text-[#e78a53]">reporting_db</span>', dot: false },
  { time: '12:12:20', status: 'SUCCESS', statusColor: 'text-green-400', message: 'SQL Server created <span class="text-[#e78a53]">reporting_db</span>', dot: false },
  { time: '12:12:35', status: 'EMAIL', statusColor: 'text-blue-400', message: 'Alert: High CPU usage on <span class="text-[#e78a53]">reporting_db</span>', dot: false },
  { time: '12:12:50', status: 'WEBHOOK', statusColor: 'text-purple-400', message: 'Notification sent to <span class="text-purple-300">Slack channel</span>', dot: false },
  { time: '12:13:05', status: 'HEALTH', statusColor: 'text-emerald-400', message: '<span class="text-emerald-300">reporting_db</span> health restored', dot: false },
  { time: '12:13:20', status: 'UPGRADE', statusColor: 'text-[#e78a53]', message: 'OS patch applied to host servers', dot: false },
  { time: '12:13:35', status: 'SECURITY', statusColor: 'text-yellow-400', message: 'DDoS protection activated', dot: false },
  { time: '12:13:50', status: 'DEPLOY', statusColor: 'text-pink-400', message: 'Hotfix deployed to <span class="text-pink-300">production</span>', dot: false },
  { time: '12:14:05', status: 'SCALE', statusColor: 'text-green-400', message: 'Read replicas added to <span class="text-[#e78a53]">production_db</span>', dot: false },
  { time: '12:14:20', status: 'BACKUP', statusColor: 'text-cyan-400', message: 'Incremental backup completed', dot: false },
  { time: '12:14:35', status: 'ACTIVE', statusColor: 'text-green-400', message: 'All systems nominal', dot: true },
]

const animateScroll = () => {
  if (!consoleScrollRef.value || !scrollContentRef.value) {
    animationFrame = requestAnimationFrame(animateScroll)
    return
  }

  const containerHeight = consoleScrollRef.value.clientHeight
  const contentHeight = scrollContentRef.value.scrollHeight
  const singleContentHeight = contentHeight / 2 // Each set of logs
  
  if (contentHeight > containerHeight) {
    scrollPosition += 0.5 // Velocidad de scroll (ajusta según prefieras)
    
    // Reset to top when we've scrolled through one full set
    if (scrollPosition >= singleContentHeight) {
      scrollPosition = 0
    }
    
    consoleScrollRef.value.scrollTop = scrollPosition
  }
  
  animationFrame = requestAnimationFrame(animateScroll)
}

onMounted(() => {
  const initScroll = () => {
    if (!consoleScrollRef.value || !scrollContentRef.value) {
      setTimeout(initScroll, 100)
      return
    }

    const containerHeight = consoleScrollRef.value.clientHeight
    const contentHeight = scrollContentRef.value.scrollHeight

    if (contentHeight <= containerHeight || containerHeight === 0) {
      setTimeout(initScroll, 100)
      return
    }

    // Start smooth infinite scroll
    animateScroll()
  }

  setTimeout(initScroll, 300)
})

onUnmounted(() => {
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

