<template>
  <h2 :class="cn('text-lg font-semibold', attrs.class as string)">
    <slot />
  </h2>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

