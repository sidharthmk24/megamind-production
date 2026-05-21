'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import Crosshair from '../ui/Crosshair';

// ─────────────────────────────────────────────
// ENCRYPT-TEXT HOOK
// ─────────────────────────────────────────────
const SYMBOLS = "!@#$%^&*+-=?<>[]{}~|";
const rndSym = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

function useEncryptText(text: string, elRef: React.RefObject<HTMLElement | null>) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spansRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    node.innerHTML = "";
    spansRef.current = text.split("").map((ch) => {
      const s = document.createElement("span");
      s.dataset.orig = ch;
      s.style.display = "inline-block";
      s.style.minWidth = ch === " " ? "0.3em" : "";
      s.textContent = ch === " " ? "\u00a0" : ch;
      node.appendChild(s);
      return s;
    });
  }, [text, elRef]);

  const kill = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scramble = useCallback(() => {
    kill();
    const spans = spansRef.current;
    spans.forEach((s) => { if (s.dataset.orig !== " ") s.textContent = rndSym(); });
    const order = spans
      .map((_, i) => i)
      .filter((i) => spans[i].dataset.orig !== " ")
      .sort(() => Math.random() - 0.5);
    const BASE = 38, JIT = 32;
    order.forEach((idx, pos) => {
      const s = spans[idx];
      let ticks = 0;
      const maxTicks = 3 + Math.floor(Math.random() * 4);
      const tick = () => {
        ticks++;
        if (ticks < maxTicks) {
          s.textContent = rndSym();
          timersRef.current.push(setTimeout(tick, BASE + Math.random() * JIT));
        } else {
          s.textContent = s.dataset.orig ?? "";
          s.style.color = "";
        }
      };
      timersRef.current.push(setTimeout(tick, pos * (BASE + Math.random() * JIT)));
    });
  }, [kill]);

  const restore = useCallback(() => {
    kill();
    spansRef.current.forEach((s) => {
      s.textContent = s.dataset.orig === " " ? "\u00a0" : (s.dataset.orig ?? "");
      s.style.color = "";
    });
  }, [kill]);

  useEffect(() => () => kill(), [kill]);
  return { scramble, restore };
}

// ─────────────────────────────────────────────
// SERVICE-CHAR ANIMATION HOOK
// ─────────────────────────────────────────────
function useServiceCharAnim(elRef: React.RefObject<HTMLElement | null>) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    const charEls = Array.from(el.querySelectorAll<HTMLElement>(".svc-char"));
    if (!charEls.length) return;
    if (tlRef.current) { tlRef.current.kill(); gsap.set(charEls, { opacity: 1 }); }
    tlRef.current = gsap.timeline({ onComplete: () => gsap.set(charEls, { opacity: 1 }) })
      .to(charEls, { opacity: 0, duration: 0.03, stagger: { amount: 0.18, from: "random" }, ease: "none" })
      .to(charEls, { opacity: 1, duration: 0.03, stagger: { amount: 0.18, from: "random" }, ease: "none" }, "-=0.12");
  }, [elRef]);

  const stop = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = null;
    const el = elRef.current;
    if (el) gsap.set(Array.from(el.querySelectorAll<HTMLElement>(".svc-char")), { opacity: 1 });
  }, [elRef]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);
  return { play, stop };
}

// ─────────────────────────────────────────────────────────────
// SLIDE DATA
// ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    subtitle: "Vertex Managed Workspaces",
    heading: "Work Life\nVertex",
    cta: "Podcast Production",
    topRightText: "Created with intent.\nRemembered through emotion.",
    src: '/videos/1.mp4',
    slug: 'vertex-social',
  },
  {
    id: 1,
    subtitle: "Cinematic Storytelling",
    heading: "Frame The\nFuture",
    cta: "Film Production",
    topRightText: "Visionary visuals.\nUnforgettable impact.",
    src: '/videos/2.mp4',
    slug: 'luminary-brand-film',
  },
  {
    id: 2,
    subtitle: "Digital Innovation",
    heading: "Design The\nMotion",
    cta: "Brand Identity",
    topRightText: "Precision in motion.\nExcellence in design.",
    src: '/videos/1.mp4',
    slug: 'crescent-brand',
  }, {
    id: 3,
    subtitle: "Digital Innovation",
    heading: "Design The\nMotion",
    cta: "Brand Identity",
    topRightText: "Precision in motion.\nExcellence in design.",
    src: '/videos/2.mp4',
    slug: 'echo-corporate',
  },
];

const AUTO_ADVANCE_MS = 8000;

// ─────────────────────────────────────────────────────────────
// GLSL SHADERS
// ─────────────────────────────────────────────────────────────
const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform sampler2D uTextureA;
uniform sampler2D uTextureB;
uniform float uProgress;     // 0.0 to 1.0
uniform float uDistortion;   // 0.0 to 1.0 to 0.0 (dynamic peak)
uniform float uTime;         // continuous noise evolution

varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;

  // 1. Layered Noise for a "Thick, Gloopy Liquid" texture
  float n1 = snoise(vec2(uv.x * 2.0 - uTime * 0.1, uv.y * 2.0 + uTime * 0.15));
  float n2 = snoise(vec2(uv.x * 4.0 + uTime * 0.2, uv.y * 4.0 - uTime * 0.2));
  float n = n1 * 0.8 + n2 * 0.2; 

  // 2. Diagonal Axis: Top-Right is 1.0, Bottom-Left is 0.0
  float d = (uv.x + uv.y) * 0.5;
  
  // 3. Move threshold from well above Top-Right down to well below Bottom-Left
  float waveWidth = 0.25; 
  float threshold = mix(1.5, -0.5, uProgress); 

  // 4. Proximity to the diagonal wipe edge
  float distToEdge = d - threshold; 

  // 5. Asymmetric Wiggle: 
  // It trails behind the wave, settling slowly, but the leading edge is sharper.
  float influence = 0.0;
  if (d > threshold) {
    // Behind the wave (Image B is showing) -> thick settling trail
    influence = smoothstep(waveWidth * 1.5, 0.0, distToEdge) * uDistortion;
  } else {
    // Ahead of the wave (Image A is showing) -> sharper cut
    influence = smoothstep(waveWidth * 0.5, 0.0, abs(distToEdge)) * uDistortion;
  }

  // 6. Displacement: Push pixels diagonally with the wave
  vec2 displacement = vec2(n * 0.25, n * 0.25) * influence;

  // 7. Subtle chromatic aberration
  float rgbShift = 0.015 * influence;

  // 8. Jagged boundary mix warped heavily by the noise
  float boundary = d + n * 0.3 * influence;
  
  // At mixVal = 0, we see Image A. At mixVal = 1, we see Image B.
  float mixVal = smoothstep(threshold - waveWidth * 0.5, threshold + waveWidth * 0.5, boundary);

  // 9. Sample Textures with localized RGB shift
  vec2 uvR = uv + displacement + vec2(rgbShift, -rgbShift * 0.5);
  vec2 uvG = uv + displacement;
  vec2 uvB = uv + displacement - vec2(rgbShift, -rgbShift * 0.5);

  vec4 colorA = vec4(
      texture2D(uTextureA, uvR).r,
      texture2D(uTextureA, uvG).g,
      texture2D(uTextureA, uvB).b,
      1.0
  );

  vec4 colorB = vec4(
      texture2D(uTextureB, uvR).r,
      texture2D(uTextureB, uvG).g,
      texture2D(uTextureB, uvB).b,
      1.0
  );

  // 10. Final composite 
  gl_FragColor = mix(colorA, colorB, mixVal);
}
`;

// ─────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────
function createVideoEl(src: string) {
  const v = document.createElement('video');
  v.src = src;
  if (src.startsWith('http://') || src.startsWith('https://')) {
    v.crossOrigin = 'anonymous';
  }
  v.loop = true;
  v.muted = true;
  v.playsInline = true;
  v.autoplay = true;
  v.load();
  return v;
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function HeroCarousel() {
  const router = useRouter();
  const mountRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<any>({});
  const videosRef = useRef<HTMLVideoElement[]>([]);
  const texturesRef = useRef<THREE.VideoTexture[]>([]);
  const uniformsRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const transRef = useRef(false);
  const heroRef = useRef<HTMLElement>(null);

  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);

  const { scramble: scrambleSubtitle } = useEncryptText(SLIDES[current].subtitle, subtitleRef);
  const { scramble: scrambleCta } = useEncryptText(SLIDES[current].cta, ctaRef);
  const { play: playHeading } = useServiceCharAnim(headingRef);

  useEffect(() => {
    // Play initial typography animations after a short delay
    const t = setTimeout(() => {
      scrambleSubtitle();
      scrambleCta();
      playHeading();
    }, 500);
    return () => clearTimeout(t);
  }, [scrambleSubtitle, scrambleCta, playHeading]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    const videoEls = SLIDES.map(s => createVideoEl(s.src));
    videoEls.forEach(v => v.play().catch(() => { }));
    const textures = videoEls.map(v => {
      const t = new THREE.VideoTexture(v);
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
    videosRef.current = videoEls;
    texturesRef.current = textures;

    const clock = new THREE.Clock();

    const uniforms = {
      uTextureA: { value: textures[0] },
      uTextureB: { value: textures[1] },
      uProgress: { value: 0.0 },
      uDistortion: { value: 0.0 },
      uTime: { value: 0.0 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });

    const geo = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    let rafId: number;
    function animate() {
      rafId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      textures.forEach(t => t.needsUpdate = true);
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    threeRef.current = { renderer, scene, camera };

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
      videoEls.forEach(v => { v.pause(); v.src = ''; });
    };
  }, []);

  const transitionTo = useCallback((nextIndex: number) => {
    if (transRef.current) return;
    transRef.current = true;

    const uniforms = uniformsRef.current;
    const textures = texturesRef.current;

    uniforms.uTextureA.value = textures[current];
    uniforms.uTextureB.value = textures[nextIndex];
    uniforms.uProgress.value = 0.0;
    uniforms.uDistortion.value = 0.0;

    const tl = gsap.timeline({
      onComplete: () => {
        uniforms.uTextureA.value = textures[nextIndex];
        uniforms.uProgress.value = 0.0;
        uniforms.uDistortion.value = 0.0;
        transRef.current = false;
      },
    });

    // 1. The main swipe: diagonal progress (Top-Right to Bottom-Left) - stretched to 5.5 seconds
    tl.to(uniforms.uProgress, {
      value: 1.0,
      duration: 5.5,
      ease: 'power4.inOut',
    }, 0.0);

    // 2. Liquid distortion peaks midway (takes 2.2s to reach peak)
    tl.to(uniforms.uDistortion, {
      value: 1.3,
      duration: 2.2,
      ease: 'power2.in',
    }, 0.0);

    // 3. The "Wiggle Settle": extremely long, slow 4.0s decay back to 0.0 to let the liquid settle
    tl.to(uniforms.uDistortion, {
      value: 0.0,
      duration: 4.0,
      ease: 'power3.out',
    }, 2.2);

    // Swap slide typography content mid-transition and trigger text animations
    tl.call(() => {
      setCurrent(nextIndex);
      
      // Defer the animations slightly so React can update the DOM with the new text first
      setTimeout(() => {
        scrambleSubtitle();
        scrambleCta();
        playHeading();
      }, 50);
    }, [], 1.5);
  }, [current]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const next = (current + 1) % SLIDES.length;
      transitionTo(next);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [current, transitionTo]);

  return (
    <section
      ref={heroRef}
      onClick={() => router.push(`/featured-projects/${SLIDES[current].slug}`)}
      className="relative w-full h-[90vh] overflow-hidden bg-black cursor-none"
    >
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Hide Crosshair on mobile */}
      <div className="hidden md:block absolute inset-0 z-50 pointer-events-none">
        <Crosshair 
          containerRef={heroRef as React.RefObject<HTMLElement>} 
          color="rgba(255,255,255,0.4)" 
          bottomElement={
            <span
              className="text-white/80 font-light tracking-[0.35em]"
              style={{ fontSize: '13px' }}
            >
              0{current + 1}/0{SLIDES.length}
            </span>
          }
        />
      </div>

      {/* Mobile static vertical grid line and bottom border dot */}
      <div className="md:hidden absolute top-0 bottom-0 left-[50px] w-px bg-white/10 z-10" />
      <div className="md:hidden absolute bottom-0 left-[48px] w-[5px] h-[5px] bg-white translate-y-1/2 z-20" />

      <div className="relative z-20 flex flex-col justify-between h-full pl-[72px] pr-4 md:pl-[40px] md:pr-4 md:px-[40px] pt-28 md:pt-24 pb-8 md:pb-10 pointer-events-none">
        <div className="hidden md:block absolute top-[5.5rem] right-[40px] text-right hero-text-inner" style={{ pointerEvents: 'auto' }}>
          <p className="text-white/80 text-[15px] font-medium leading-[1.6] tracking-wide whitespace-pre-line">
            {SLIDES[current].topRightText}
          </p>
        </div>

        {/* ── CENTERED TEXT BLOCK ── */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center pl-[16vw] md:pl-[40px] max-w-2xl">
          <div className="relative px-2 md:px-0 hero-text-inner" style={{ pointerEvents: 'auto' }}>
            <div className="md:hidden w-full relative mb-6">
              <p className="text-white/90 text-[13px] tracking-widest  font-light ">PLAY</p>
              {/* Horizontal grid line from screen-left edge to screen-right edge */}
              <div className="absolute left-[-72px] right-[-16px] h-px bg-white/10" style={{ top: '32px' }} />
              {/* Intersection dot on the vertical line (left: 52px is -20px relative to parent padding of 72px) */}
              <div className="absolute left-[-5.4vw] w-[5px] h-[5px] bg-white" style={{ top: '29.5px' }} />
            </div>

            <p 
              ref={subtitleRef}
              className="mb-2 md:mb-4 text-[14px] font-normal tracking-wide normal-case md:uppercase md:tracking-[0.4em] md:font-light text-white/90 md:text-white/60 min-h-[1.5em]"
            />
            
            <h1 
              ref={headingRef}
              className="font-display text-[3.8rem] md:text-[clamp(4.5rem,8vw,8rem)] leading-[1] md:leading-[0.95] tracking-tight text-white whitespace-pre-line font-light"
            >
              {SLIDES[current].heading.split("").map((ch, i) => 
                ch === '\n' ? (
                  <br key={i} />
                ) : (
                  <span key={i} className="svc-char inline-block whitespace-pre">
                    {ch === " " ? "\u00a0" : ch}
                  </span>
                )
              )}
            </h1>

            <p className="md:hidden mt-5 text-white/90 text-[15px] font-light leading-[1.4] whitespace-pre-line">
              {SLIDES[current].topRightText}
            </p>

            <div 
              ref={ctaRef}
              className="inline-block mt-8 md:mt-8 bg-white text-black px-5 py-2.5 md:px-8 md:py-3 text-[14px] md:text-[13px] font-medium tracking-wide md:tracking-[0.2em] min-h-[2.5em] min-w-[10em]"
            />
          </div>
        </div>
      </div>
      
      {/* ── DESKTOP BOTTOM NAVIGATION DOTS ── */}
      <div className="hidden md:flex absolute bottom-8 left-0 right-0 z-20 items-center w-full px-[40px]" style={{ pointerEvents: 'auto' }}>
        <div className="relative z-10 flex items-center justify-center gap-40 w-full md:max-w-[100%]">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (i !== current) transitionTo(i);
              }}
              className={`transition-all duration-700 cursor-pointer bg-white ${
                i === current ? "w-[8px] h-[8px]" : "w-[4px] h-[4px] opacity-40"
              }`}
              style={{ borderRadius: 0, boxShadow: 'none' }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION GRID LINE & CONTROLS ── */}
      <div className="md:hidden absolute bottom-[40px] left-0 right-0 z-20 flex items-center h-[1px]" style={{ pointerEvents: 'auto' }}>
        {/* Horizontal Grid Line */}
        {/* <div className="absolute inset-0 h-px bg-white/10" /> */}
        
        {/* Intersection dot on the vertical line (at left: 52px center, so 49.5px left) */}
        {/* <div className="absolute -bottom-1 left-[48px] w-[5px] h-[5px] bg-white -translate-y-1/2" /> */}

        {/* Controls Container */}
        <div className="relative w-full flex items-center justify-between pl-[72px] pr-[40px] -translate-y-1/2">
          {/* Slide Dots */}
          <div className="flex items-center gap-[40px]">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  if (i !== current) transitionTo(i);
                }}
                className={`transition-all duration-700 cursor-pointer bg-white ${
                  i === current ? "w-[8px] h-[8px]" : "w-[4px] h-[4px] opacity-40"
                }`}
                style={{ borderRadius: 0, boxShadow: 'none' }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Page Index */}
          <span className="text-white/80 font-light tracking-[0.35em] text-[13px] translate-y-[2px]">
            0{current + 1}/0{SLIDES.length}
          </span>
        </div>
      </div>
    </section>
  );
}