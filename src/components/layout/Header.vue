<template>
  <header
    :class="[
      'sticky top-4 z-[9999] mx-auto flex w-full flex-row items-center justify-between self-start rounded-full bg-black/40 backdrop-blur-md border border-white/5 shadow-lg transition-all duration-300 py-2',
      isScrolled ? 'max-w-3xl px-2' : 'max-w-5xl px-4',
    ]"
    style="will-change: transform; transform: translateZ(0); backface-visibility: hidden; perspective: 1000px;"
  >
    <router-link
      :to="{ name: 'Home' }"
      :class="['z-50 flex items-center justify-center gap-2 transition-all duration-300', isScrolled ? 'ml-4' : '']"
      aria-label="ZenCloud - Ir al inicio"
    >
      <span class="text-2xl font-bold tracking-tight">
        <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">Zen</span><span class="text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">Cloud</span>
      </span>
    </router-link>

    <!-- Desktop Navigation -->
    <nav
      class="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-6 text-sm font-medium text-white transition duration-200 hover:text-[#e78a53] md:flex md:space-x-6"
      aria-label="Navegación principal"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        class="relative px-4 py-2 text-white hover:text-[#e78a53] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 rounded-lg"
        @click="scrollToSection(item.id)"
        :aria-label="`Ir a la sección de ${item.label}`"
      >
        <span class="relative z-20">{{ item.label }}</span>
      </button>
    </nav>

    <div class="flex items-center gap-2">
      <router-link
        :to="{ name: 'Login' }"
        class="px-4 py-2 rounded-md font-semibold relative cursor-pointer hover:bg-[#f59a63] transition duration-200 inline-block text-center bg-[#e78a53] text-white text-sm tracking-[-0.01em] focus:outline-none focus:ring-2 focus:ring-[#e78a53] focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Iniciar sesión o crear cuenta"
      >
        Cuenta
      </router-link>
    </div>

    <!-- Mobile Menu Button -->
    <button
      type="button"
      @click="toggleMobileMenu"
      class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-background/50 border border-border/50 transition-colors hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50"
      :aria-label="isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
      :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
      aria-controls="mobile-menu"
    >
      <div class="flex flex-col items-center justify-center w-5 h-5 space-y-1">
        <span
          :class="[
            'block w-4 h-0.5 bg-foreground transition-all duration-300',
            isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : '',
          ]"
        ></span>
        <span
          :class="[
            'block w-4 h-0.5 bg-foreground transition-all duration-300',
            isMobileMenuOpen ? 'opacity-0' : '',
          ]"
        ></span>
        <span
          :class="[
            'block w-4 h-0.5 bg-foreground transition-all duration-300',
            isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : '',
          ]"
        ></span>
      </div>
    </button>
  </header>

  <!-- Mobile Menu Overlay -->
  <Transition name="fade">
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      @click="isMobileMenuOpen = false"
    >
      <div
        class="absolute top-28 sm:top-32 left-4 right-4 bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6"
        id="mobile-menu"
        @click.stop
      >
        <nav class="grid grid-cols-2 gap-3" aria-label="Menú de navegación móvil">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            class="text-center px-4 py-4 text-base font-medium text-white/70 hover:text-white transition-colors rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 border border-white/10 hover:border-[#e78a53]/30"
            :aria-label="`Ir a la sección de ${item.label}`"
            @click="handleMobileNavClick(item.id)"
          >
            {{ item.label }}
          </button>
          <router-link
            :to="{ name: 'Login' }"
            class="col-span-2 px-4 py-4 text-base font-bold text-center bg-[#e78a53] hover:bg-[#f59a63] text-white rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e78a53] focus:ring-offset-2 focus:ring-offset-background mt-2"
          >
            Cuenta
          </router-link>
        </nav>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
  { id: 'features', label: 'Características' },
  { id: 'pricing', label: 'Precios' },
  { id: 'testimonials', label: 'Testimonios' },
  { id: 'faq', label: 'FAQ' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    const headerOffset = 120
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

const handleMobileNavClick = (elementId: string) => {
  isMobileMenuOpen.value = false
  setTimeout(() => {
    scrollToSection(elementId)
  }, 100)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

