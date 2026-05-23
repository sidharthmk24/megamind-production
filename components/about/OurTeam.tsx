"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import EncryptText from "@/components/home/encrypt-text";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { name: "Vishnu Pradeep", role: "CEO", image: "/images/team/ceo.png" },
  { name: "Abhith A S", role: "Creative Director", image: "/images/team/creative_director.png" },
  { name: "Janees", role: "Production Manager", image: "/images/team/production_manager.png" },
  { name: "Vishnu Pradeep", role: "CEO", image: "/images/team/ceo.png" },
  { name: "Abhith A S", role: "Creative Director", image: "/images/team/creative_director.png" },
];

const METRICS = [
  { value: 250, suffix: "+", label: "Projects produced" },
  { value: 50, suffix: "+", label: "Industry partnerships" },
  { value: 10, suffix: "M+", label: "Combined content impressions" },
];

export default function OurTeam() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollMobileRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const introRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Metrics slider states & refs
  const [activeMetric, setActiveMetric] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useGSAP(
    () => {
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { x: 0 },
          {
            x: 113,
            ease: "none",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 60%",
              end: "bottom 40%",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: introRef }
  );

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
    },
    { scope: sectionRef }
  );

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % METRICS.length);
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
        setActiveMetric((prev) => (prev + 1) % METRICS.length);
      } else {
        setActiveMetric((prev) => (prev - 1 + METRICS.length) % METRICS.length);
      }
      startTimer();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -252 : 252, behavior: "smooth" });
  };

  const scrollMobile = (dir: "left" | "right") => {
    if (!scrollMobileRef.current) return;
    const cardWidth = scrollMobileRef.current.clientWidth;
    scrollMobileRef.current.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="bg-black text-white relative w-full overflow-hidden box-border px-[40px] max-[900px]:px-0">
      {/* Full-height structural grid lines */}
      <div className="absolute left-[40px] top-0 bottom-0 w-[1px] bg-white/20 z-10 pointer-events-none max-[900px]:left-[50px] " />
      <div className="absolute right-[40px] top-0 bottom-0 w-[1px] bg-white/20 z-10 pointer-events-none max-[900px]:hidden" />

      {/* ── SECTION 1: Intro ── */}
      <div ref={introRef} className="pt-[80px] pb-[60px] md:px-[40px] flex justify-between items-end gap-[48px] border-t border-b border-white/20 relative max-[900px]:pt-[32px] max-[900px]:pb-[24px] max-[900px]:pl-[60px] max-[900px]:pr-[20px] max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[24px]">
        {/* Top Border Dots */}
        {/* <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none max-[900px]:left-[50px] left-[0%] hidden md:block" style={{ top: "0%" }} /> */}
        {/* <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] max-[900px]:hidden" style={{ top: "0%" }} /> */}

        {/* Bottom Border Dots */}
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none max-[900px]:left-[50px] left-[0%]" style={{ top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[33.333%] max-[900px]:hidden" style={{ top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] max-[900px]:hidden" style={{ top: "100%" }} />

        <div className="max-w-[70%] max-[900px]:max-w-full max-[900px]:pl-0">
          <p
            className="text-[14px] md:text-[12px] text-white/50 md:text-white/40 font-light tracking-normal md:tracking-[0.2em] md:uppercase mb-3"
            data-about-copy
          >
            Vision
          </p>
          <h2 className="text-[clamp(24px,2.5vw,34px)] leading-[1.3] font-light tracking-[-0.01em] text-white">
            We create cinematic visual content for modern brands, backed by nearly a decade of experience across film, photography, and digital storytelling.
          </h2>
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0 self-end pb-1.5">
          {/* ISO label + thin progress bar */}
          <div className="flex items-center gap-2.5">
            <span className="text-[8.5px] uppercase tracking-[0.22em] text-white/35 font-light">
              ISO : 300
            </span>
            {/* Track */}
            <div className="relative w-[126px] h-[13px] flex items-center">
              {/* Border Box SVG */}
              <svg width="126" height="13" viewBox="0 0 126 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                <rect x="0.25" y="0.25" width="124.75" height="12" stroke="white" strokeWidth="0.5" />
              </svg>
              {/* Sliding white box */}
              <div
                ref={progressBarRef}
                className="absolute left-[0.5px] top-[0.5px]"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="11.75" height="11.75" fill="white" />
                </svg>
              </div>
            </div>
          </div>

          {/* Two square icon buttons — joined, no gap */}
          <div className="flex">
            {/* Arrow / link icon */}
            <div className="w-[30px] h-[30px] border border-white/20 border-r-0 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10H10V2M10 10L1 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* M / menu icon */}
            <div className="w-[30px] h-[30px] border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
              <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.60103 0H0V9.75603H1.60103V0Z" fill="white" />
                <path d="M7.09043 9.75659H5.39119L1.89002 0.00673426L1.88778 0H3.58702L7.00626 9.52426L7.09043 9.75659Z" fill="white" />
                <path d="M8.92885 0H7.32782V9.75603H8.92885V0Z" fill="white" />
                <path d="M14.4182 9.75659H12.719L9.21784 0.00673426L9.21503 0H10.9143L14.3341 9.52426L14.4182 9.75659Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 (Desktop): Core Team Headline & Swiper ── */}
      <div className="hidden min-[901px]:grid grid-cols-[1fr_2fr] border-b border-white/20 relative">
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[0%]" style={{ top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[33.333%]" style={{ top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[66.666%]" style={{ top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%]" style={{ top: "100%" }} />

        <div className="border-r border-white/20 pt-[80px] pb-[40px] px-[40px] flex flex-col justify-between min-h-[480px] box-border">
          <div className="flex justify-between items-end w-full">
            <h2 className="text-[clamp(40px,6vw,84px)] font-normal leading-[1.05] tracking-tight uppercase text-white">
              <span className="block">OUR</span>
              <span className="block">CORE TEAM</span>
            </h2>
          </div>
          <div className="flex justify-end items-end w-full">
            {/* Desktop navigation */}
            <div className="flex gap-[8px]">
              <button
                onClick={() => scroll("left")}
                className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white transition-all duration-300 z-10 cursor-pointer"
                aria-label="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                  <path d="M19 12H5m0 0l7-7m-7 7l7 7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white transition-all duration-300 z-10 cursor-pointer"
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                  <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-[80px] pb-[80px] pl-[40px] pr-0 overflow-hidden flex items-center">
          <div
            ref={scrollRef}
            className="flex gap-[40px] overflow-x-auto scroll-smooth w-full pr-[40px] cursor-grab select-none active:cursor-grabbing no-scrollbar"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {TEAM_MEMBERS.map((member, idx) => (
              <div className="min-w-[260px] max-w-[280px] shrink-0 flex flex-col group" key={idx}>
                <div className="w-full aspect-[4/5] relative overflow-hidden bg-white/5 mb-[16px]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="280px"
                    className="object-cover grayscale transition-[filter,transform] duration-500 ease-[ease] group-hover:grayscale-0 group-hover:scale-105"
                    draggable={false}
                  />
                </div>
                <div className="flex justify-between items-end w-full">
                  <div>
                    <h3 className="text-[22px] font-light text-white mb-[4px] tracking-[-0.01em]">{member.name}</h3>
                    <span className="text-[13px] text-white/40 font-light">{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 2 (Mobile): Core Team Headline & Swiper ── */}
      <div className="block min-[901px]:hidden relative w-full bg-black">
        {/* Heading container with top and bottom borders */}
        <div className="border-t border-b border-white/20 pt-[32px] pb-[24px] pl-[62px] pr-[20px] flex justify-between items-end relative w-full">
          {/* Intersection white dots on the left vertical line */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[50px] top-0" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[50px] top-[100%]" />

          <h2 className="text-[34px] font-normal leading-[1.05] tracking-tight uppercase text-white">
            <span className="block">OUR</span>
            <span className="block">CORE TEAM</span>
          </h2>

          {/* Fractional '24/s' camera parameter mock aligned to core team bottom line */}
          <div className="flex flex-col items-center justify-center font-mono text-[9px] text-white/60 leading-none select-none pb-1.5 mr-1">
            <span className="border-b border-white/30 pb-[1px] px-[2px] text-center w-full">24</span>
            <span className="pt-[1.5px] text-center w-full">s</span>
          </div>
        </div>

        {/* Swiper frame container bounded by left line (50px) and right line (20px) */}
        <div className="relative ml-[50px] mr-[12px] border-l border-r border-b border-white/20 bg-black">
          {/* Four corner intersection white dots for swiper block */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] top-0" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-0 top-[100%]" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] top-[100%]" />

          {/* Horizontal snapping scroll container displaying exactly one member at a time */}
          <div
            ref={scrollMobileRef}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full"
          >
            {TEAM_MEMBERS.map((member, idx) => (
              <div key={idx} className="w-full shrink-0 snap-center p-[20px] pb-4 flex flex-col box-border">
                {/* Perfect square centered image box inside the paddings */}
                <div className="w-full aspect-square relative overflow-hidden bg-white/5 mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 280px"
                    className="object-cover grayscale"
                    draggable={false}
                  />
                </div>
                <h3 className="text-[22px] font-light text-white mb-[4px] tracking-[-0.01em]">{member.name}</h3>
                <span className="text-[13px] text-white/40 font-light">{member.role}</span>
              </div>
            ))}
          </div>

          {/* Center aligned navigation arrow inside the swiper grid container */}
          <div className="flex justify-center items-center gap-2 pb-6 pt-2">
            <button
              onClick={() => scrollMobile("left")}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white active:border-white active:text-white transition-all duration-300 cursor-pointer"
              aria-label="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                <path d="M19 12H5m0 0l7-7m-7 7l7 7" />
              </svg>
            </button>
            <button
              onClick={() => scrollMobile("right")}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white active:border-white active:text-white transition-all duration-300 cursor-pointer"
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 3 (Desktop): Metrics ── */}
      <div className="hidden min-[901px]:grid grid-cols-3 border-b border-white/20 relative">
        {METRICS.map((metric, idx) => (
          <div className="border-r border-white/20 py-[80px] px-[20px] flex flex-col items-center justify-center text-center relative last:border-r-0" key={idx}>
            <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[0%]" style={{ top: "100%" }} />
            {idx === 0 && <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%]" style={{ top: "100%" }} />}
            {idx === 1 && <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%]" style={{ top: "100%" }} />}
            <span
              className="text-[clamp(40px,5vw,64px)] font-normal leading-none text-white mb-[8px] tracking-tight"
              data-count
              data-value={metric.value}
              data-suffix={metric.suffix}
            >
              0{metric.suffix}
            </span>
            <span className="text-[14px] text-white/60 font-light tracking-wide">{idx === 0 ? "Brands assisted" : metric.label}</span>
          </div>
        ))}
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "100%" }} />
      </div>

      {/* ── SECTION 3 (Mobile): Metrics Slider ── */}
      <div className="block min-[901px]:hidden relative z-10 w-full pl-[50px] pr-0 flex flex-col pb-12">
        {/* Horizontal Divider at top of Section 3 */}
        <div className="relative w-full h-[1px] mb-10 overflow-visible">
          <div className="absolute top-0 h-[1px] left-[-50px] right-0 bg-white/20" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-40 left-0 top-1/2" />
        </div>

        {/* Metrics Slider */}
        <div
          className="flex flex-col items-center justify-center relative w-full mb-4 touch-pan-y cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-[100px] overflow-hidden flex items-center justify-center">
            {METRICS.map((m, idx) => (
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
                  {idx === 0 ? "Brands assisted" : m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Dots with enlarged touch targets */}
          <div className="flex items-center gap-1 mt-4 relative z-20">
            {METRICS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManualSelect(i)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer bg-transparent border-0 outline-none"
                aria-label={`Go to metric ${i + 1}`}
              >
                <div
                  className={`transition-all duration-500 rounded-none ${i === activeMetric ? "w-[8px] h-[2px] bg-white" : "w-[5px] h-[5px] bg-white/30"
                    }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Horizontal Divider to match grid */}
        <div className="relative w-full h-[1px] mt-10 overflow-visible">
          <div className="absolute top-0 h-[1px] left-[-50px] right-0 bg-white/20" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-40 left-0 top-1/2" />
        </div>
      </div>
    </section>
  );
}