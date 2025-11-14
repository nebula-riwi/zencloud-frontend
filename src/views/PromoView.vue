<template>
  <div class="min-h-screen w-full relative bg-black overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse 50% 35% at 50% 0%, rgba(231, 138, 83, 0.15), transparent 60%), #000000;"
      />
      <!-- Floating particles -->
      <div
        v-for="i in 20"
        :key="i"
        class="absolute w-1 h-1 bg-[#e78a53]/20 rounded-full floating-particle"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${10 + Math.random() * 10}s`,
        }"
      />
    </div>

    <!-- Globe Background -->
    <div class="absolute inset-0 z-[1] flex items-center justify-center overflow-hidden pointer-events-none">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] md:w-[650px] md:h-[650px] lg:w-[750px] lg:h-[750px]">
        <Globe
          :base-color="[1, 0.6, 0.4]"
          :marker-color="[1, 0.5, 0.3]"
          :glow-color="[0.95, 0.55, 0.35]"
          :theta="0.5"
          :dark="0"
          :scale="1.15"
          :diffuse="0.2"
          :map-samples="30000"
          :map-brightness="12"
          :className="'!max-w-none w-full h-full'"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-6 py-6 md:py-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-8 md:mb-10">
          <Transition name="fade-up" appear>
            <div class="mb-4">
              <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-white mb-3" style="text-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3);">
                Zen<span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5);">Cloud</span>
              </h1>
              <p class="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto">
                Gestión automatizada de bases de datos en la nube
              </p>
            </div>
          </Transition>
        </div>

        <!-- Main Grid: QR Code + Features -->
        <div class="grid md:grid-cols-2 gap-6 md:gap-8 items-start mb-8">
          <!-- QR Code Section -->
          <Transition name="fade-up" appear :delay="200">
            <div class="flex flex-col items-center justify-center">
              <div class="bg-black/40 backdrop-blur-xl border border-[#e78a53]/60 rounded-3xl p-6 md:p-8 transition-all duration-300" style="transform: scale(1.02); border-color: rgba(231, 138, 83, 0.6); box-shadow: rgba(231, 138, 83, 0.2) 0px 0px 30px;">
                <h3 class="text-xl md:text-2xl font-bold text-white mb-3 text-center">Escanea y visita nuestra web</h3>
                <p class="text-white/70 text-sm mb-5 text-center">Descubre todas las características y comienza gratis</p>
                <div class="bg-white p-3 md:p-4 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
                  <img
                    src="/QR.png"
                    alt="QR Code - Visita ZenCloud"
                    class="w-56 h-56 md:w-64 md:h-64 object-contain"
                    @error="handleQRError"
                  />
                </div>
                <p class="text-[#e78a53] text-sm font-medium text-center">Acceso rápido a la plataforma</p>
              </div>
            </div>
          </Transition>

          <!-- Features Grid -->
          <Transition name="fade-up" appear :delay="300">
            <div class="grid grid-cols-1 gap-3 md:gap-4">
              <!-- Feature 1: Creación Instantánea -->
              <div class="group bg-black/40 backdrop-blur-xl border border-[#e78a53]/60 rounded-2xl p-5 md:p-6 transition-all duration-300" style="transform: scale(1.02); border-color: rgba(231, 138, 83, 0.6); box-shadow: rgba(231, 138, 83, 0.2) 0px 0px 30px;">
                <div class="flex items-start gap-3 md:gap-4">
                  <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 flex-shrink-0">
                    <Zap class="w-5 h-5 md:w-6 md:h-6 text-[#e78a53]" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg md:text-xl font-bold text-white mb-1.5 md:mb-2">Creación Instantánea</h3>
                    <p class="text-white/70 text-xs md:text-sm leading-relaxed">
                      Despliega bases de datos en segundos con configuración automática. Gestiona credenciales y conexiones desde un solo panel.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Feature 2: Panel Centralizado -->
              <div class="group bg-black/40 backdrop-blur-xl border border-[#e78a53]/60 rounded-2xl p-5 md:p-6 transition-all duration-300" style="transform: scale(1.02); border-color: rgba(231, 138, 83, 0.6); box-shadow: rgba(231, 138, 83, 0.2) 0px 0px 30px;">
                <div class="flex items-start gap-3 md:gap-4">
                  <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 flex-shrink-0">
                    <LayoutDashboard class="w-5 h-5 md:w-6 md:h-6 text-[#e78a53]" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg md:text-xl font-bold text-white mb-1.5 md:mb-2">Panel Centralizado</h3>
                    <p class="text-white/70 text-xs md:text-sm leading-relaxed">
                      Administra todas tus bases de datos desde un solo lugar. Visualiza métricas, gestiona credenciales y escala con un click.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Feature 3: Asistente IA -->
              <div class="group bg-black/40 backdrop-blur-xl border border-[#e78a53]/60 rounded-2xl p-5 md:p-6 transition-all duration-300" style="transform: scale(1.02); border-color: rgba(231, 138, 83, 0.6); box-shadow: rgba(231, 138, 83, 0.2) 0px 0px 30px;">
                <div class="flex items-start gap-3 md:gap-4">
                  <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#e78a53]/20 to-[#e78a53]/10 flex items-center justify-center border border-[#e78a53]/30 flex-shrink-0">
                    <Sparkles class="w-5 h-5 md:w-6 md:h-6 text-[#e78a53]" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1.5 md:mb-2">
                      <h3 class="text-lg md:text-xl font-bold text-white">Asistente IA</h3>
                      <span class="px-2 py-0.5 rounded-full bg-[#e78a53]/20 text-[#e78a53] text-xs font-medium border border-[#e78a53]/30">
                        Próximamente
                      </span>
                    </div>
                    <p class="text-white/70 text-xs md:text-sm leading-relaxed">
                      Gestiona tus bases de datos con inteligencia artificial. Crea, optimiza y administra usando lenguaje natural.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Call to Action Section -->
        <Transition name="fade-up" appear :delay="400">
          <div class="text-center mt-8 md:mt-10">
            <button
              @click="goToHome"
              class="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#e78a53] to-[#f59a63] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span class="text-white font-bold text-base md:text-lg">Empieza gratis con 2 bases de datos por motor</span>
              <ArrowRight class="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
            <p class="text-white/60 text-xs md:text-sm mt-3">Sin tarjeta de crédito requerida</p>
          </div>
        </Transition>

        <!-- Database Engines Showcase -->
        <Transition name="fade-up" appear :delay="500">
          <div class="mt-12 md:mt-16">
            <p class="text-center text-white/70 text-sm md:text-base font-medium mb-4 md:mb-6">Motores de bases de datos soportados</p>
            <div class="flex items-center justify-center gap-4 md:gap-8 flex-wrap max-w-4xl mx-auto">
              <div
                v-for="(engine, index) in engines"
                :key="engine.name"
                class="opacity-100 transition-all duration-300 cursor-pointer hover:scale-110 fade-up"
                :style="{ 
                  animationDelay: `${600 + index * 100}ms`,
                  filter: engine.filter,
                }"
              >
                <img
                  :src="engine.logo"
                  :alt="engine.name"
                  class="h-12 md:h-16 lg:h-20 w-auto object-contain"
                  @error="(e) => (e.target as HTMLImageElement).src = engine.fallback"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Zap, LayoutDashboard, Sparkles, ArrowRight } from 'lucide-vue-next'
import { ENGINE_FALLBACKS } from '@/composables/useImageFallback'
import Globe from '@/components/ui/Globe.vue'

const router = useRouter()

const engines = [
  {
    name: 'MySQL',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg',
    fallback: ENGINE_FALLBACKS.mysql,
    filter: 'drop-shadow(0 0 15px rgba(0, 117, 143, 0.7)) drop-shadow(0 0 30px rgba(0, 117, 143, 0.4))',
  },
  {
    name: 'PostgreSQL',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg',
    fallback: ENGINE_FALLBACKS.postgresql,
    filter: 'drop-shadow(0 0 15px rgba(51, 103, 145, 0.7)) drop-shadow(0 0 30px rgba(51, 103, 145, 0.4))',
  },
  {
    name: 'MongoDB',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg',
    fallback: ENGINE_FALLBACKS.mongodb,
    filter: 'drop-shadow(0 0 15px rgba(71, 162, 72, 0.7)) drop-shadow(0 0 30px rgba(71, 162, 72, 0.4))',
  },
  {
    name: 'SQL Server',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain-wordmark.svg',
    fallback: ENGINE_FALLBACKS.sqlserver,
    filter: 'drop-shadow(0 0 15px rgba(204, 0, 0, 0.7)) drop-shadow(0 0 30px rgba(204, 0, 0, 0.4))',
  },
  {
    name: 'Redis',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original-wordmark.svg',
    fallback: ENGINE_FALLBACKS.redis,
    filter: 'drop-shadow(0 0 15px rgba(220, 50, 47, 0.7)) drop-shadow(0 0 30px rgba(220, 50, 47, 0.4))',
  },
  {
    name: 'Cassandra',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Cassandra_logo.svg',
    fallback: ENGINE_FALLBACKS.cassandra,
    filter: 'drop-shadow(0 0 15px rgba(28, 101, 221, 0.7)) drop-shadow(0 0 30px rgba(28, 101, 221, 0.4))',
  },
]

function handleQRError(e: Event) {
  console.error('Error loading QR code image:', e)
  // Puedes agregar un fallback aquí si es necesario
}

function goToHome() {
  router.push('/')
}
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.6s ease-out;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  33% {
    transform: translateY(-20px) translateX(10px);
  }
  66% {
    transform: translateY(10px) translateX(-10px);
  }
}

.floating-particle {
  animation: float linear infinite;
}
</style>

