<template>
  <div :class="cn('flex items-center p-6 pt-0', attrs.class as string)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

