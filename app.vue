<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/vue";
import { Analytics } from "@vercel/analytics/nuxt";

const isLoading = ref(true);
const startPreloadAnimation = ref(false);

provide("isLoading", isLoading);
provide("startPreloadAnimation", startPreloadAnimation);

const handleFinishLoading = () => {
  console.log("Loading finished!");
  isLoading.value = false;
};

const { cookiesEnabled } = useCookieControl();
</script>

<template>
  <ThePreloader v-if="isLoading" @finishLoading="handleFinishLoading" />
  <template v-if="cookiesEnabled">
    <SpeedInsights />
    <Analytics />
  </template>
  <AppCookieControl :controlButton="false" />
  <NuxtLayout>
    <Suspense>
      <NuxtPage />
    </Suspense>
  </NuxtLayout>
</template>

<style>
@media (prefers-reduced-motion: no-preference) {
  .page-enter-active,
  .page-leave-active {
    transition: all 0.3s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: all 0.2s;
  }
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
