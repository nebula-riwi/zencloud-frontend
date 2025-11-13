<template>
  <div class="flex items-center justify-between h-full px-4 lg:px-6 bg-black/40 backdrop-blur-md border-b border-white/5">
    <!-- Left: Breadcrumbs -->
    <div class="flex items-center space-x-4">
      <!-- Breadcrumbs with glow effects -->
      <nav class="hidden sm:flex items-center space-x-2 text-sm">
        <router-link
          to="/dashboard"
          class="flex items-center gap-1.5 text-white/70 hover:text-[#e78a53] transition-colors duration-200 group"
        >
          <Home class="h-4 w-4 transition-colors" />
          <span>Dashboard</span>
        </router-link>
        <span class="text-white/40">/</span>
        <span class="text-white font-semibold relative">
          <span class="relative z-10">{{ currentPage }}</span>
          <span class="absolute inset-0 bg-gradient-to-r from-[#e78a53]/20 to-transparent blur-xl opacity-50"></span>
        </span>
      </nav>
    </div>

    <!-- Right: Actions and profile -->
    <div class="flex items-center space-x-2">
      <!-- Settings -->
      <button
        class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e78a53]/30 transition-all duration-200 flex items-center justify-center group"
        @click="$router.push('/settings')"
      >
        <Settings class="h-4 w-4 text-white/70 group-hover:text-[#e78a53] transition-colors" />
      </button>
      
      <!-- Profile dropdown -->
      <div class="relative z-[10000]" ref="dropdownRef">
        <button
          ref="buttonRef"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e78a53]/30 transition-all duration-200 group relative z-[10001]"
          @click.stop="showDropdown = !showDropdown"
          aria-label="Menú de usuario"
          :aria-expanded="showDropdown"
        >
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#e78a53] to-[#f59a63] flex items-center justify-center shadow-lg shadow-[#e78a53]/30 ring-2 ring-[#e78a53]/20 group-hover:ring-[#e78a53]/40 transition-all">
            <span class="text-white text-sm font-semibold">
              {{ userInitials }}
            </span>
          </div>
          <ChevronDown class="h-4 w-4 text-white/70 group-hover:text-[#e78a53] transition-transform duration-300" :class="{ 'rotate-180': showDropdown }" />
        </button>
        
        <Teleport to="body">
          <Transition name="dropdown">
            <div
              v-if="showDropdown"
              data-dropdown-menu
              class="fixed rounded-xl border border-white/10 bg-black/95 backdrop-blur-md shadow-2xl overflow-hidden"
              :style="dropdownStyle"
              style="z-index: 99999;"
              @click.stop
            >
            <!-- User info at the top -->
            <div class="p-3 border-b border-white/10">
              <div class="px-2 py-1.5 text-sm font-semibold text-white truncate">{{ user?.name || 'Usuario' }}</div>
              <div class="px-2 py-0.5 text-xs text-white/60 truncate break-all" :title="user?.email || ''">{{ user?.email || '' }}</div>
            </div>
            <!-- Logout button at the bottom -->
            <div class="p-1">
              <button
                class="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-[#e78a53]/10 hover:border-[#e78a53]/30 rounded-lg transition-all duration-200 flex items-center gap-2 group border border-transparent"
                @click="handleLogout"
              >
                <LogOut class="h-4 w-4 group-hover:text-[#e78a53] transition-colors" />
                <span class="group-hover:text-[#e78a53] transition-colors">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </Transition>
        </Teleport>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth.service'
import { Home, Settings, ChevronDown, LogOut } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)
const dropdownPosition = ref({ top: 0, right: 0 })

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  const parts = user.value.name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return user.value.name[0].toUpperCase()
})

const currentPage = computed(() => {
  const path = router.currentRoute.value.path
  if (path.includes('databases')) return 'Bases de Datos'
  if (path.includes('billing')) return 'Facturación'
  if (path.includes('webhooks')) return 'Webhooks'
  if (path.includes('sql-editor')) return 'SQL Editor'
  if (path.includes('settings')) return 'Configuración'
  return 'Dashboard'
})

const updateDropdownPosition = () => {
  if (buttonRef.value) {
    const rect = buttonRef.value.getBoundingClientRect()
    dropdownPosition.value = {
      top: rect.bottom + window.scrollY + 8, // 8px = mt-2
      right: window.innerWidth - rect.right
    }
  }
}

const dropdownStyle = computed(() => {
  return {
    top: `${dropdownPosition.value.top}px`,
    right: `${dropdownPosition.value.right}px`,
    width: '224px' // w-56 = 224px
  }
})

watch(showDropdown, (isOpen) => {
  if (isOpen) {
    updateDropdownPosition()
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

async function handleLogout() {
  try {
    // Close dropdown first
    showDropdown.value = false
    
    // Logout from service
    await authService.logout()
    
    // Clear auth store (redundant but ensures clean state)
    authStore.clearAuth()
    
    // Redirect to home with login modal
    router.push({ name: 'Home', query: { action: 'login' } })
  } catch (error) {
    console.error('Logout error:', error)
    // Even if logout fails, clear local auth and redirect
    authStore.clearAuth()
    showDropdown.value = false
    router.push({ name: 'Home', query: { action: 'login' } })
  }
}

function handleClickOutside(event: MouseEvent) {
  if (!showDropdown.value) return
  
  const target = event.target as HTMLElement
  // Check if click is outside dropdown and button
  // Since dropdown is teleported to body, we need to check by data attribute
  const dropdownElement = document.querySelector('[data-dropdown-menu]')
  
  const isClickOnButton = buttonRef.value?.contains(target)
  const isClickOnDropdown = dropdownElement?.contains(target)
  
  if (!isClickOnButton && !isClickOnDropdown) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Ensure dropdown is above all content */
.relative {
  position: relative;
  z-index: 1000;
}
</style>

