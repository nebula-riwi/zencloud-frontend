<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-full z-40 bg-black/60 backdrop-blur-xl border-r border-white/10 transition-all duration-300 shadow-2xl',
      props.menuState === 'collapsed' ? 'w-16' : 'w-64',
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center px-4 border-b border-white/10">
        <Transition name="fade-slide-smooth" mode="out-in">
          <router-link
            v-if="props.menuState !== 'collapsed'"
            key="full-logo"
            to="/dashboard"
            class="flex items-center gap-2 group"
          >
            <span class="text-xl font-bold">
              <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">Zen</span>
              <span class="text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">Cloud</span>
            </span>
          </router-link>
          <router-link
            v-else
            key="collapsed-logo"
            to="/dashboard"
            class="flex items-center justify-center"
          >
            <span class="text-lg font-bold">
              <span class="text-[#e78a53]" style="text-shadow: 0 0 20px rgba(231, 138, 83, 0.7), 0 0 40px rgba(231, 138, 83, 0.5);">Z</span>
              <span class="text-white" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3);">C</span>
            </span>
          </router-link>
        </Transition>
      </div>

      <!-- Navigation with enhanced styling -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="group flex items-center rounded-xl text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden"
          :style="{
            gap: props.menuState === 'collapsed' ? '0' : '0.75rem',
            padding: '0.625rem 0.75rem',
            justifyContent: props.menuState === 'collapsed' ? 'center' : 'flex-start'
          }"
          :class="{
            'bg-gradient-to-r from-[#e78a53]/20 to-[#e78a53]/10 text-[#e78a53] border border-[#e78a53]/30 shadow-lg shadow-[#e78a53]/10': $route.path.startsWith(item.path),
            'text-white/70 hover:text-white hover:bg-white/5': !$route.path.startsWith(item.path),
          }"
          @mouseenter.stop
          @mouseleave.stop
        >
          <!-- Active indicator -->
          <div
            v-if="$route.path.startsWith(item.path)"
            class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e78a53] to-[#f59a63] rounded-r-full shadow-lg shadow-[#e78a53]/50 transition-opacity duration-300"
          />
          <component
            :is="item.icon"
            class="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out relative z-10"
            :class="{
              'text-[#e78a53]': $route.path.startsWith(item.path),
              'group-hover:text-[#e78a53]': !$route.path.startsWith(item.path),
            }"
            :style="{
              filter: $route.path.startsWith(item.path) 
                ? 'drop-shadow(0 0 20px rgba(231, 138, 83, 0.9)) drop-shadow(0 0 40px rgba(231, 138, 83, 0.7)) drop-shadow(0 0 60px rgba(231, 138, 83, 0.5))'
                : 'drop-shadow(0 0 4px rgba(231, 138, 83, 0.4))',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }"
          />
          <Transition name="fade-slide-smooth" mode="out-in">
            <span
              v-if="props.menuState !== 'collapsed'"
              key="label"
              class="relative z-10 whitespace-nowrap"
              :class="{
                'font-semibold': $route.path.startsWith(item.path),
              }"
            >
              {{ item.label }}
            </span>
          </Transition>
        </router-link>
      </nav>
      
      <!-- Menu toggle button at bottom when collapsed -->
      <div v-if="props.menuState === 'collapsed'" class="p-4 border-t border-white/10">
        <button
          @click="toggleMenu"
          class="w-full flex items-center justify-center h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e78a53]/30 transition-colors duration-200"
        >
          <Menu class="h-5 w-5 text-white/70 hover:text-[#e78a53] transition-colors" />
        </button>
      </div>
      
      <!-- Menu toggle button in nav when expanded -->
      <div v-else class="p-4 border-t border-white/10">
        <button
          @click="toggleMenu"
          class="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e78a53]/30 transition-colors duration-200 text-sm font-medium text-white/70 hover:text-[#e78a53]"
        >
          <Menu class="h-4 w-4" />
          <span>Minimizar</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { 
  LayoutDashboard, 
  Database, 
  CreditCard, 
  Webhook, 
  Settings, 
  Terminal,
  Menu
} from 'lucide-vue-next'

interface Props {
  menuState: 'full' | 'collapsed'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:menuState': [value: 'full' | 'collapsed']
}>()

function toggleMenu() {
  const currentState = props.menuState
  const newState = currentState === 'full' ? 'collapsed' : 'full'
  emit('update:menuState', newState)
  localStorage.setItem('sidebar_state', newState)
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/databases', label: 'Bases de Datos', icon: Database },
  { path: '/billing', label: 'Facturación', icon: CreditCard },
  { path: '/webhooks', label: 'Webhooks', icon: Webhook },
  { path: '/sql-editor', label: 'SQL Editor', icon: Terminal },
  { path: '/settings', label: 'Configuración', icon: Settings },
]

</script>

<style scoped>
.fade-slide-smooth-enter-active,
.fade-slide-smooth-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-smooth-enter-from {
  opacity: 0;
  transform: translateX(-15px) scale(0.95);
  max-width: 0;
  width: 0;
}

.fade-slide-smooth-leave-to {
  opacity: 0;
  transform: translateX(-15px) scale(0.95);
  max-width: 0;
  width: 0;
}

.fade-slide-smooth-enter-to,
.fade-slide-smooth-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
  max-width: 200px;
  width: auto;
}
</style>

