<template>
  <div class="min-h-screen bg-black">
    <Header />
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-white mb-8">Planes</h1>
      <PricingSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import PricingSection from '@/components/sections/PricingSection.vue'
</script>

