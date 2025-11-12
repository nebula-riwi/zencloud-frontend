<template>
  <select
    :value="modelValue"
    :class="cn(
      'w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm font-medium text-white tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 hover:border-white/20 hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_12px_24px_-18px_rgba(231,138,83,0.45)]',
      attrs.class as string
    )"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()

defineProps<{
  modelValue: string | number
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

