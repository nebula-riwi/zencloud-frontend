<template>
  <section id="features" class="text-foreground relative overflow-hidden py-12 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
    <div class="bg-primary absolute -top-10 left-1/2 h-16 w-44 -translate-x-1/2 rounded-full opacity-40 blur-3xl select-none"></div>
    <!-- Separator line with orange glow above and below -->
    <div class="absolute top-0 left-1/2 h-px w-3/5 -translate-x-1/2 bg-[#e78a53]/40 transition-all ease-in-out" style="box-shadow: 0 0 8px rgba(231, 138, 83, 0.4), 0 -4px 12px rgba(231, 138, 83, 0.2), 0 4px 12px rgba(231, 138, 83, 0.2);"></div>
    
    <div ref="sectionRef" class="container mx-auto flex flex-col items-center gap-6 sm:gap-12 w-full max-w-7xl">
      <h2 class="mb-8 text-center text-4xl font-semibold tracking-tight text-white md:text-[54px] md:leading-[60px]" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">
        Características
      </h2>
      
      <div class="w-full px-0 sm:px-4">
        <div class="grid grid-cols-12 gap-4 sm:gap-6 justify-center">
          <!-- Creación Instantánea -->
          <FeatureCard
            v-model:hover="isCliHovering"
            :class="['col-span-12 md:col-span-6 xl:col-span-6 xl:col-start-2']"
          >
            <template #header>
              <h3 class="text-2xl leading-none font-semibold tracking-tight text-white">Creación Instantánea</h3>
              <p class="text-md text-white/60 text-sm leading-relaxed mt-2">
                Despliega bases de datos en segundos con configuración automática. 
                Gestiona credenciales, métricas y conexiones desde un solo panel.
              </p>
            </template>
            <template #content>
              <InstantCreationCard :is-hovering="isCliHovering" />
            </template>
          </FeatureCard>

          <!-- Multi-Motor Soportado -->
          <FeatureCard
            v-model:hover="isHovering"
            :class="['col-span-12 md:col-span-6 xl:col-span-6 xl:col-start-8']"
          >
            <template #header>
              <h3 class="text-2xl leading-none font-semibold tracking-tight text-white">Multi-Motor Soportado</h3>
              <p class="text-md text-white/60 text-sm leading-relaxed mt-2">
                6 motores de bases de datos diferentes disponibles para tus proyectos. 
                Elige entre MySQL, PostgreSQL, MongoDB, SQL Server, Redis y Cassandra.
              </p>
            </template>
            <template #content>
              <MultiEngineCard :is-hovering="isHovering" />
            </template>
          </FeatureCard>

          <!-- Asistente IA -->
          <FeatureCard
            v-model:hover="isFeature3Hovering"
            :class="['col-span-12 md:col-span-6 xl:col-span-6 xl:col-start-2']"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <h3 class="text-2xl leading-none font-semibold tracking-tight text-white">Asistente IA</h3>
                <span class="text-xs px-2 py-1 rounded-full bg-[#e78a53]/20 text-[#e78a53] font-medium">Próximamente</span>
              </div>
              <p class="text-md text-white/60 text-sm leading-relaxed mt-2">
                Gestiona tus bases de datos con inteligencia artificial. Crea, optimiza y administra 
                usando lenguaje natural. Consulta estadísticas y recibe recomendaciones inteligentes.
              </p>
            </template>
            <template #content>
              <AIAssistantCard :is-hovering="isFeature3Hovering" />
            </template>
          </FeatureCard>

          <!-- Panel Centralizado -->
          <FeatureCard
            v-model:hover="isFeature4Hovering"
            :class="['col-span-12 md:col-span-6 xl:col-span-6 xl:col-start-8']"
          >
            <template #header>
              <h3 class="text-2xl leading-none font-semibold tracking-tight text-white">Panel Centralizado</h3>
              <p class="text-md text-white/60 text-sm leading-relaxed mt-2">
                Administra todas tus bases de datos desde un solo lugar. Visualiza métricas, 
                gestiona credenciales y escala con un click.
              </p>
            </template>
            <template #content>
              <CentralizedPanelCard :is-hovering="isFeature4Hovering" />
            </template>
          </FeatureCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import FeatureCard from './features/FeatureCard.vue'
import InstantCreationCard from './features/InstantCreationCard.vue'
import MultiEngineCard from './features/MultiEngineCard.vue'
import AIAssistantCard from './features/AIAssistantCard.vue'
import CentralizedPanelCard from './features/CentralizedPanelCard.vue'

const sectionRef = ref<HTMLElement | null>(null)
const isInView = ref(false)
const isCliHovering = ref(false)
const isHovering = ref(false)
const isFeature3Hovering = ref(false)
const isFeature4Hovering = ref(false)

onMounted(() => {
  if (sectionRef.value) {
    useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => {
      isInView.value = isIntersecting
    }, {
      threshold: 0.3,
    })
  }
})
</script>

