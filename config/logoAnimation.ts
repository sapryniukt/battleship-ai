import type { AnimationParams, EaseStringParamNames } from 'animejs';

const easing: EaseStringParamNames = 'inOutQuart';

export const strokeAnimation = (prefersReducedMotion = false): AnimationParams => ({
  draw: '0 1',
  delay: prefersReducedMotion ? 0 : 200,
  duration: prefersReducedMotion ? 0 : 1500,
  easing
});

export const sideLetterAnimation = (direction: 'left' | 'right', prefersReducedMotion = false): AnimationParams => ({
  translateY: '-3%',
  translateX: prefersReducedMotion ? 0 : direction === 'left' ? '-120%' : '120%',
  duration: prefersReducedMotion ? 0 : 700,
  easing
});

export const collapseAnimation = (prefersReducedMotion = false): AnimationParams => ({
  delay: prefersReducedMotion ? 0 : 300,
  duration: 400,
  easing,
  opacity: 0
});

export default (prefersReducedMotion = false) => ({
  strokeAnimation: strokeAnimation(prefersReducedMotion),
  sideLetterAnimation: (direction: 'left' | 'right'): AnimationParams =>
    sideLetterAnimation(direction, prefersReducedMotion),
  collapseAnimation: collapseAnimation(prefersReducedMotion)
});
