<template>
  <ErrorBoundary>
    <FollowerPointer>
      <router-view />
      <Toast />
      <ChatWidget />
    </FollowerPointer>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import Toast from '@/components/ui/Toast.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import FollowerPointer from '@/components/common/FollowerPointer.vue'
import ChatWidget from '@/components/common/ChatWidget.vue'
</script>

