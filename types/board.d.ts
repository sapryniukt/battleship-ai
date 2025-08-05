import type { Side } from 'three';

interface Size {
  width: number;
  height: number;
  depth: number;
}

interface Material {
  color?: string;
  roughness?: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
  side?: Side;
}

export interface LevitatingBoardProps {
  size: Size;
  color: string;
  container: HTMLDivElement | null;
}

export interface LevitatingBoardContentFrameProps {
  size?: Size;
  color?: string;
  frameThickness?: number;
  frameDepth?: number;
  boardPosition?: VectorCoordinates;
  boardGeometry?: unknown;
  boardMaterial?: Material;
}

export interface LevitatingBoardRoundedBorderProps {
  boardWidth: number;
  boardHeight: number;
  boardDepth: number;
  thickness: number;
  depth: number;
  radius: number;
  outerFrameColor?: string;
  innerFrameColor?: string;
  color?: string;
  segments?: number;
}
