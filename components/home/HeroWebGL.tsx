"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import gsap from "gsap";
import * as THREE from "three";
import {
  heroFragmentShader,
  heroVertexShader,
} from "@/lib/shaders/hero-wave-transition";
import { createDisplacementTexture } from "@/lib/create-displacement-texture";
import { HERO_VIDEO_LAST_RESORT } from "@/lib/hero-video-fallback";
import { resolveHeroVideoUrl } from "@/lib/resolve-hero-video-url";

export type HeroWebGLHandle = {
  transitionTo: (nextIndex: number) => Promise<void>;
  getCurrentIndex: () => number;
};

type HeroWebGLProps = {
  videoUrls: string[];
  onIndexChange?: (index: number) => void;
};

function loadVideo(url: string, container: HTMLElement): Promise<HTMLVideoElement> {
  const src = resolveHeroVideoUrl(url);

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("playsinline", "");
    // Same-origin proxy URLs are CORS-safe for WebGL VideoTexture
    video.crossOrigin = "anonymous";
    video.src = src;

    // Browsers throttle 1×1 hidden videos → WebGL samples black frames
    video.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;pointer-events:none;z-index:0;";
    container.appendChild(video);

    let settled = false;

    const onReady = () => {
      if (settled) return;
      settled = true;
      cleanup();
      video.play().catch(() => {});
      resolve(video);
    };

    const onError = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(`Failed to load video: ${src}`));
    };

    const cleanup = () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("error", onError);
    video.load();
  });
}

async function loadVideoWithFallback(
  url: string,
  container: HTMLElement,
  fallbackUrl: string
): Promise<HTMLVideoElement> {
  const candidates = [url, fallbackUrl, HERO_VIDEO_LAST_RESORT].filter(
    (u, i, arr) => u && arr.indexOf(u) === i
  );

  for (const candidate of candidates) {
    try {
      return await loadVideo(candidate, container);
    } catch {
      console.warn(`[HeroWebGL] Could not load: ${candidate}`);
    }
  }

  throw new Error(`Failed to load any hero video (last tried: ${url})`);
}

const HeroWebGL = forwardRef<HeroWebGLHandle, HeroWebGLProps>(
  function HeroWebGL({ videoUrls, onIndexChange }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const videosRef = useRef<HTMLVideoElement[]>([]);
    const texturesRef = useRef<THREE.VideoTexture[]>([]);
    const currentIndexRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const tweenStateRef = useRef({ progress: 0 });
    const rafRef = useRef(0);

    useImperativeHandle(ref, () => ({
      getCurrentIndex: () => currentIndexRef.current,
      transitionTo: (nextIndex: number) =>
        new Promise((resolve) => {
          if (isAnimatingRef.current || nextIndex === currentIndexRef.current) {
            resolve();
            return;
          }

          const material = materialRef.current;
          const textures = texturesRef.current;
          if (!material || !textures[nextIndex]) {
            resolve();
            return;
          }

          isAnimatingRef.current = true;
          const from = currentIndexRef.current;

          material.uniforms.uTexA.value = textures[from];
          material.uniforms.uTexB.value = textures[nextIndex];
          material.uniforms.uTexSizeA.value = getVideoSize(videosRef.current[from]);
          material.uniforms.uTexSizeB.value = getVideoSize(videosRef.current[nextIndex]);

          videosRef.current[nextIndex]?.play().catch(() => {});

          const state = tweenStateRef.current;
          state.progress = 0;

          gsap.to(state, {
            progress: 1,
            duration: 1.4,
            ease: "expo.inOut",
            onUpdate: () => {
              material.uniforms.uProgress.value = state.progress;
            },
            onComplete: () => {
              currentIndexRef.current = nextIndex;
              material.uniforms.uProgress.value = 0;
              material.uniforms.uTexA.value = textures[nextIndex];
              material.uniforms.uTexB.value = textures[nextIndex];
              material.uniforms.uTexSizeA.value = getVideoSize(
                videosRef.current[nextIndex]
              );
              material.uniforms.uTexSizeB.value = material.uniforms.uTexSizeA.value;
              isAnimatingRef.current = false;
              onIndexChange?.(nextIndex);
              resolve();
            },
          });
        }),
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container || videoUrls.length === 0) return;

      let disposed = false;
      let resizeObserver: ResizeObserver | null = null;
      let mesh: THREE.Mesh | null = null;
      const dispTexture = createDisplacementTexture();

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 1);
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;";
      container.appendChild(renderer.domElement);

      const resize = (material: THREE.ShaderMaterial) => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h, false);
        material.uniforms.uResolution.value.set(w, h);
      };

      (async () => {
        try {
          const fallbackUrl = videoUrls[0];
          const videos = await Promise.all(
            videoUrls.map((url, i) =>
              loadVideoWithFallback(url, container, videoUrls[i === 0 ? 1 : 0] ?? fallbackUrl)
            )
          );
          if (disposed) {
            videos.forEach((v) => v.remove());
            return;
          }

          videosRef.current = videos;

          const textures = videos.map((v) => {
            const t = new THREE.VideoTexture(v);
            t.minFilter = THREE.LinearFilter;
            t.magFilter = THREE.LinearFilter;
            t.colorSpace = THREE.SRGBColorSpace;
            return t;
          });
          texturesRef.current = textures;

          const material = new THREE.ShaderMaterial({
            vertexShader: heroVertexShader,
            fragmentShader: heroFragmentShader,
            uniforms: {
              uTexA: { value: textures[0] },
              uTexB: { value: textures[0] },
              uDispMap: { value: dispTexture },
              uProgress: { value: 0 },
              uResolution: { value: new THREE.Vector2(1, 1) },
              uTexSizeA: { value: getVideoSize(videos[0]) },
              uTexSizeB: { value: getVideoSize(videos[0]) },
            },
          });
          materialRef.current = material;

          mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
          scene.add(mesh);

          resize(material);
          resizeObserver = new ResizeObserver(() => resize(material));
          resizeObserver.observe(container);

          const tick = () => {
            if (disposed) return;
            rafRef.current = requestAnimationFrame(tick);
            textures.forEach((t) => {
              t.needsUpdate = true;
            });
            material.uniforms.uTexSizeA.value = getVideoSize(
              videos[currentIndexRef.current]
            );
            renderer.render(scene, camera);
          };
          tick();
        } catch (err) {
          console.error("[HeroWebGL] Video load failed:", err);
        }
      })();

      return () => {
        disposed = true;
        cancelAnimationFrame(rafRef.current);
        resizeObserver?.disconnect();
        gsap.killTweensOf(tweenStateRef.current);
        mesh?.geometry.dispose();
        materialRef.current?.dispose();
        texturesRef.current.forEach((t) => t.dispose());
        dispTexture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        videosRef.current.forEach((v) => {
          v.pause();
          v.removeAttribute("src");
          v.load();
          v.remove();
        });
        videosRef.current = [];
        texturesRef.current = [];
        materialRef.current = null;
      };
    }, [videoUrls]);

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 size-full overflow-hidden"
        aria-hidden
      />
    );
  }
);

function getVideoSize(video?: HTMLVideoElement) {
  const w = video?.videoWidth || 16;
  const h = video?.videoHeight || 9;
  return new THREE.Vector2(w, h);
}

export default HeroWebGL;
