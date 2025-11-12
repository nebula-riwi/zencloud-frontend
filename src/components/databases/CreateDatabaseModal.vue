<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="relative w-full max-w-[500px] mx-auto">
      <!-- Main Modal Container -->
      <div class="bg-gradient-to-br from-black/98 via-black/95 to-black/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        <!-- Close Button -->
        <button
          @click="$emit('update:modelValue', false)"
          class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all duration-300 focus:outline-none hover:scale-110 active:scale-95 hover:rotate-90"
          aria-label="Cerrar modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Decorative gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent pointer-events-none"></div>
        
        <!-- Content -->
        <div class="relative z-10 p-8 md:p-10">
          <!-- Header -->
          <div class="flex flex-col items-center mb-8">
            <div class="mb-6">
              <span class="text-4xl font-bold tracking-tight">
                <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">Zen</span><span class="text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">Cloud</span>
              </span>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Crear Base de Datos</h2>
            <p class="text-white/60 text-sm text-center">
              Crea una nueva base de datos. Las credenciales se enviarán por correo electrónico.
            </p>
          </div>

          <form @submit.prevent="handleCreate" class="space-y-5">
            <!-- Engine Selection -->
            <div class="space-y-2">
              <label for="engine" class="block text-sm font-semibold text-white/90 transition-colors duration-200">
                Motor de Base de Datos
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110 z-10">
                  <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <Select
                  id="engine"
                  v-model="formData.engine"
                  required
                  :disabled="loading || !!preselectedEngine"
                  class="!pl-12 !pr-12 !py-3.5 uppercase tracking-[0.14em] text-[11px] font-semibold"
                >
                  <option value="" disabled>Selecciona un motor</option>
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="sqlserver">SQL Server</option>
                  <option value="redis">Redis</option>
                  <option value="cassandra">Cassandra</option>
                </Select>
              </div>
            </div>

            <!-- Database Name -->
            <div class="space-y-2">
              <label for="name" class="block text-sm font-semibold text-white/90 transition-colors duration-200">
                Nombre de la Base de Datos
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                  <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="mi-base-datos"
                  required
                  :disabled="loading"
                  autocomplete="off"
                  class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                />
              </div>
              <p class="text-xs text-white/50 mt-1.5 ml-1">
                Solo letras minúsculas, números y guiones
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !formData.engine || !formData.name.trim()"
              class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e78a53] via-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:via-[#f59a63] hover:to-[#e78a53] text-white font-semibold text-base shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 hover:scale-[1.02] hover:-translate-y-0.5"
            >
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Creando...' : 'Crear Base de Datos' }}
            </button>

            <!-- Cancel Button -->
            <button
              type="button"
              @click="$emit('update:modelValue', false)"
              class="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-medium text-sm transition-all duration-300 focus:outline-none active:scale-95 hover:scale-[1.02]"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useToastStore } from '@/stores/toast'
import Dialog from '@/components/ui/Dialog.vue'
import Select from '@/components/ui/Select.vue'
import type { DatabaseEngine } from '@/types'

const props = defineProps<{
  modelValue: boolean
  preselectedEngine?: DatabaseEngine
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  created: []
}>()

const databaseStore = useDatabaseStore()
const toastStore = useToastStore()

const formData = reactive({
  name: '',
  engine: '' as DatabaseEngine | '',
})

const loading = ref(false)

// Watch for preselected engine
watch(() => props.preselectedEngine, (newEngine) => {
  if (newEngine) {
    formData.engine = newEngine
  }
}, { immediate: true })

// Watch for modal opening to reset form
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    formData.name = ''
    if (!props.preselectedEngine) {
      formData.engine = '' as DatabaseEngine | ''
    } else {
      formData.engine = props.preselectedEngine
    }
  }
})

async function handleCreate() {
  if (!formData.engine) return
  
  loading.value = true
  try {
    await databaseStore.createDatabase({
      name: formData.name,
      engine: formData.engine as DatabaseEngine,
    })
    toastStore.success('Base de datos creada', 'Las credenciales se han enviado por correo electrónico')
    formData.name = ''
    if (!props.preselectedEngine) {
      formData.engine = '' as DatabaseEngine | ''
    }
    emit('update:modelValue', false)
    emit('created')
  } catch (error: any) {
    toastStore.error('Error', error.response?.data?.message || 'No se pudo crear la base de datos')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Custom scrollbar for select dropdown */
select::-ms-expand {
  display: none;
}
</style>
