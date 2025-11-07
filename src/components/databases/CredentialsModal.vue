<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <DialogHeader>
      <DialogTitle>Credenciales de Base de Datos</DialogTitle>
      <DialogDescription>
        {{ isFirstView ? 'Guarda estas credenciales de forma segura. Solo se mostrarán una vez.' : 'Credenciales de acceso' }}
      </DialogDescription>
    </DialogHeader>
    <DialogContent>
      <Loading v-if="loading" text="Cargando credenciales..." />
      
      <div v-else-if="credentials" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Host</label>
          <div class="flex items-center gap-2">
            <Input :value="showPassword ? credentials.host : '••••••••'" readonly class="font-mono" />
            <Button variant="outline" size="sm" @click="copyToClipboard(credentials.host)">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Puerto</label>
          <Input :value="credentials.port.toString()" readonly class="font-mono" />
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Usuario</label>
          <div class="flex items-center gap-2">
            <Input :value="showPassword ? credentials.username : '••••••••'" readonly class="font-mono" />
            <Button variant="outline" size="sm" @click="copyToClipboard(credentials.username)">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Contraseña</label>
          <div class="flex items-center gap-2">
            <Input
              :type="showPassword ? 'text' : 'password'"
              :value="credentials.password"
              readonly
              class="font-mono"
            />
            <Button variant="outline" size="sm" @click="showPassword = !showPassword">
              <Eye v-if="!showPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" @click="copyToClipboard(credentials.password)">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Base de Datos</label>
          <Input :value="credentials.database" readonly class="font-mono" />
        </div>
        
        <div class="flex gap-2 pt-4">
          <Button variant="outline" @click="handleRotate" :loading="rotating">
            Rotar Credenciales
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useToastStore } from '@/stores/toast'
import Dialog from '@/components/ui/Dialog.vue'
import DialogHeader from '@/components/ui/DialogHeader.vue'
import DialogTitle from '@/components/ui/DialogTitle.vue'
import DialogDescription from '@/components/ui/DialogDescription.vue'
import DialogContent from '@/components/ui/DialogContent.vue'
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

