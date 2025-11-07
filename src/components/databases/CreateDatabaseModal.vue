<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <DialogHeader>
      <DialogTitle>Crear Base de Datos</DialogTitle>
      <DialogDescription>
        Crea una nueva base de datos. Las credenciales se enviarán por correo electrónico.
      </DialogDescription>
    </DialogHeader>
    <DialogContent>
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <label class="text-sm font-medium mb-2 block">Motor</label>
          <Select v-model="formData.engine" required>
            <option value="">Selecciona un motor</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mongodb">MongoDB</option>
            <option value="sqlserver">SQL Server</option>
            <option value="redis">Redis</option>
            <option value="cassandra">Cassandra</option>
          </Select>
        </div>
        <div>
          <label class="text-sm font-medium mb-2 block">Nombre</label>
          <Input
            v-model="formData.name"
            placeholder="mi-base-datos"
            required
            :disabled="loading"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="$emit('update:modelValue', false)">
            Cancelar
          </Button>
          <Button type="submit" :loading="loading" :disabled="loading">
            Crear
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useToastStore } from '@/stores/toast'
import Dialog from '@/components/ui/Dialog.vue'
import DialogHeader from '@/components/ui/DialogHeader.vue'
import DialogTitle from '@/components/ui/DialogTitle.vue'
import DialogDescription from '@/components/ui/DialogDescription.vue'
import DialogContent from '@/components/ui/DialogContent.vue'
import DialogFooter from '@/components/ui/DialogFooter.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import type { DatabaseEngine } from '@/types'

defineProps<{
  modelValue: boolean
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
    formData.engine = '' as DatabaseEngine | ''
    emit('created')
  } catch (error: any) {
    toastStore.error('Error', error.response?.data?.message || 'No se pudo crear la base de datos')
  } finally {
    loading.value = false
  }
}
</script>

