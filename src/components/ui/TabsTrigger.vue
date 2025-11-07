<template>
  <button
    :class="cn(
      'relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e78a53]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50',
      modelValue === value 
        ? 'bg-gradient-to-r from-[#e78a53]/20 to-[#e78a53]/10 text-[#e78a53] border border-[#e78a53]/30 shadow-lg shadow-[#e78a53]/10' 
        : 'text-white/70 hover:text-white hover:bg-white/5',
      $attrs.class
    )"
    @click="$emit('update:modelValue', value)"
  >
    <slot />
    <span
      v-if="modelValue === value"
      class="absolute inset-0 bg-gradient-to-r from-[#e78a53]/10 to-transparent rounded-lg blur-sm"
    ></span>
  </button>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  value: string
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

