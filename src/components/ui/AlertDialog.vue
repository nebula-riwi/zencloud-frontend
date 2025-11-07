<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <DialogHeader>
      <DialogTitle>{{ title }}</DialogTitle>
      <DialogDescription v-if="description">{{ description }}</DialogDescription>
    </DialogHeader>
    <DialogContent>
      <slot />
    </DialogContent>
    <DialogFooter>
      <Button variant="outline" @click="$emit('update:modelValue', false)">
        {{ cancelText }}
      </Button>
      <Button :variant="confirmVariant" @click="handleConfirm">
        {{ confirmText }}
      </Button>
    </DialogFooter>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue'
import DialogHeader from './DialogHeader.vue'
import DialogTitle from './DialogTitle.vue'
import DialogDescription from './DialogDescription.vue'
import DialogContent from './DialogContent.vue'
import DialogFooter from './DialogFooter.vue'
import Button from './Button.vue'

defineProps<{
  modelValue: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

