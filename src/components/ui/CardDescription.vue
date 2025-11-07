<template>
  <p :class="cn('text-sm text-white/60', $attrs.class)">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

