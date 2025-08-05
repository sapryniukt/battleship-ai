import { DoubleSide } from 'three';

const defaultSize = {
  width: 14.5,
  depth: 2.5
};

export const defaultBoardProps = {
  size: defaultSize.width,
  depth: defaultSize.depth,
  color: '#ffffff',
  position: () => [0, 0, 0],
  geometry: () => [defaultSize.width, defaultSize.width, defaultSize.depth],
  material: () => ({
    color: '#ffffff',
    roughness: 0.4,
    metalness: 0.9,
    transparent: true,
    opacity: 0.7,
    side: DoubleSide
  })
};
