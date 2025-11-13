<template>
  <ErrorBoundary>
    <FollowerPointer>
      <router-view />
      <Toast />
    </FollowerPointer>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import Toast from '@/components/ui/Toast.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import FollowerPointer from '@/components/common/FollowerPointer.vue'
</script>

