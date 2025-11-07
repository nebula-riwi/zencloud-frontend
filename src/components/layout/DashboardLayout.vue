<template>
  <div class="flex h-screen bg-black relative overflow-hidden">
    <!-- Background effects -->
    <div
      class="absolute inset-0 z-0"
      style="background: radial-gradient(ellipse 50% 35% at 50% 0%, rgba(231, 138, 83, 0.08), transparent 60%), #000000;"
    />
    
    <DashboardSidebar v-model:menu-state="menuState" />
    <div
      class="w-full flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0 relative z-10"
      :style="{ marginLeft: sidebarMargin }"
    >
      <header class="h-16 flex-shrink-0 relative">
        <DashboardTopNav />
      </header>
      <main class="flex-1 overflow-auto p-4 sm:p-6 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardSidebar from './DashboardSidebar.vue'
import DashboardTopNav from './DashboardTopNav.vue'

const menuState = ref<'full' | 'collapsed'>('full')
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Load saved menu state
  const saved = localStorage.getItem('sidebar_state')
  if (saved && (saved === 'full' || saved === 'collapsed')) {
    menuState.value = saved as 'full' | 'collapsed'
  } else if (saved === 'hidden') {
    // Convert old 'hidden' state to 'collapsed'
    menuState.value = 'collapsed'
    localStorage.setItem('sidebar_state', 'collapsed')
  }
})

const sidebarMargin = computed(() => {
  if (isMobile.value) return '0'
  if (menuState.value === 'collapsed') return '4rem' // 64px = 4rem (w-16) - pegado al navbar
  return '16rem' // 256px = 16rem (w-64)
})
</script>

