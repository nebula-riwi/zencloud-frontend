<template>
  <div class="min-h-screen w-full relative bg-black">
      <!-- Pearl Mist Background with Top Glow -->
      <div
        class="absolute inset-0 z-0"
        style="background: radial-gradient(ellipse 50% 35% at 50% 0%, rgba(226, 232, 240, 0.12), transparent 60%), #000000;"
      />

      <!-- Header -->
      <Header />

      <!-- Hero Section -->
      <Hero />

      <!-- Features Section -->
      <div id="features">
        <FeaturesSection />
      </div>

      <!-- Pricing Section -->
      <div id="pricing">
        <PricingSection />
      </div>

      <!-- Testimonials Section -->
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <!-- FAQ Section -->
      <div id="faq">
        <FAQSection />
      </div>

      <!-- Sticky Footer -->
      <StickyFooter />
      
      <!-- Auth Modal -->
      <AuthModal 
        v-model="showAuthModal" 
        :mode="authMode"
        @update:mode="(mode) => authMode = mode"
      />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Hero from '@/components/home/Hero.vue'
import FeaturesSection from '@/components/sections/FeaturesSection.vue'
import PricingSection from '@/components/sections/PricingSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import FAQSection from '@/components/sections/FAQSection.vue'
import StickyFooter from '@/components/sections/StickyFooter.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import { useMeta, META_PRESETS } from '@/composables/useMeta'

// Configurar meta tags para SEO
useMeta(META_PRESETS.home)

const route = useRoute()

const showAuthModal = ref(false)
const authMode = ref<'login' | 'register'>('login')

// Listen for open auth modal event from Header
onMounted(() => {
  // Forzar tema oscuro
  const root = document.documentElement
  root.classList.remove('light', 'system')
  root.classList.add('dark')
  
  // Check if we should open the modal from query params
  const action = route.query.action as string
  if (action === 'login' || action === 'register') {
    authMode.value = action
    showAuthModal.value = true
  }
  
  // Listen for custom event to open modal
  window.addEventListener('open-auth-modal', ((e: CustomEvent) => {
    authMode.value = e.detail?.mode || 'login'
    showAuthModal.value = true
  }) as EventListener)
})

// Watch for route changes to open modal
watch(() => route.query.action, (action) => {
  if (action === 'login' || action === 'register') {
    authMode.value = action
    showAuthModal.value = true
  }
})
</script>

