import { NoToneMapping, SRGBColorSpace } from 'three';

export const useRendererSettings = () => {
  const settings = ref({
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
    powerPreference: 'high-performance',
    renderMode: 'manual',
    stencil: false
  });

  return { settings };
};
