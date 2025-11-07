<template>
  <ErrorBoundary>
    <router-view />
    <Toast />
  </ErrorBoundary>
</template>

<script setup lang="ts">
import Toast from '@/components/ui/Toast.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
</script>

