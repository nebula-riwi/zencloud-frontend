<template>
  <Transition name="slide-up">
    <div
      v-if="isAtBottom"
      class="fixed z-50 bottom-0 left-0 w-full h-80 flex justify-center items-center"
      style="background-color: #e78a53;"
    >
      <div
        class="relative overflow-hidden w-full h-full flex justify-end px-12 text-right items-start py-12"
        style="color: #121113;"
      >
        <Transition name="fade-up" appear>
          <div class="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl">
            <ul class="space-y-2">
              <li
                v-for="link in links1"
                :key="link"
                class="hover:underline cursor-pointer transition-colors"
                style="color: #121113;"
                @mouseenter="handleHoverEnter($event)"
                @mouseleave="handleHoverLeave($event)"
              >
                {{ link }}
              </li>
            </ul>
            <ul class="space-y-2">
              <li
                v-for="link in links2"
                :key="link"
                class="hover:underline cursor-pointer transition-colors"
                style="color: #121113;"
                @mouseenter="handleHoverEnter($event)"
                @mouseleave="handleHoverLeave($event)"
              >
                {{ link }}
              </li>
            </ul>
          </div>
        </Transition>
        <Transition name="slide-in-left" appear style="transition-delay: 300ms">
          <h2
            class="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] font-bold select-none tracking-tight"
            style="color: #121113;"
          >
            ZenCloud
          </h2>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isAtBottom = ref(false)

const links1 = ['Inicio', 'Documentación', 'Características']
const links2 = ['GitHub', 'Twitter', 'Discord']

const handleScroll = () => {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const isNearBottom = scrollTop + windowHeight >= documentHeight - 200

  isAtBottom.value = isNearBottom
}

const handleHoverEnter = (e: Event) => {
  const target = e.target as HTMLElement
  target.style.color = 'rgba(18, 17, 19, 0.8)'
}

const handleHoverLeave = (e: Event) => {
  const target = e.target as HTMLElement
  target.style.color = '#121113'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.3s ease-out;
}

.slide-up-leave-active {
  transition: all 0.3s ease-in;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
}

.fade-up-enter-active {
  transition: all 0.6s ease-out;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-in-left-enter-active {
  transition: all 0.8s ease-out;
}

.slide-in-left-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-in-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>

