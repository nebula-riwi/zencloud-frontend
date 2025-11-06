<template>
  <div
    :class="[
      'group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]',
      vertical ? 'flex-col' : 'flex-row',
      className,
    ]"
    :style="{ '--duration': `${duration}s` }"
    v-bind="$attrs"
  >
    <div
      v-for="i in repeat"
      :key="i"
      :class="[
        'flex shrink-0 justify-around [gap:var(--gap)]',
        vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
        { 'group-hover:[animation-play-state:paused]': pauseOnHover },
        { '[animation-direction:reverse]': reverse },
      ]"
      :style="{ '--duration': `${duration}s` }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
  duration?: number
}

withDefaults(defineProps<Props>(), {
  reverse: false,
  pauseOnHover: false,
  vertical: false,
  repeat: 4,
  duration: 40,
  className: '',
})
</script>

