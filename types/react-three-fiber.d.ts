import type { ShaderMaterial, Texture } from "three";

type LiquidShaderMaterial = ShaderMaterial & {
  uniforms: ShaderMaterial["uniforms"] & {
    uProgress: { value: number };
    uTexture1: { value: Texture };
    uTexture2: { value: Texture };
    uDispMap: { value: Texture };
    uDispFactor: { value: number };
  };
};

declare module "@react-three/fiber" {
  interface ThreeElements {
    liquidTransitionMaterial: {
      ref?: React.Ref<LiquidShaderMaterial>;
    };
  }
}
