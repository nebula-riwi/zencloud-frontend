<template>
  <div :class="badgeClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  class: '',
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variants = {
    default: 'border-transparent bg-primary text-white hover:bg-primary/80',
    secondary: 'border border-cyan-500/40 bg-[#213440] text-white backdrop-blur-sm',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-white border-white/20',
  }

  return cn(base, variants[props.variant], props.class)
})
</script>

