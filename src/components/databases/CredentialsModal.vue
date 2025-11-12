<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="relative w-full max-w-2xl mx-auto">
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
            <h2 class="text-2xl font-bold text-white mb-2">Credenciales de Base de Datos</h2>
            <p class="text-white/60 text-sm text-center">
              {{ isFirstView ? 'Guarda estas credenciales de forma segura. Solo se mostrarán una vez.' : 'Credenciales de acceso' }}
            </p>
          </div>

          <Loading v-if="loading" text="Cargando credenciales..." />
          
          <div v-else-if="credentials" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/90">Host</label>
                <div class="flex items-center gap-2">
                  <Input 
                    :value="credentials.host" 
                    readonly 
                    class="font-mono text-sm flex-1" 
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="copyToClipboard(credentials.host)"
                    class="shrink-0"
                  >
                    <Copy class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/90">Puerto</label>
                <div class="flex items-center gap-2">
                  <Input 
                    :value="credentials.port.toString()" 
                    readonly 
                    class="font-mono text-sm flex-1" 
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="copyToClipboard(credentials.port.toString())"
                    class="shrink-0"
                  >
                    <Copy class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-white/90">Usuario</label>
            <div class="flex items-center gap-2">
              <Input 
                :value="credentials.username" 
                readonly 
                class="font-mono text-sm flex-1" 
              />
              <Button 
                variant="outline" 
                size="sm" 
                @click="copyToClipboard(credentials.username)"
                class="shrink-0"
              >
                <Copy class="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-white/90">Contraseña</label>
            <div class="flex items-center gap-2">
              <Input
                :type="showPassword ? 'text' : 'password'"
                :value="credentials.password"
                readonly
                class="font-mono text-sm flex-1"
              />
              <Button 
                variant="outline" 
                size="sm" 
                @click="showPassword = !showPassword"
                class="shrink-0"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                @click="copyToClipboard(credentials.password)"
                class="shrink-0"
              >
                <Copy class="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-white/90">Base de Datos</label>
            <div class="flex items-center gap-2">
              <Input 
                :value="credentials.database" 
                readonly 
                class="font-mono text-sm flex-1" 
              />
              <Button 
                variant="outline" 
                size="sm" 
                @click="copyToClipboard(credentials.database)"
                class="shrink-0"
              >
                <Copy class="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div class="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              @click="handleRotate" 
              :loading="rotating"
              class="w-full sm:w-auto"
            >
              Rotar Credenciales
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useToastStore } from '@/stores/toast'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import { Copy, Eye, EyeOff } from 'lucide-vue-next'
import type { DatabaseCredentials } from '@/types'

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'credentials-rotated': []
}>()

const props = defineProps<{
  modelValue: boolean
  databaseId: string | null
}>()

const databaseStore = useDatabaseStore()
const toastStore = useToastStore()

const credentials = ref<DatabaseCredentials | null>(null)
const loading = ref(false)
const rotating = ref(false)
const showPassword = ref(false)
const isFirstView = ref(false)

watch(
  () => [props.modelValue, props.databaseId],
  async ([isOpen, dbId]) => {
    if (isOpen && dbId && typeof dbId === 'string') {
      await loadCredentials(dbId)
    } else {
      credentials.value = null
      showPassword.value = false
    }
  },
  { immediate: true }
)

async function loadCredentials(dbId: string) {
  loading.value = true
  try {
    const creds = await databaseStore.getCredentials(dbId)
    credentials.value = creds
    isFirstView.value = creds.firstView
    showPassword.value = creds.firstView
  } catch (error: any) {
    toastStore.error('Error', 'No se pudieron cargar las credenciales')
  } finally {
    loading.value = false
  }
}

async function handleRotate() {
  if (!props.databaseId) return
  
  if (!confirm('¿Estás seguro de que deseas rotar las credenciales? La contraseña actual dejará de funcionar.')) {
    return
  }
  
  rotating.value = true
  try {
    await databaseStore.rotateCredentials(props.databaseId)
    await loadCredentials(props.databaseId)
    toastStore.success('Credenciales rotadas', 'Las nuevas credenciales se han enviado por correo')
    emit('credentials-rotated')
  } catch (error: any) {
    toastStore.error('Error', 'No se pudieron rotar las credenciales')
  } finally {
    rotating.value = false
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toastStore.success('Copiado', 'Credencial copiada al portapapeles')
}
</script>

