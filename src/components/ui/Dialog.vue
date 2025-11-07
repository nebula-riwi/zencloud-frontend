<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
        style="cursor: default;"
      >
        <div class="fixed inset-0 bg-black/70 backdrop-blur-md" />
        <div
          class="relative z-[100] w-full"
          @click.stop
          style="cursor: default;"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.1s ease-out;
}

.dialog-enter-active > div:last-child,
.dialog-leave-active > div:last-child {
  transition: opacity 0.1s ease-out, transform 0.1s ease-out;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div:last-child,
.dialog-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.98) translateY(-5px);
}

.dialog-enter-to > div:last-child,
.dialog-leave-from > div:last-child {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>

