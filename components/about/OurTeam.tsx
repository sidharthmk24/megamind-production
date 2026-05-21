"use client";

import React, { useRef } from "react";
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
  { value: "250+", label: "Projects produced" },
  { value: "50+", label: "Industry partnerships" },
  { value: "10M+", label: "Combined content impressions" },
];

export default function OurTeam() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const introRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="bg-black text-white relative w-full overflow-hidden box-border px-[40px] max-[900px]:px-[20px]">
      {/* Full-height structural grid lines */}
      <div className="absolute left-[40px] top-0 bottom-0 w-[1px] bg-white/20 z-10 pointer-events-none max-[900px]:left-[20px]" />
      <div className="absolute right-[40px] top-0 bottom-0 w-[1px] bg-white/20 z-10 pointer-events-none max-[900px]:right-[20px]" />

      {/* ── SECTION 1: Intro ── */}
      <div ref={introRef} className="pt-[80px] pb-[60px] px-[40px] flex justify-between items-end gap-[48px] border-t border-b border-white/20 relative max-[900px]:pt-[60px] max-[900px]:pb-[48px] max-[900px]:px-[20px] max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[36px]">
        {/* Top Border Dots */}
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "0%", top: "0%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "0%" }} />

        {/* Bottom Border Dots */}
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "0%", top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "33.333%", top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "100%" }} />

        <div className="max-w-[70%] max-[900px]:max-w-full">
           <p
                className="text-[14px] md:text-[12px] text-white/50 md:text-white/40 font-light tracking-normal md:tracking-[0.2em] md:uppercase"
                data-about-copy
              >
                Who we are
              </p>
          <h2 className="text-[clamp(24px,2.5vw,34px)] leading-[1.35] font-light tracking-[-0.02em] text-white">
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

      {/* ── SECTION 2: Core Team Headline & Swiper ── */}
      <div className="grid grid-cols-[1fr_2fr] border-b border-white/20 relative max-[900px]:grid-cols-1">
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "0%", top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "33.333%", top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "66.666%", top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "100%" }} />

        <div className="border-r border-white/20 pt-[80px] pb-[40px] px-[40px] flex flex-col justify-between min-h-[480px] box-border max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:border-white/20 max-[900px]:pt-[60px] max-[900px]:pb-[40px] max-[900px]:px-[20px] max-[900px]:min-h-auto max-[900px]:gap-[40px]">
          <h2 className="text-[clamp(48px,6vw,84px)] font-medium leading-none tracking-[-0.02em] uppercase text-white">
            <span className="block">OUR</span>
            <span className="block">CORE</span>
            <span className="block">TEAM</span>
          </h2>
          <div className="flex justify-end items-end w-full">
            {/* <span className="ot-meta-tag">24/9</span> */}
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

        <div className="pt-[80px] pb-[80px] pl-[40px] pr-0 overflow-hidden flex items-center max-[900px]:pt-[40px] max-[900px]:pb-[60px] max-[900px]:pl-[20px]">
          <div
            ref={scrollRef}
            className="flex gap-[40px] overflow-x-auto scroll-smooth w-full pr-[40px] cursor-grab select-none active:cursor-grabbing no-scrollbar"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {TEAM_MEMBERS.map((member, idx) => (
              <div className="min-w-[280px] max-w-[280px] shrink-0 flex flex-col group" key={idx}>
                <div className="w-full aspect-square relative overflow-hidden bg-white/5 mb-[24px]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="280px"
                    className="object-cover grayscale transition-[filter,transform] duration-500 ease-[ease] group-hover:grayscale-0 group-hover:scale-105"
                    draggable={false}
                  />
                </div>
                <h3 className="text-[20px] font-light text-white mb-[6px] tracking-[-0.01em]">{member.name}</h3>
                <span className="text-[13px] text-white/40 font-light">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Metrics ── */}
      <div className="grid grid-cols-3 border-b border-white/20 relative max-[900px]:grid-cols-1">
        {METRICS.map((metric, idx) => (
          <div className="border-r border-white/20 py-[80px] px-[20px] flex flex-col items-center justify-center text-center relative last:border-r-0 max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:border-white/20 max-[900px]:py-[50px] max-[900px]:px-[20px] max-[900px]:last:border-b-0" key={idx}>
            <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "0%", top: "100%" }} />
            {idx === 0 && <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "100%" }} />}
            {idx === 1 && <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "100%" }} />}
            <span className="text-[clamp(40px,5vw,64px)] font-light leading-none text-white mb-[12px] tracking-[-0.02em]">{metric.value}</span>
            <span className="text-[13px] text-white/40 font-light tracking-[0.02em]">{metric.label}</span>
          </div>
        ))}
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "100%" }} />
      </div>
    </section>
  );
}