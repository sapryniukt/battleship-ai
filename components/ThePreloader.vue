<script lang="ts" setup>
import { createTimeline, svg } from "animejs";
import logoAnimation from "~/config/logoAnimation";

const showLoadingProgress = ref(true);
const startPreloadAnimation = inject<Ref<boolean>>("startPreloadAnimation");
const emit = defineEmits<(event: "finishLoading") => void>();
const prefersReducedMotion = useReducedMotion();

const animate = () => {
  showLoadingProgress.value = false;
  const a = logoAnimation(prefersReducedMotion.value);

  const loader = createTimeline({
    onComplete: () => emit("finishLoading"),
  });

  loader
    .add(svg.createDrawable("#logo path"), a.strokeAnimation)
    .add(
      "#logo #T",
      a.sideLetterAnimation("left"),
      prefersReducedMotion.value ? 0 : 2000
    )
    .add(
      "#logo #L",
      a.sideLetterAnimation("right"),
      prefersReducedMotion.value ? 0 : 2000
    )
    .add(["#logo #T", "#logo #S", "#logo #L"], a.collapseAnimation);
};

watch(startPreloadAnimation!, (newValue) => newValue && animate());
</script>

<template>
  <section
    id="loader"
    class="fixed inset-0 z-50 size-full overflow-y-hidden bg-black"
  >
    <div id="logo-wrapper" class="flex min-h-svh flex-col place-content-center">
      <LazySvgoLogo
        id="logo"
        class="h-24 w-full brightness-200"
        hydrate-on-visible
      />
      <div
        v-if="showLoadingProgress"
        class="absolute left-1/2 mt-72 -translate-x-1/2"
      >
        <LazySvgoProgress class="animate-spin transition" hydrate-on-visible />
      </div>
    </div>
  </section>
</template>
