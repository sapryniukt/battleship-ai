<script lang="ts" setup>
import { computed, toRefs } from "vue";
import { NuxtLinkLocale } from "#components";
import type { ButtonComponentProps } from "~/types/base";

const props = defineProps<ButtonComponentProps>();
const { outline } = toRefs(props);
const { to, ...otherAttrs } = useAttrs() as {
  to?: string;
  [key: string]: unknown;
};

const isLink = computed(() => Boolean(to));

const outlineOnHover = [
  "motion-safe:before:animate-rotate",
  "motion-reduce:before:sepia",
  "motion-safe:before:transition",
  "motion-safe:before:duration-1000",
  "before:inset-[-1px]",
  "before:absolute",
  "before:opacity-0",
  "[&:not(:disabled)]:hover:before:border",
  "[&:not(:disabled)]:hover:before:opacity-100",
  "[&:not(:disabled)]:hover:before:[border-image:linear-gradient(var(--gradient-angle),rgb(255,255,255),transparent)_1]",
  "checked:sepia",
];

const getStyles = computed(() => {
  return outline.value
    ? [
        ...outlineOnHover,
        "after:inset-[-1px]",
        "after:absolute",
        "after:opacity-100",
        "after:border",
        "after:border-stone-50",
        "motion-safe:after:transition",
        "motion-safe:after:duration-500",
        "[&:not(:disabled)]:hover:after:opacity-0",
        "disabled:cursor-not-allowed",
        "focus-visible:after:opacity-0",
      ]
    : outlineOnHover;
});

const buttonClasses = computed(() => {
  return [
    "relative",
    "inline-block",
    "px-1.5",
    "py-1",
    "backdrop-blur-sm",
    ...getStyles.value,
    props.class,
  ];
});

const componentType = computed(() =>
  isLink.value ? NuxtLinkLocale : "button"
);
</script>

<template>
  <component :is="componentType" v-bind="otherAttrs" :class="buttonClasses">
    <span class="absolute -inset-1.5"></span>
    <slot></slot>
  </component>
</template>
