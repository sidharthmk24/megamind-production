import * as THREE from "three";

/** Procedural greyscale noise used as a liquid displacement map (no image file required). */
export function createDisplacementTexture(size = 512): THREE.DataTexture {
  const data = new Uint8Array(size * size);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const n =
      Math.sin(x * 0.04) * 0.25 +
      Math.sin(y * 0.07) * 0.25 +
      Math.sin((x + y) * 0.03) * 0.2 +
      Math.random() * 0.3;
    data[i] = Math.floor(Math.min(Math.max(n, 0), 1) * 255);
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}
