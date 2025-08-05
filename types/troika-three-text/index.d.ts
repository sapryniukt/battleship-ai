declare module 'troika-three-text' {
  import { Mesh } from 'three';
  import { Font } from 'three/examples/jsm/loaders/FontLoader';

  export interface TroikaTextRenderInfo {
    blockBounds: [number, number, number, number];
    caretPositions?: number[];
    totalBounds?: [number, number, number, number];
  }

  export interface TextProps {
    text?: string;
    font?: string | Font;
    fontSize?: number;
    fontWeight: 'normal' | 'bold';
    letterSpacing?: number;
    lineHeight?: number;
    maxWidth?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    anchorX?: 'left' | 'center' | 'right' | number;
    anchorY?: 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom' | number;
    color?: string | number;
    depthOffset?: number;
    clipRect?: [number, number, number, number];
    outlineWidth?: number | string;
    outlineColor?: string | number;
    outlineOpacity?: number;
    strokeWidth?: number | string;
    strokeColor?: string | number;
    strokeOpacity?: number;
    fillOpacity?: number;
    sdfGlyphSize?: number;
    material?: THREE.Material;
    backgroundColor?: string | number;
    backgroundOpacity?: number;
    opacity?: number;
    depthTest?: boolean;
    depthWrite?: boolean;
    [key: string]: unknown;
  }

  export class Text extends Mesh {
    constructor(props?: TextProps);
    sync(callback?: () => void): void;
    dispose(): void;
    textRenderInfo?: TroikaTextRenderInfo;
    [key: string]: unknown;
  }

  export function preloadFont(options: { font: string; characters?: string }): Promise<void>;

  export function getSelectionRects(
    textRenderInfo: TroikaTextRenderInfo,
    start: number,
    end: number
  ): Array<{ left: number; top: number; right: number; bottom: number }> | null;
}
