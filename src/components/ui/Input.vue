<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-white/80 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <AlertCircle class="h-5 w-5 text-red-500" />
      </div>
    </div>
    
    <p v-if="error" class="mt-1.5 text-sm text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-sm text-white/50">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle } from 'lucide-vue-next'

interface Props {
  id?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  modelValue?: string | number
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const inputClasses = computed(() => {
  const baseClasses = 'w-full px-4 py-3 rounded-lg text-white transition-all focus:outline-none focus:ring-2'
  
  if (props.error) {
    return `${baseClasses} bg-red-500/5 border border-red-500 focus:ring-red-500/50`
  }
  
  if (props.disabled) {
    return `${baseClasses} bg-white/5 border border-white/5 opacity-50 cursor-not-allowed`
  }
  
  return `${baseClasses} bg-white/5 border border-white/10 focus:ring-[#e78a53] focus:border-[#e78a53]`
})
</script>

