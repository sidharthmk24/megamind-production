"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { label: "Projects produced", suffix: "+", value: 250 },
  { label: "Industry partnerships", suffix: "+", value: 50 },
  { label: "Combined content impressions", suffix: "M+", value: 10 },
];

// Reusable Node component for the perfect intersecting white squares
const Node = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div
    className={`absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-40 ${className}`}
    style={style}
  />
);

export default function Metrics() {
  const metricsRef = useRef<HTMLElement | null>(null);
  const metricsHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const metricsHeadingMobileRef = useRef<HTMLHeadingElement | null>(null);
  const [activeMetric, setActiveMetric] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const splitText = (text: string) => {
    return text.split("").map((ch, i) => (
      <span key={i} className="svc-char inline-block whitespace-pre will-change-opacity">
        {ch === " " ? "\u00a0" : ch}
      </span>
    ));
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleManualSelect = (index: number) => {
    setActiveMetric(index);
    startTimer();
  };

  // Touch gesture state and handlers
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const difference = touchStartX.current - touchEndX.current;

    if (Math.abs(difference) > swipeThreshold) {
      if (difference > 0) {
        setActiveMetric((prev) => (prev + 1) % metrics.length);
      } else {
        setActiveMetric((prev) => (prev - 1 + metrics.length) % metrics.length);
      }
      startTimer();
    }
  };

  useGSAP(
    () => {
      // Counter animation
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const target = Number(element.dataset.value ?? 0);
        const suffix = element.dataset.suffix ?? "";

        ScrollTrigger.create({
          trigger: element,
          start: "top 95%",
          onEnter: () => {
            const counter = { value: 0 };
            gsap.to(counter, {
              duration: 2.5,
              value: target,
              ease: "power3.out",
              onUpdate: () => {
                element.textContent = `${Math.floor(counter.value)}${suffix}`;
              },
            });
          },
        });
      });

      // General fade up for text
      gsap.from("[data-metric-fade]", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: metricsRef.current,
          start: "top 80%",
        },
      });

      // Character flicker intro animation for metrics headings
      const desktopChars = metricsHeadingRef.current?.querySelectorAll(".svc-char");
      const mobileChars = metricsHeadingMobileRef.current?.querySelectorAll(".svc-char");

      const allMetricsChars = [
        ...(desktopChars ? Array.from(desktopChars) : []),
        ...(mobileChars ? Array.from(mobileChars) : []),
      ];

      if (allMetricsChars.length > 0) {
        gsap.timeline({
          scrollTrigger: {
            trigger: metricsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        })
        .to(allMetricsChars, {
          opacity: 0,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        })
        .to(allMetricsChars, {
          opacity: 1,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        }, "-=0.15");
      }
    },
    { scope: metricsRef }
  );

  return (
    <section
      id="metrics"
      ref={metricsRef}
      className="relative w-full min-h-screen md:h-screen bg-[black] text-white overflow-hidden"
    >
      {/* =========================================
          MOBILE LAYOUT
          ========================================= */}
      <div className="md:hidden relative z-10 w-full pl-[50px] pr-0 flex flex-col pb-12">
        {/* Top Video */}
        <div className="w-full aspect-[1.4] overflow-hidden mb-6 px-2 py-2">
          {/* <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            src="https://firebasestorage.googleapis.com/v0/b/megamind-carrers.firebasestorage.app/o/MM%20WEB%20TEST%2001.mp4?alt=media&token=e62aba7e-54a2-4c29-99c8-0216a73c6ed2"
          /> */}
          <Image
            src="/images/aboutImages/choose1.png"
            alt=""
            width={100}
            height={100}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="px-2 pr-6 mb-12">
          <p className="text-[12px] text-white/40 font-light tracking-[0.2em] uppercase mb-4" data-metric-fade>
            Why choose us
          </p>
          <h2 ref={metricsHeadingMobileRef} className="text-[26px] leading-[1.3] font-light tracking-tight text-white/95 mb-10">
            {splitText("We combine cinematic production with commercial understanding.")}
          </h2>
          <p className="text-[13px] leading-[1.65] text-white/70 font-light pr-2" data-metric-fade>
            We work with brands across hospitality, corporate, retail, healthcare, education, and real estate, creating visual content tailored to the way each industry communicates. From premium hospitality experiences to modern business storytelling, our approach combines cinematic production with strategic brand understanding.
          </p>
        </div>

        {/* Horizontal Divider */}
        <div className="relative w-full h-[1px] mb-10 overflow-visible">
          <div className="absolute top-0 h-[1px] left-[-50px] right-0 bg-white/20" />
          <Node className="top-1/2" style={{ left: '0' }} />
        </div>

        {/* Metrics Slider */}
        <div
          className="flex flex-col items-center justify-center relative w-full mb-4 touch-pan-y cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-[100px] overflow-hidden flex items-center justify-center">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${idx === activeMetric ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
              >
                <h3
                  className="text-[2.2rem] font-light leading-none mb-1 text-white"
                  data-count
                  data-value={m.value}
                  data-suffix={m.suffix}
                >
                  0{m.suffix}
                </h3>
                <p className="text-[13px] text-white/60 font-light tracking-wide text-center">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Dots with enlarged touch targets */}
          <div className="flex items-center gap-1 mt-4 relative z-20">
            {metrics.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManualSelect(i)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer bg-transparent border-0 outline-none"
                aria-label={`Go to metric ${i + 1}`}
              >
                <div
                  className={`transition-all duration-500 rounded-none ${
                    i === activeMetric ? "w-[8px] h-[2px] bg-white" : "w-[5px] h-[5px] bg-white/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Horizontal Divider to match grid */}
        <div className="relative w-full h-[1px] mt-10 overflow-visible">
          <div className="absolute top-0 h-[1px] left-[-50px] right-0 bg-white/20" />
          <Node className="top-1/2" style={{ left: '0' }} />
        </div>
      </div>

      {/* =========================================
          DESKTOP LAYOUT
          ========================================= */}
      <div className="hidden md:block w-full h-full relative">
        {/* =========================================
            INTERNAL STRUCTURAL GRID LINES
          ========================================= */}
        {/* Outer horizontal bounds (40px inset) */}
        {/* <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-white/20 pointer-events-none -translate-y-1/2" /> */}
        <div className="absolute bottom-[48px] left-0 right-0 h-[1px] bg-white/20 pointer-events-none -translate-y-1/2" />

        {/* Center vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none -translate-x-1/2" />

        {/* Middle horizontal line segments - broken at the video area */}
        {/* <div className="absolute bottom-[31%] left-0 w-[40px] h-[1px] bg-white/20 pointer-events-none -translate-y-1/2" /> */}
        <div className="absolute bottom-[31%] left-1/2 right-0 h-[1px] bg-white/20 pointer-events-none -translate-y-1/2" />

        {/* Metrics vertical dividers (Right side only) */}
        <div className="absolute left-[calc(50%+(50%-40px)/3)] -bottom-2 h-[calc(32%)] w-[1px] bg-white/20 pointer-events-none -translate-x-1/2" />
        <div className="absolute left-[calc(50%+2*(50%-40px)/3)] -bottom-2 h-[calc(32%)] w-[1px] bg-white/20 pointer-events-none -translate-x-1/2" />

        {/* =========================================
          INTERSECTION NODES (internal only)
          ========================================= */}
        {/* Top Bound Nodes */}
        {/* <Node className="left-[40px] top-[40px]" /> */}
        {/* <Node className="left-1/2 top-[0px]" /> */}
        {/* <Node className="left-[calc(100%-40px)] top-[40px]" /> */}

        {/* Middle Bound Nodes (at bottom-[30.5%]) */}
        <Node className="left-[40px] bottom-[30.5%]" />
        <Node className="left-1/2 bottom-[30.5%]" />
        <Node className="left-[calc(50%+(50%-40px)/3)] bottom-[30.5%]" />
        <Node className="left-[calc(50%+2*(50%-40px)/3)] bottom-[30.5%]" />
        <Node className="left-[calc(100%-40px)] bottom-[30.5%]" />

        {/* Bottom Bound Nodes (at bottom-[44px]) */}
        <Node className="left-[40px] bottom-[44px]" />
        <Node className="left-1/2 bottom-[44px]" />
        <Node className="left-[calc(50%+(50%-40px)/3)] bottom-[44px]" />
        <Node className="left-[calc(50%+2*(50%-40px)/3)] bottom-[44px]" />
        <Node className="left-[calc(100%-40px)] bottom-[44px]" />

        {/* =========================================
          CONTENT AREAS
          ========================================= */}

        {/* Left Column: Image/Video Area */}
        <div className="absolute left-[40px] right-1/2 top-[40px] bottom-[40px]  md:px-16 md:pb-16 md:pt-3 flex items-center justify-center">
          <div className="relative w-full h-full max-w-[700px] overflow-hidden bg-zinc-900 shadow-2xl">
           <Image
            src="/images/aboutImages/choose1.png"
            alt=""
            width={100}
            height={100}
            className="h-full w-full object-cover"
          />
          </div>
        </div>

        {/* Right Column Top: Text Intro */}
        <div className="absolute left-1/2 right-[40px] top-[40px] bottom-[30%] flex flex-col justify-center px-12 lg:px-12 ">
          {/* Top Right Label */}
          <div className="absolute -top-5 right-5 text-[11px] text-white/40 tracking-widest font-light">
            26/h
          </div>

          <div>
            <p
              className="text-[12px] text-white/40 font-light tracking-[0.2em] uppercase mb-6"
              data-metric-fade
            >
              Why choose us
            </p>
            <h2 ref={metricsHeadingRef} className="text-[clamp(2.2rem,3.5vw,3.5rem)] font-light leading-[1.1] tracking-tight mb-10 text-white">
              {splitText("We combine cinematic production with commercial understanding.")}
            </h2>
            <p className="max-w-[85%] text-[14px] leading-relaxed text-[#8a8a8a] font-light" data-metric-fade>
              We work with brands across hospitality, corporate, retail,
              healthcare, education, and real estate, creating visual content
              tailored to the way each industry communicates. From premium
              hospitality experiences to modern business storytelling, our approach
              combines cinematic production with strategic brand understanding.
            </p>
          </div>
        </div>

        {/* Right Column Bottom: Metrics Grid */}
        <div className="absolute left-1/2 right-[40px] bottom-[50px] h-[calc(30%-40px)] flex ">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <h3
                className="text-[3rem] xl:text-[4rem] font-light leading-none mb-3 text-white"
                data-count
                data-value={m.value}
                data-suffix={m.suffix}
              >
                0{m.suffix}
              </h3>
              <p className="text-[12px] text-[#8a8a8a] font-light tracking-wide text-center">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}