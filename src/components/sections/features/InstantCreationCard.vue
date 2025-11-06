<template>
  <div class="relative w-full max-w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden" style="border-radius: 20px;">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img
        src="https://framerusercontent.com/images/UjqUIiBHmIcSH9vos9HlG2BF4bo.png"
        alt="Arrow-CoreExchange"
        class="w-full h-full object-cover rounded-xl"
      />
    </div>

    <!-- Animated SVG Connecting Lines -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width="100%" height="100%" viewBox="0 0 121 94" class="absolute" style="mix-blend-mode: overlay;">
        <path
          d="M 60.688 1.59 L 60.688 92.449 M 60.688 92.449 L 119.368 92.449 M 60.688 92.449 L 1.414 92.449"
          stroke="rgba(255,255,255,0.4)"
          fill="transparent"
          stroke-width="1.5"
          stroke-dasharray="4 4"
          class="animated-path"
        />
      </svg>
      <svg width="100%" height="100%" viewBox="0 0 121 94" class="absolute" style="mix-blend-mode: overlay;">
        <path
          d="M 60.688 92.449 L 60.688 1.59 M 60.688 1.59 L 119.368 1.59 M 60.688 1.59 L 1.414 1.59"
          stroke="rgba(255,255,255,0.4)"
          fill="transparent"
          stroke-width="1.5"
          stroke-dasharray="4 4"
          class="animated-path"
          style="animation-delay: 0.3s;"
        />
      </svg>
    </div>

    <!-- Main Content Container -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="flex items-center gap-6 sm:gap-8">
        <!-- Left Column -->
        <div class="flex flex-col gap-3">
          <div
            v-for="(item, index) in leftItems"
            :key="index"
            class="bg-white rounded px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 text-black text-xs sm:text-sm font-medium shadow-sm whitespace-nowrap transition-all duration-300 slide-in-left"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <component :is="item.icon" :class="['w-4 h-4', item.color]" />
            {{ item.name }}
          </div>
        </div>

        <!-- Center Logo -->
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 bg-[#e78a53] rounded-lg shadow-lg flex items-center justify-center transition-all duration-500 database-shake"
        >
          <Database class="w-8 h-8 sm:w-10 sm:h-10 text-white transition-transform" />
        </div>

        <!-- Right Column -->
        <div class="flex flex-col gap-3">
          <div
            v-for="(item, index) in rightItems"
            :key="index"
            class="bg-white rounded px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 text-black text-xs sm:text-sm font-medium shadow-sm whitespace-nowrap transition-all duration-300 slide-in-right"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <component :is="item.icon" :class="['w-4 h-4', item.color]" />
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Floating particles effect -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="i in 12"
        :key="i"
        class="absolute w-1 h-1 bg-white/30 rounded-full floating-dot"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${3 + Math.random() * 2}s`,
        }"
      />
    </div>

    <!-- Animated Circular Border -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width="350" height="350" viewBox="0 0 350 350" class="opacity-40">
        <circle
          cx="175"
          cy="175"
          r="173"
          stroke="rgba(255, 255, 255, 0.38)"
          stroke-width="1.16"
          fill="transparent"
          stroke-dasharray="4 4"
          class="rotating-border"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings, BarChart3, Shield, Key, Plug, Database as DbBackup, Database } from 'lucide-vue-next'

interface Props {
  isHovering?: boolean
}

withDefaults(defineProps<Props>(), {
  isHovering: false,
})

const leftItems = [
  { name: 'Configuración', icon: Settings, color: 'text-blue-500' },
  { name: 'Métricas', icon: BarChart3, color: 'text-gray-600' },
  { name: 'Seguridad', icon: Shield, color: 'text-[#e78a53]' },
]

const rightItems = [
  { name: 'Credenciales', icon: Key, color: 'text-[#e78a53]' },
  { name: 'Conexiones', icon: Plug, color: 'text-gray-600' },
  { name: 'Backups', icon: DbBackup, color: 'text-blue-500' },
]
</script>

<style scoped>
@keyframes drawPath {
  0% {
    stroke-dashoffset: 300;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.animated-path {
  stroke-dashoffset: 300;
  stroke-dasharray: 300;
  animation: drawPath 2s ease-in-out infinite;
}

.slide-in-left {
  animation: slideInLeft 0.5s ease-out forwards;
}

.slide-in-right {
  animation: slideInRight 0.5s ease-out forwards;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes floatDot {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  50% {
    transform: translateY(-50px) translateX(20px);
    opacity: 0.6;
  }
  90% {
    opacity: 0.3;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0) scale(1);
  }
  10% {
    transform: translateX(-4px) scale(1.02);
  }
  20% {
    transform: translateX(4px) scale(1.02);
  }
  30% {
    transform: translateX(-3px) scale(1.01);
  }
  40% {
    transform: translateX(3px) scale(1.01);
  }
  50% {
    transform: translateX(-2px) scale(1);
  }
  60% {
    transform: translateX(2px) scale(1);
  }
  70% {
    transform: translateX(-1px) scale(1);
  }
  80% {
    transform: translateX(1px) scale(1);
  }
  90% {
    transform: translateX(0) scale(1);
  }
}

.database-shake {
  animation: shake 4s ease-in-out infinite;
}

.floating-dot {
  animation: floatDot infinite ease-in-out;
}

.rotating-border {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

