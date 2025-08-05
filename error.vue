<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
  error: Object as () => NuxtError
});

provide('isLoading', toRef(true));
provide('startPreloadAnimation', toRef(true));
</script>

<template>
  <NuxtLayout>
    <Suspense>
      <AppError :error="error" />
    </Suspense>
  </NuxtLayout>
</template>

<style scoped></style>
