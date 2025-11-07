<template>
  <div :class="cn('inline-flex h-12 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-1.5', $attrs.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

