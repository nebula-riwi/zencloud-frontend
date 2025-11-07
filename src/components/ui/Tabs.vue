<template>
  <div :class="cn('w-full', attrs.class as string)">
    <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      <slot name="list" />
    </div>
    <div class="mt-4">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

