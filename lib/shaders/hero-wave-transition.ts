export const heroVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const heroFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform sampler2D uDispMap;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec2 uTexSizeA;
  uniform vec2 uTexSizeB;

  varying vec2 vUv;

  // This function ensures your videos act like CSS "object-fit: cover"
  // so they never stretch or squish, even during distortion.
  vec2 coverUV(vec2 uv, vec2 viewSize, vec2 texSize) {
    if (texSize.x < 1.0 || texSize.y < 1.0) return uv;
    float viewAspect = viewSize.x / viewSize.y;
    float texAspect = texSize.x / texSize.y;
    vec2 s = vec2(1.0);
    if (viewAspect > texAspect) {
      s.y = texAspect / viewAspect;
    } else {
      s.x = viewAspect / texAspect;
    }
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = vUv;

    // Sample the displacement map (black and white fluid image)
    vec4 disp = texture2D(uDispMap, uv);

    // Intensity controls how aggressive the tear is. Adjust this if needed.
    float intensity = 0.4;

    // Distort the UV coordinates based on the displacement map and GSAP progress
    vec2 distortedUvA = uv + vec2(0.0, disp.r * uProgress * intensity);
    vec2 distortedUvB = uv - vec2(0.0, disp.r * (1.0 - uProgress) * intensity);

    vec2 uvA = coverUV(distortedUvA, uResolution, uTexSizeA);
    vec2 uvB = coverUV(distortedUvB, uResolution, uTexSizeB);

    vec4 colA = texture2D(uTexA, uvA);
    vec4 colB = texture2D(uTexB, uvB);

    // Mix the two distorted videos seamlessly
    gl_FragColor = mix(colA, colB, uProgress);
  }
`;