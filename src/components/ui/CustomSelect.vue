<template>
  <div class="relative group" ref="selectContainer">
    <!-- Selected Value Display -->
    <button
      type="button"
      :id="id"
      :disabled="disabled"
      :class="buttonClasses"
      @click="toggleDropdown"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @focus="handleFocus"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-label="label || 'Select an option'"
    >
      <span class="flex items-center justify-between w-full">
        <span :class="{ 'text-white/50': !selectedLabel }">
          {{ selectedLabel || placeholder || 'Selecciona una opción' }}
        </span>
        <ChevronDown
          class="h-4 w-4 text-white/50 transition-transform duration-200 flex-shrink-0 ml-2"
          :class="{ 'rotate-180': isOpen }"
        />
      </span>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        ref="dropdownMenu"
        class="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
        :class="dropdownClasses"
      >
        <div class="max-h-60 overflow-y-auto custom-scrollbar">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            :class="optionClasses(option)"
            @click="selectOption(option)"
            @mouseenter="hoveredIndex = option.value"
            @mouseleave="hoveredIndex = null"
          >
            <span>{{ option.label }}</span>
            <Check
              v-if="modelValue === option.value"
              class="h-4 w-4 text-[#e78a53] flex-shrink-0"
            />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  id?: string
  modelValue: string | number | null | undefined
  options: SelectOption[]
  placeholder?: string
  label?: string
  disabled?: boolean
  required?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen = ref(false)
const hoveredIndex = ref<string | number | null>(null)
const selectContainer = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === props.modelValue)
  return option?.label
})

const buttonClasses = computed(() => {
  return cn(
    'w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm font-medium text-white tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 hover:border-white/20 hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_12px_24px_-18px_rgba(231,138,83,0.45)] cursor-pointer text-left',
    props.class
  )
})

const dropdownClasses = computed(() => {
  return cn('')
})

const optionClasses = computed(() => (option: SelectOption) => {
  const isSelected = props.modelValue === option.value
  const isHovered = hoveredIndex.value === option.value
  const isDisabled = option.disabled || props.disabled

  return cn(
    'w-full px-4 py-3 text-sm font-medium text-left transition-all duration-200 flex items-center justify-between cursor-pointer',
    {
      'bg-[#e78a53]/20 text-[#e78a53]': isSelected,
      'bg-white/5 text-white': isHovered && !isSelected,
      'text-white/70 hover:bg-white/5': !isSelected && !isHovered && !isDisabled,
      'text-white/30 cursor-not-allowed': isDisabled,
    }
  )
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function selectOption(option: SelectOption) {
  if (option.disabled || props.disabled) return
  emit('update:modelValue', option.value)
  isOpen.value = false
  hoveredIndex.value = null
}

function handleFocus() {
  // Trigger focus event for group-focus-within
}

function handleBlur(event: FocusEvent) {
  // Delay closing to allow click events to fire
  setTimeout(() => {
    const relatedTarget = event.relatedTarget as HTMLElement
    if (!selectContainer.value?.contains(relatedTarget)) {
      isOpen.value = false
    }
  }, 150)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (isOpen.value && hoveredIndex.value !== null) {
        const option = props.options.find(opt => opt.value === hoveredIndex.value)
        if (option) selectOption(option)
      } else {
        toggleDropdown()
      }
      break
    case 'Escape':
      isOpen.value = false
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        isOpen.value = true
      } else {
        navigateOptions(1)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        navigateOptions(-1)
      }
      break
  }
}

function navigateOptions(direction: number) {
  const enabledOptions = props.options.filter(opt => !opt.disabled)
  const currentIndex = enabledOptions.findIndex(opt => opt.value === hoveredIndex.value)
  let newIndex = currentIndex + direction

  if (newIndex < 0) newIndex = enabledOptions.length - 1
  if (newIndex >= enabledOptions.length) newIndex = 0

  hoveredIndex.value = enabledOptions[newIndex]?.value || null
}

function handleClickOutside(event: MouseEvent) {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

watch(() => props.modelValue, () => {
  hoveredIndex.value = props.modelValue || null
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  hoveredIndex.value = props.modelValue || null
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(231, 138, 83, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(231, 138, 83, 0.5);
}
</style>

