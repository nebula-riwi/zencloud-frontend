<template>
  <div class="relative w-full max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-10 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]">
    <div class="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-[#e78a53]/10 to-transparent blur-md"></div>

      <div class="text-white leading-relaxed text-base">{{ body }}</div>

    <div class="mt-5 flex items-center gap-2">
      <img :src="img || '/placeholder.svg'" :alt="name" height="40" width="40" class="h-10 w-10 rounded-full" />
        <div class="flex flex-col">
          <div class="leading-5 font-semibold tracking-tight text-white text-sm">{{ name }}</div>
          <div class="leading-5 tracking-tight text-white/50 text-xs">{{ username }}</div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  img: string
  name: string
  username: string
  body: string
}>()
</script>

