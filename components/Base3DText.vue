<script setup lang="ts">
import { Vector3, Group } from 'three';
import { Text } from 'troika-three-text';
import type { JsonElement, Text3DProps, TextMeshOptions } from '~/types/text3d';

const props = withDefaults(defineProps<Text3DProps>(), {
  text: '',
  size: 12,
  lineHeight: 1.5,
  defaultColor: 'white',
  fontWeight: 'normal',
  elements: () => [{ content: '', color: '' }],
  position: () => new Vector3(),
  delay: 0,
  inverse: false,
  rotation: 0,
  maxWidth: undefined,
  typingEffect: false,
  transition: false,
  transitionDuration: 200
});

const textOptions = ref({
  size: props.size,
  lineHeight: props.lineHeight,
  fontWeight: props.fontWeight,
  defaultColor: props.defaultColor,
  position: props.position,
  inverse: props.inverse,
  rotation: props.rotation,
  maxWidth: props.maxWidth,
  typingEffect: props.typingEffect
});

const groupRef = ref<Group>(new Group());
const previousGroupRef = ref<Group | null>(null);

onMounted(() => {
  let timeout: number;

  if (props.elements.length === 1 && !props.elements[0].content) {
    // eslint-disable-next-line vue/no-mutating-props
    props.elements[0].content = props.text;
  }

  const textMeshGenerator = generateTextMeshes(props.elements, textOptions.value);

  const addNextMesh = () => {
    const { value, done } = textMeshGenerator.next();
    if (done) return;

    const { textMesh, typingContent } = value;
    groupRef.value.add(textMesh);
    textMesh.sync(() => {
      if (props.typingEffect) {
        animateTypingEffect(textMesh, typingContent, props.delay, addNextMesh);
      } else {
        addNextMesh();
      }
    });
  };

  const showNewGroup = () => {
    addNextMesh();
    // Tres.js manages adding the group to the scene when bound to a ref.
  };

  const hidePreviousGroup = (callback: () => void) => {
    if (previousGroupRef.value) {
      transitionEffect(previousGroupRef.value, 'out', props.transitionDuration, () => {
        previousGroupRef.value?.clear();
        previousGroupRef.value = null;
        callback();
      });
    } else {
      callback();
    }
  };

  timeout = window.setTimeout(() => {
    if (props.transition) {
      hidePreviousGroup(() => {
        showNewGroup();
        transitionEffect(groupRef.value, 'in', props.transitionDuration);
      });
    } else {
      showNewGroup();
    }
  }, props.delay || 500);

  previousGroupRef.value = groupRef.value;

  onBeforeUnmount(() => {
    clearTimeout(timeout);
    groupRef.value.clear(); // Clean up on unmount
  });
});

function animateTypingEffect(textMesh: Text, content: string, delay: number, callback: () => void) {
  let currentText = '';
  let charIndex = 0;

  const typeNextChar = () => {
    if (charIndex < content.length) {
      currentText += content[charIndex];
      textMesh.text = currentText;
      textMesh.sync(() => {
        charIndex++;
        setTimeout(typeNextChar, delay);
      });
    } else {
      callback();
    }
  };

  typeNextChar();
}

function* generateTextMeshes(elements: JsonElement[], options: TextMeshOptions) {
  let currentY = options.position.y;
  let currentX = options.position.x;
  for (const element of elements) {
    if (element.content === '\n') {
      currentX = options.position.x;
      currentY -= options.size * options.lineHeight;
      continue;
    }

    const textMesh = new Text();
    textMesh.text = options.typingEffect ? '' : element.content;
    textMesh.fontWeight = options.fontWeight;
    textMesh.fontSize = options.size;
    textMesh.color = element.color || props.defaultColor;
    textMesh.anchorX = 'left';
    textMesh.anchorY = 'top';
    textMesh.lineHeight = options.lineHeight;
    textMesh.position.set(currentX, currentY, options.position.z);

    if (options.maxWidth) textMesh.maxWidth = options.maxWidth;
    if (options.inverse) textMesh.rotation.y = Math.PI;
    if (options.rotation) textMesh.rotation.z = options.rotation;
    yield { textMesh, typingContent: element.content };

    const textPosition = textMesh.textRenderInfo?.blockBounds[2] || 0;
    currentX += textPosition + 1;
  }
}

function transitionEffect(group: Group, direction: 'in' | 'out', transitionDuration: number, onComplete?: () => void) {
  const duration = transitionDuration;
  const startOpacity = direction === 'in' ? 0 : 1;
  const endOpacity = direction === 'in' ? 1 : 0;
  const startTime = performance.now();

  function animate() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const opacity = startOpacity + (endOpacity - startOpacity) * progress;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    group.traverse((child: any) => {
      if (child.material) {
        child.material.opacity = opacity;
        child.material.transparent = true;
      }
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  }

  animate();
}
</script>

<template>
  <TresGroup ref="groupRef"></TresGroup>
</template>
