<template>
  <div
    :class="[
      'group relative flex flex-col overflow-hidden rounded-xl border p-4 sm:p-6 shadow-xl transition-all ease-in-out bg-black/40 border-[#e78a53]/20',
      $attrs.class,
    ]"
    @mouseenter="$emit('update:hover', true)"
    @mouseleave="$emit('update:hover', false)"
    :style="{
      transform: isHovering ? 'scale(1.02)' : 'scale(1)',
      borderColor: isHovering ? 'rgba(231, 138, 83, 0.6)' : '',
      boxShadow: isHovering ? '0 0 30px rgba(231, 138, 83, 0.2)' : '',
    }"
  >
    <div class="flex flex-col gap-4 mb-8">
      <slot name="header" />
    </div>
    <div class="pointer-events-none flex grow items-center justify-center select-none relative">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hover: false,
})

defineEmits<{
  'update:hover': [value: boolean]
}>()

const isHovering = computed(() => props.hover)
</script>

