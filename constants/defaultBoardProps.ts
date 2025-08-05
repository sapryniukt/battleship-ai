import { DoubleSide } from 'three';

const defaultSize = {
  width: 100,
  height: 100,
  depth: 5
};

export const defaultBoardProps = {
  size: () => defaultSize,
  color: '#3a3a3a',
  frameThickness: 2,
  frameDepth: 1,
  boardPosition: () => [0, 0, 0],
  boardGeometry: () => [defaultSize.width, defaultSize.height, defaultSize.depth],
  boardMaterial: () => ({
    color: '#3a3a3a',
    roughness: 0.4,
    metalness: 0.9,
    transparent: true,
    opacity: 0.7,
    side: DoubleSide
  })
};

export const defaultRoundedBorderProps = {
  boardWidth: 100,
  boardHeight: 100,
  boardDepth: 5,
  thickness: 2,
  depth: 1,
  radius: 10,
  outerFrameColor: '#222222',
  innerFrameColor: '#444444',
  color: '#3a3a3a'
};
