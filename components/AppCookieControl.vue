<script lang="ts" setup>
import type { CookieEntry } from '~/types/markdown';

const props = defineProps<{
  controlButton?: boolean;
}>();

const { moduleOptions } = useCookieControl();

moduleOptions.barPosition = 'bottom-right';
moduleOptions.colors = {
  barTextColor: '#f3f4f6',
  barBackground: '#404040',
  barButtonHoverTextColor: '#f3f4f6',
  barButtonColor: '#f3f4f6',
  barButtonBackground: '#222',
  barButtonHoverBackground: '#111',
  barButtonHoverColor: '#f3f4f6',
  modalBackground: '#404040',
  modalTextColor: '#f3f4f6',
  modalButtonColor: '#f3f4f6',
  modalButtonBackground: '#222',
  modalButtonHoverBackground: '#111',
  modalButtonHoverColor: '#f3f4f6',
  controlButtonBackground: props.controlButton ? '#222' : 'transparent',
  controlButtonHoverBackground: props.controlButton ? '#111' : 'transparent',
  controlButtonHoverColor: '#f3f4f6',
  controlButtonIconColor: props.controlButton ? '#f3f4f6' : 'transparent'
};

const cookie = useContentEntry<CookieEntry>('cookies');
</script>

<template>
  <CookieControl locale="en" v-if="cookie">
    <template #bar>
      <h2>{{ cookie.bar.title }}</h2>
      <p>{{ cookie.bar.description }}</p>
    </template>
    <template #modal>
      <div class="p-6 pb-0 leading-relaxed">
        <h2 class="mb-4 text-2xl font-bold">{{ cookie.modal.title }}</h2>
        <p class="mb-4">{{ cookie.modal.intro }}</p>
        <div class="mb-4">
          <h3 class="font-semibold">{{ cookie.modal.essential.title }}</h3>
          <p class="text-sm text-gray-600">
            {{ cookie.modal.essential.description }}
          </p>
        </div>
        <div class="mb-4">
          <h3 class="font-semibold">{{ cookie.modal.analytics.title }}</h3>
          <p class="text-sm text-gray-600">
            {{ cookie.modal.analytics.description }}
          </p>
        </div>
        <div class="mb-4">
          <h3 class="font-semibold">{{ cookie.modal.marketing.title }}</h3>
          <p class="text-sm text-gray-600">
            {{ cookie.modal.marketing.description }}
          </p>
        </div>
        <p class="mt-6 text-sm text-gray-500">{{ cookie.modal.footer }}</p>
      </div>
    </template>
  </CookieControl>
</template>
