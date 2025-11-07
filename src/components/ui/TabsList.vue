<template>
  <div :class="cn('inline-flex h-12 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-1.5', attrs.class as string)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

