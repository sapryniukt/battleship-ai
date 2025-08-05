import type { Vector3 } from "three";

export interface JsonElement {
  content: string;
  color: string;
}

export interface Text3DProps {
  /**
   * The text content to display.
   */
  text?: string;

  /**
   * Array of text elements with specific styling or content.
   * Each element can have its own content and color.
   */
  elements?: JsonElement[];

  /**
   * Size of the text.
   * @default 12
   */
  size?: number;

  /**
   * Line height multiplier for the text.
   * @default 1.5
   */
  lineHeight?: number;

  /**
   * Font weight of the text.
   * @default "normal"
   */
  fontWeight?: string;

  /**
   * Default color for the text. Can be overridden by individual elements.
   * @default "white"
   */
  defaultColor?: string;

  /**
   * Position of the text group in 3D space.
   * @default new Vector3()
   */
  position?: Pick<Vector3, "x" | "y" | "z">;

  /**
   * Delay before the text appears.
   * @default 0
   */
  delay?: number;

  /**
   * If true, inverts the text horizontally.
   * @default false
   */
  inverse?: boolean;

  /**
   * Rotation angle for the text, in radians.
   * @default 0
   */
  rotation?: number;

  /**
   * Maximum width for the text. Text will wrap if it exceeds this width.
   * @default undefined
   */
  maxWidth?: number;

  /**
   * If true, animates the text as if it were being typed out.
   * @default false
   */
  typingEffect?: boolean;

  /**
   * If true, enables transition effects when the text appears or disappears.
   * @default false
   */
  transition?: boolean;

  /**
   * Duration of the transition effect in milliseconds.
   * @default 200
   */
  transitionDuration?: number;
}

export interface TextMeshOptions {
  size: number;
  lineHeight: number;
  fontWeight: string;
  defaultColor: string;
  position: Pick<Vector3, "x" | "y" | "z">;
  inverse: boolean;
  rotation: number;
  maxWidth?: number;
  typingEffect?: boolean;
}
