import type { BaseCameraControls } from '@tresjs/cientos';
import { CAMERA_Z_INTERCEPT, CAMERA_Z_SLOPE } from '~/constants/camera';

export const useCameraPosition = (
  controlsState: Partial<BaseCameraControls>,
  containerRef: HTMLDivElement | null | undefined
) => {
  const currentZPosition = ref(controlsState.distance || 0);
  const prefersReducedMotion = useReducedMotion();

  /**
   * Calculate the Z position of the camera based on the container width.
   * The calculation uses a linear equation derived from empirical data.
   */
  const calculateCameraZPosition = (containerWidth: number): number => {
    return CAMERA_Z_SLOPE * containerWidth + CAMERA_Z_INTERCEPT;
  };

  /**
   * Tween the camera's Z position smoothly.
   */
  const tweenCameraZPosition = (newZPosition: number) => {
    const duration = prefersReducedMotion ? 1 : 1000; // duration of the transition in milliseconds
    const startTime = performance.now();
    const initialZPosition = currentZPosition.value;

    const animate = (time: number) => {
      const elapsedTime = time - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Linear interpolation between the initial and new Z positions
      currentZPosition.value = initialZPosition + (newZPosition - initialZPosition) * progress;
      controlsState.distance = currentZPosition.value;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  /**
   * Update the camera's Z position based on the current container width.
   */
  const updateCameraZPosition = (): void => {
    if (containerRef) {
      const containerWidth = containerRef.clientWidth;
      const newCameraZPosition = calculateCameraZPosition(containerWidth);
      tweenCameraZPosition(newCameraZPosition);
    }
  };

  onMounted(() => {
    updateCameraZPosition();

    const resizeObserver = new ResizeObserver(updateCameraZPosition);
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }

    onBeforeUnmount(() => {
      if (containerRef) {
        resizeObserver.unobserve(containerRef);
      }
    });
  });
};
