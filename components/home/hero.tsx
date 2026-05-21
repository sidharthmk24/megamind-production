"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Crosshair from "../ui/Crosshair";

gsap.registerPlugin(useGSAP);

const slides = [
  {
    id: 1,
    subtitle: "Vertex Managed Workspaces",
    heading: "Work Life\nVertex",
    cta: "Podcast Production",
    topRightText: "Created with intent.\nRemembered through emotion.",
    videoUrl:
      "https://firebasestorage.googleapis.com/v0/b/megamind-carrers.firebasestorage.app/o/MM%20WEB%20TEST%2001.mp4?alt=media&token=e62aba7e-54a2-4c29-99c8-0216a73c6ed2",
  },
  {
    id: 2,
    subtitle: "Cinematic Storytelling",
    heading: "Frame The\nFuture",
    cta: "Film Production",
    topRightText: "Visionary visuals.\nUnforgettable impact.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 3,
    subtitle: "Digital Innovation",
    heading: "Design The\nMotion",
    cta: "Brand Identity",
    topRightText: "Precision in motion.\nExcellence in design.",
    videoUrl:
      "https://firebasestorage.googleapis.com/v0/b/megamind-carrers.firebasestorage.app/o/MM%20WEB%20TEST%2001.mp4?alt=media&token=e62aba7e-54a2-4c29-99c8-0216a73c6ed2",
  },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG Filter Refs
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const getSlide = useCallback((i: number) => {
    return containerRef.current?.querySelector<HTMLElement>(`[data-slide-index="${i}"]`) ?? null;
  }, []);

  // ─────────────────────────────────────────────
  // INITIAL SETUP
  // ─────────────────────────────────────────────

  useGSAP(() => {
    slides.forEach((_, i) => {
      const slide = getSlide(i);
      if (!slide) return;
      gsap.set(slide, {
        visibility: i === 0 ? "visible" : "hidden",
        zIndex: i === 0 ? 10 : 1,
      });
    });

    const first = getSlide(0);
    if (first) {
      gsap.from(first.querySelectorAll("[data-animate]"), {
        duration: 1.6, opacity: 0, y: 50, stagger: 0.1, ease: "expo.out", delay: 0.5,
      });
    }
  }, { scope: heroRef });

  // ─────────────────────────────────────────────
  // THE FIRST FRAME PARIS: GLOBAL RIPPLE SWAP
  // ─────────────────────────────────────────────

  const goToNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const currentIdx = activeIndexRef.current;
    const nextIdx = (currentIdx + 1) % slides.length;
    const currentSlide = getSlide(currentIdx);
    const nextSlide = getSlide(nextIdx);

    if (!currentSlide || !nextSlide) return;

    // Randomize the liquid turbulence seed so every transition feels organic
    gsap.set(turbulenceRef.current, { attr: { seed: Math.random() * 100 } });

    // Ensure the new slide is ready underneath the chaos
    gsap.set(nextSlide, { visibility: "visible", zIndex: 5 });
    gsap.set(nextSlide.querySelectorAll("[data-animate]"), { opacity: 0, y: 40 });

    const tl = gsap.timeline({
      onComplete: () => {
        activeIndexRef.current = nextIdx;
        setActiveIndex(nextIdx);
        isAnimatingRef.current = false;
      }
    });

    // 1. RAMP UP THE DISTORTION (Tear the current image apart)
    tl.to(displacementRef.current, {
      attr: { scale: 250 }, // Massive scale creates the "broken glass/water" look
      duration: 0.8,
      ease: "power2.in",
    });

    // 2. THE SWAP (Happens invisibly while the screen is completely distorted)
    tl.add(() => {
      gsap.set(currentSlide, { zIndex: 1, visibility: "hidden" });
      gsap.set(nextSlide, { zIndex: 10 });

      // We add a subtle physical push to mimic the First Frame camera pan
      const nextVid = nextSlide.querySelector("video");
      if (nextVid) {
        gsap.fromTo(nextVid, { scale: 1.15, xPercent: 5 }, { scale: 1, xPercent: 0, duration: 3, ease: "power2.out" });
      }
    });

    // 3. RESOLVE THE DISTORTION (Settle into the new video)
    tl.to(displacementRef.current, {
      attr: { scale: 0 },
      duration: 1.2,
      ease: "power3.out",
    });

    // 4. TEXT ANIMATIONS
    // Old text fades fast before the peak
    gsap.to(currentSlide.querySelectorAll("[data-animate]"), {
      opacity: 0, y: -20, stagger: 0.05, duration: 0.4, ease: "power2.in"
    });

    // New text slides up as the liquid settles
    gsap.to(nextSlide.querySelectorAll("[data-animate]"), {
      opacity: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "expo.out", delay: 0.9,
    });

  }, [getSlide]);

  // ─────────────────────────────────────────────
  // AUTO LOOP
  // ─────────────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section ref={heroRef} className="relative w-full h-screen overflow-hidden bg-black cursor-none">

      {/* ─── GLOBAL LIQUID FILTER ─── */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="globalLiquid" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            {/* The baseFrequency determines the "shape" of the water. 
                0.005 0.02 creates stretched, cinematic horizontal ripples like the video. */}
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.005 0.02"
              numOctaves="2"
              result="noise"
            />
            {/* The scale attribute is what we animate from 0 -> 250 -> 0 */}
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 z-50 pointer-events-none">
        <Crosshair containerRef={heroRef as React.RefObject<HTMLElement>} color="rgba(255,255,255,0.4)" />
      </div>

      {/* WE APPLY THE FILTER TO THE ENTIRE CAROUSEL CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{ filter: "url(#globalLiquid)" }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} data-slide-index={index} className="absolute inset-0 w-full h-full">

            {/* ── MEDIA WRAPPER ── */}
            <div className="media-wrapper absolute inset-0 overflow-hidden w-full h-full">
              <div className="absolute inset-0 bg-black/35 z-10" />
              <video
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover transform-gpu"
                src={slide.videoUrl}
              />
            </div>

            {/* ── TYPOGRAPHY ── */}
            <div className="relative z-20 flex flex-col justify-between h-full pl-[40px] pr-4 md:px-[40px] pt-28 md:pt-24 pb-8 md:pb-10">
              
              {/* Top Right Text (Desktop Only) */}
              <div className="hidden md:block absolute top-[5.5rem] right-[40px] text-right" data-animate>
                <p className="text-white/80 text-[15px] font-medium leading-[1.6] tracking-wide whitespace-pre-line">
                  {slide.topRightText}
                </p>
              </div>

              {/* Main Content Area */}
              <div className="mt-auto mb-12 md:mt-[15vh] md:mb-0 max-w-2xl relative px-2 md:px-0">
                
                {/* Mobile 'PLAY' line */}
                <div className="md:hidden w-full relative mb-6" data-animate>
                  <p className="text-white/90 text-[13px] tracking-widest mb-3 font-light">PLAY</p>
                  {/* Absolute positions ignore the px-2 padding and stay aligned with the 40px grid line */}
                  <div className="absolute left-[-40px] w-[100vw] h-[1px] bg-white/20" />
                  <div className="absolute left-[-42.5px] bottom-[-2px] w-[5px] h-[5px] bg-white" />
                </div>

                <p data-animate className="mb-2 md:mb-4 text-[14px] font-normal tracking-wide normal-case md:uppercase md:tracking-[0.4em] md:font-light text-white/90 md:text-white/60">
                  {slide.subtitle}
                </p>
                <h1 data-animate className="font-display text-[3.8rem] md:text-[clamp(4.5rem,8vw,8rem)] leading-[1] md:leading-[0.95] tracking-tight text-white whitespace-pre-line font-light">
                  {slide.heading}
                </h1>
                
                {/* Mobile "TopRight Text" rendered under heading */}
                <p data-animate className="md:hidden mt-5 text-white/90 text-[15px] font-light leading-[1.4] whitespace-pre-line">
                  {slide.topRightText}
                </p>

                <div data-animate className="inline-block mt-8 md:mt-8 bg-white md:bg-white/5 md:border md:border-white/20 text-black md:text-white md:backdrop-blur-md px-5 py-2.5 md:px-8 md:py-3 text-[14px] md:text-[13px] font-medium md:font-normal md:uppercase tracking-wide md:tracking-[0.3em]">
                  {slide.cta}
                </div>
              </div>

              {/* ── PAGINATION — white square nav dots ── */}
              <div className="relative flex items-center justify-between md:justify-center w-full mt-auto md:mt-0 px-2 md:px-0" data-animate>
                <div className="relative z-10 flex items-center justify-between w-full pr-4 md:pr-0 md:max-w-[55%]">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`transition-all duration-700 ${i === activeIndex
                        ? "w-[4px] h-[4px] md:w-[7px] md:h-[7px] bg-white md:shadow-[0_0_10px_white]"
                        : "w-[3px] h-[3px] md:w-[5px] md:h-[5px] bg-white/30"
                        }`}
                    />
                  ))}
                  <span className="relative z-10 md:bg-black/20 md:backdrop-blur-sm md:px-6 py-1 text-[13px] md:text-[12px] md:tracking-[0.4em] text-white/80 md:text-white/60 font-light">
                    0{activeIndex + 1}/0{slides.length}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}