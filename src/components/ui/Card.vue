<template>
  <div
    :class="cn(
      'rounded-xl border border-white/10 bg-black/30 backdrop-blur-md text-card-foreground shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#e78a53]/30 hover:shadow-xl hover:shadow-[#e78a53]/10',
      attrs.class as string
    )"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

