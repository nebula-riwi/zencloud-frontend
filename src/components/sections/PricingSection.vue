<template>
  <section class="relative py-24 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <Transition name="fade-up" appear>
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Sparkles class="w-4 h-4 text-[#e78a53] flex-shrink-0" />
            <span class="text-sm font-medium text-white/90">Precios</span>
          </div>

          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">
            Elige tu plan
          </h2>

          <p class="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Comienza gratis con 2 bases de datos por motor. Escala cuando lo necesites.
          </p>
        </div>
      </Transition>

      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
        <Transition
          v-for="(plan, index) in pricingPlans"
          :key="plan.name"
          name="fade-up"
          appear
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <div
            :class="[
              'relative rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 flex flex-col h-full hover:-translate-y-1',
              plan.popular
                ? 'bg-gradient-to-b from-[#e78a53]/10 to-transparent border-[#e78a53]/30 shadow-lg shadow-[#e78a53]/10'
                : 'bg-white/5 border-white/10 hover:border-white/20',
            ]"
          >
            <div v-if="plan.popular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div class="bg-gradient-to-r from-[#e78a53] to-[#e78a53]/80 text-white text-sm font-medium px-4 py-2 rounded-full">
                Most Popular
              </div>
            </div>

            <div class="text-center mb-8">
              <h3 class="text-xl font-bold text-white mb-2">{{ plan.name }}</h3>
              <div class="flex items-baseline justify-center gap-1 mb-2">
                <span v-if="plan.price" class="text-4xl font-bold text-white">{{ plan.price }}</span>
                <template v-else>
                  <span class="text-3xl font-bold text-white">
                    {{ formatCOP(plan.monthlyPrice || 0) }}
                  </span>
                  <span class="text-white/60 text-lg">/mes</span>
                </template>
              </div>
              <p class="text-white/70 text-sm leading-relaxed">{{ plan.description }}</p>
            </div>

            <ul class="space-y-4 mb-8 flex-grow">
              <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-center gap-3">
                <Check class="w-5 h-5 text-[#e78a53] flex-shrink-0" />
                <span class="text-white/90 text-sm leading-relaxed">{{ feature }}</span>
              </li>
            </ul>

            <button
              :class="[
                'w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95',
                plan.popular || plan.cta === 'Actualizar Plan'
                  ? 'bg-gradient-to-r from-[#e78a53] to-[#e78a53]/80 text-white shadow-lg shadow-[#e78a53]/25 hover:shadow-[#e78a53]/40'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
              ]"
            >
              {{ plan.cta }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Bottom CTA -->
      <Transition name="fade-up" appear style="transition-delay: 400ms">
        <div class="text-center mt-16">
          <p class="text-white/70 mb-4 leading-relaxed">¿Necesitas una solución empresarial? Estamos aquí para ayudarte.</p>
          <button class="text-[#e78a53] hover:text-[#e78a53]/80 font-medium transition-colors hover:scale-105">
            Contáctanos →
          </button>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles, Check } from 'lucide-vue-next'

interface PricingPlan {
  name: string
  price?: string
  monthlyPrice?: number
  description: string
  features: string[]
  popular: boolean
  cta: string
}

const pricingPlans = ref<PricingPlan[]>([
  {
    name: 'Plan Gratuito',
    price: 'Gratis',
    description: 'Perfecto para comenzar y proyectos pequeños',
    features: [
      '2 bases de datos por motor',
      '6 motores soportados',
      'Credenciales automáticas',
      'Soporte por comunidad',
      'Panel de control básico',
    ],
    popular: false,
    cta: 'Comenzar Gratis',
  },
  {
    name: 'Plan Intermedio',
    monthlyPrice: 5000,
    description: 'Para desarrolladores con proyectos medianos',
    features: [
      '5 bases de datos por motor',
      '6 motores soportados',
      'Credenciales automáticas',
      'Rotación de credenciales',
      'Webhooks personalizables',
      'Soporte prioritario',
    ],
    popular: true,
    cta: 'Actualizar Plan',
  },
  {
    name: 'Plan Avanzado',
    monthlyPrice: 10000,
    description: 'Para equipos y proyectos de producción',
    features: [
      '10 bases de datos por motor',
      '6 motores soportados',
      'Credenciales automáticas',
      'Rotación de credenciales',
      'Webhooks ilimitados',
      'Soporte dedicado 24/7',
      'Backups automáticos',
    ],
    popular: false,
    cta: 'Actualizar Plan',
  },
])

const formatCOP = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
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

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>

