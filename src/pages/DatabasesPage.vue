<template>
  <div class="min-h-screen bg-black">
    <Header />
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-white mb-8">Bases de Datos</h1>
      <p class="text-white/60">Gestión de bases de datos en desarrollo...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import { useMeta, META_PRESETS } from '@/composables/useMeta'

// Configurar meta tags
useMeta(META_PRESETS.databases)
</script>

