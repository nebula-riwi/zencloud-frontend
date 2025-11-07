<template>
  <div :class="badgeClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'error' | 'info'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  class: '',
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variants = {
    default: 'border-transparent bg-primary text-white hover:bg-primary/80',
    secondary: 'border border-cyan-500/40 bg-[#213440] text-white backdrop-blur-sm',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-white border-white/20',
    success: 'border-transparent bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'border-transparent bg-red-500/20 text-red-400 border-red-500/30',
    info: 'border-transparent bg-blue-500/20 text-blue-400 border-blue-500/30',
  }

  return cn(base, variants[props.variant], props.class)
})
</script>

