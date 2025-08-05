<script lang="ts" setup>
import type { NuxtError } from '#app';
import type { ErrorMarkdown } from '~/types/markdown';

defineProps({
  error: Object as () => NuxtError
});

await usePageContentFetch(['header', 'about', 'error', 'footer']);

const doc = useContentEntry<ErrorMarkdown>('error');
</script>

<template>
  <div class="container mx-auto flex min-h-screen flex-col items-center justify-center">
    <h1 class="mb-4 text-6xl font-bold">{{ error?.statusCode }}</h1>
    <p class="mb-8 text-center text-xl">{{ doc?.message }}</p>
    <BaseButton to="/" class="px-6 py-2" outline>{{ doc?.button }}</BaseButton>
  </div>
</template>
