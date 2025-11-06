<template>
  <div :class="cn('z-[10] mx-auto flex w-full max-w-[350px] items-center justify-center overflow-hidden', className)">
    <canvas
      ref="canvasRef"
      :style="{
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        aspectRatio: '1',
        display: 'block',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import createGlobe from 'cobe'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  theta?: number
  dark?: number
  scale?: number
  diffuse?: number
  mapSamples?: number
  mapBrightness?: number
  baseColor?: [number, number, number]
  markerColor?: [number, number, number]
  glowColor?: [number, number, number]
}

const props = withDefaults(defineProps<Props>(), {
  theta: 0.25,
  dark: 0,
  scale: 1.0,
  diffuse: 0.4,
  mapSamples: 40000,
  mapBrightness: 10,
  baseColor: () => [1, 1, 1],
  markerColor: () => [1, 0.5, 0.3],
  glowColor: () => [1, 0.5, 0.3],
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvasRef.value) return

  let width = 0
  let phi = 0

  const onResize = () => {
    if (canvasRef.value) {
      width = canvasRef.value.offsetWidth
    }
  }

  window.addEventListener('resize', onResize)
  onResize()

  const globe = createGlobe(canvasRef.value, {
    devicePixelRatio: 2,
    width: width * 2,
    height: width * 2,
    phi: 0,
    theta: props.theta,
    dark: props.dark,
    scale: props.scale,
    diffuse: props.diffuse,
    mapSamples: props.mapSamples,
    mapBrightness: props.mapBrightness,
    baseColor: props.baseColor,
    markerColor: props.markerColor,
    glowColor: props.glowColor,
    opacity: 1,
    offset: [0, 0],
    markers: [
      // longitude latitude
    ],
    onRender: (state: Record<string, any>) => {
      // Called on every animation frame.
      state.phi = phi
      phi += 0.008
    },
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    globe.destroy()
  })
})
</script>
