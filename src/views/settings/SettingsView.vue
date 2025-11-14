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
                Configuración
              </h1>
              <p class="text-white/70 text-lg">Gestiona tu perfil y preferencias de cuenta</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Profile Card with enhanced styling -->
      <Transition name="fade-up" appear :delay="100">
        <Card class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-300"></div>
          <CardHeader class="relative z-10 border-b border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 shadow-lg shadow-[#e78a53]/20">
                <User class="w-5 h-5 text-[#e78a53]" />
              </div>
              <div>
                <CardTitle class="text-2xl text-white" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">Perfil</CardTitle>
                <CardDescription class="text-white/60 mt-1">
                  Información personal de tu cuenta
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="relative z-10 space-y-5 pt-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-white/90 flex items-center gap-2">
                <User class="w-4 h-4 text-[#e78a53]" />
                Nombre
              </label>
              <Input
                v-model="profileData.name"
                :disabled="true"
                class="bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-[#e78a53]/50 focus:ring-[#e78a53]/20"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-white/90 flex items-center gap-2">
                <Mail class="w-4 h-4 text-[#e78a53]" />
                Email
              </label>
              <Input
                v-model="profileData.email"
                type="email"
                :disabled="true"
                class="bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-[#e78a53]/50 focus:ring-[#e78a53]/20"
              />
            </div>
          </CardContent>
        </Card>
      </Transition>

      <!-- Preferences Card with enhanced styling -->
      <Transition name="fade-up" appear :delay="200">
        <Card class="group relative overflow-hidden border-white/10 hover:border-[#e78a53]/40 transition-colors duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/0 to-[#e78a53]/0 group-hover:from-[#e78a53]/5 group-hover:to-transparent transition-all duration-300"></div>
          <CardHeader class="relative z-10 border-b border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 shadow-lg shadow-[#e78a53]/20">
                <SettingsIcon class="w-5 h-5 text-[#e78a53]" />
              </div>
              <div>
                <CardTitle class="text-2xl text-white" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">Preferencias</CardTitle>
                <CardDescription class="text-white/60 mt-1">
                  Personaliza tu experiencia en ZenCloud
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="relative z-10 pt-6">
            <div class="flex items-center justify-between p-5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 hover:border-[#e78a53]/30 transition-all duration-300">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <Bell class="w-5 h-5 text-[#e78a53]" />
                  <label class="text-sm font-semibold text-white">Notificaciones por Email</label>
                </div>
                <p class="text-xs text-white/60 ml-7">Recibe notificaciones por correo electrónico sobre tus bases de datos</p>
              </div>
              <Switch
                v-model="preferences.emailNotifications"
                @update:model-value="savePreferences"
                class="ml-4"
              />
            </div>
          </CardContent>
        </Card>
      </Transition>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserPrefsStore } from '@/stores/userPrefs'
import { useToastStore } from '@/stores/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import Switch from '@/components/ui/Switch.vue'
import { User, Mail, Bell, Settings as SettingsIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const userPrefsStore = useUserPrefsStore()
const toastStore = useToastStore()

const { user } = storeToRefs(authStore)
const { preferences } = storeToRefs(userPrefsStore)

const profileData = computed(() => ({
  name: user.value?.name || '',
  email: user.value?.email || '',
}))

async function savePreferences() {
  try {
    await userPrefsStore.updatePrefs(preferences.value)
    toastStore.success('Preferencias guardadas', 'Tus preferencias han sido actualizadas')
  } catch (error: any) {
    toastStore.error('Error', 'No se pudieron guardar las preferencias')
  }
}

onMounted(async () => {
  try {
    await userPrefsStore.fetchPrefs()
  } catch (error) {
    console.error('No fue posible cargar las preferencias del usuario:', error)
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
