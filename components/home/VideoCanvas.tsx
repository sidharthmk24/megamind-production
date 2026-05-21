"use client";

import { useRef, useImperativeHandle, forwardRef, useLayoutEffect, useMemo } from "react";
import { useVideoTexture } from "@react-three/drei";
import { extend, useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { ShaderMaterial, Texture } from "three";
import { LiquidTransitionMaterial } from "@/lib/shaders/LiquidTransitionMaterial";
import { createDisplacementTexture } from "@/lib/create-displacement-texture";

extend({ LiquidTransitionMaterial });

type LiquidShaderMaterial = ShaderMaterial & {
  uniforms: ShaderMaterial["uniforms"] & {
    uProgress: { value: number };
    uTexture1: { value: Texture };
    uTexture2: { value: Texture };
    uDispMap: { value: Texture };
    uDispFactor: { value: number };
  };
};

type VideoCanvasProps = {
  video1Url: string;
  video2Url: string;
};

export type VideoCanvasHandle = {
  triggerTransition: (onComplete?: () => void) => void;
};

const VideoCanvas = forwardRef<VideoCanvasHandle, VideoCanvasProps>(
  ({ video1Url, video2Url }, ref) => {
    const materialRef = useRef<LiquidShaderMaterial | null>(null);
    const { viewport } = useThree();
    const dispMap = useMemo(() => createDisplacementTexture(), []);

    const videoOpts = { crossOrigin: "anonymous", muted: true, loop: true, playsInline: true };
    const texture1 = useVideoTexture(video1Url, videoOpts);
    const texture2 = useVideoTexture(video2Url, videoOpts);

    useLayoutEffect(() => {
      const material = materialRef.current;
      if (!material) return;
      material.uniforms.uTexture1.value = texture1;
      material.uniforms.uTexture2.value = texture2;
      material.uniforms.uDispMap.value = dispMap;
    }, [texture1, texture2, dispMap]);

    useImperativeHandle(ref, () => ({
      triggerTransition: (onComplete) => {
        const material = materialRef.current;
        if (!material) return;

        gsap.fromTo(
          material.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            duration: 1.5,
            ease: "expo.inOut",
            onComplete: () => {
              onComplete?.();
            },
          }
        );
      },
    }));

    return (
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <liquidTransitionMaterial ref={materialRef} />
      </mesh>
    );
  }
);

VideoCanvas.displayName = "VideoCanvas";

export default VideoCanvas;
