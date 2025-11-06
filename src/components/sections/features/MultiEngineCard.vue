<template>
  <div class="flex min-h-[480px] grow items-center justify-center select-none relative overflow-visible">
    <!-- Database name scramble -->
    <div class="absolute top-12 left-1/2 -translate-x-1/2 z-20">
      <div class="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 px-4 py-2">
        <DatabaseScramble class="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#e78a53] [text-shadow:0_0_20px_rgba(231,138,83,0.6)]" />
      </div>
    </div>
    
    <!-- Globe container -->
    <div class="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
      <div class="w-[450px] h-[450px] sm:w-[520px] sm:h-[520px] lg:w-[580px] lg:h-[580px]">
        <Globe 
          :base-color="[1, 0.6, 0.4]" 
          :marker-color="[1, 0.5, 0.3]" 
          :glow-color="[0.95, 0.55, 0.35]"
          :theta="0.5"
          :dark="0"
          :scale="1.15"
          :diffuse="0.2"
          :map-samples="30000"
          :map-brightness="12"
        />
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import DatabaseScramble from '@/components/ui/DatabaseScramble.vue'
import Globe from '@/components/ui/Globe.vue'

interface Props {
  isHovering?: boolean
}

withDefaults(defineProps<Props>(), {
  isHovering: false,
})
</script>

