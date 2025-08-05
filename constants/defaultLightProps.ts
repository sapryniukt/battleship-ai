export enum LightSide {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}

export const defaultLightProps = {
  width: 100,
  height: 100,
  depth: 100,
  side: LightSide.Middle,
  ambientIntensity: 0.3,
  directionalIntensity: 0.3,
  pointIntensity: 0.4,
  spotIntensity: 0.8,
  spotAngle: Math.PI / 6
};
