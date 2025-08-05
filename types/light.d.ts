export interface LightProps {
  width: number;
  height: number;
  depth: number;
  side: LightSide;
  ambientIntensity: number;
  directionalIntensity: number;
  pointIntensity: number;
  spotIntensity: number;
  spotAngle: number;
}
