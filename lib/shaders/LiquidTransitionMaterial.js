import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const LiquidTransitionMaterial = shaderMaterial(
  {
    uProgress: 0,
    uTexture1: new THREE.Texture(),
    uTexture2: new THREE.Texture(),
    uDispMap: new THREE.Texture(),
    uDispFactor: 0.5, // Intensity of the distortion
  },
  // Vertex Shader (Standard 2D plane setup)
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (The Liquid Transition Logic)
  `
    uniform float uProgress;
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;
    uniform sampler2D uDispMap;
    uniform float uDispFactor;
    
    varying vec2 vUv;

    void main() {
      // Sample the displacement map
      vec4 disp = texture2D(uDispMap, vUv);
      
      // Calculate distorted UVs for both textures
      vec2 distortedPosition1 = vec2(vUv.x, vUv.y + uProgress * (disp.r * uDispFactor));
      vec2 distortedPosition2 = vec2(vUv.x, vUv.y - (1.0 - uProgress) * (disp.r * uDispFactor));
      
      // Sample the videos with the distorted UVs
      vec4 _texture1 = texture2D(uTexture1, distortedPosition1);
      vec4 _texture2 = texture2D(uTexture2, distortedPosition2);
      
      // Mix them based on the GSAP progress
      gl_FragColor = mix(_texture1, _texture2, uProgress);
    }
  `
);