"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Reusable 5×5 white square dot at a grid intersection
const Node = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div
    className={`absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-40 ${className ?? ""}`}
    style={style}
  />
);

export default function About() {
  const aboutRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-about-copy]", {
        duration: 1,
        opacity: 0,
        stagger: 0.1,
        y: 30,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 75%",
        },
      });

      gsap.utils
        .toArray<HTMLElement>("[data-parallax]")
        .forEach((element, index) => {
          gsap.to(element, {
            ease: "none",
            y: index === 0 ? -20 : 30,
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { x: 0 },
          {
            x: 113,
            ease: "none",
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 60%",
              end: "bottom 40%",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: aboutRef }
  );

  return (
    <section
      id="about"
      ref={aboutRef}
      className="relative w-full bg-black text-white overflow-hidden"
    >
      {/* Internal 75% column divider line */}
      {/* <div className="absolute top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none z-0" style={{left: 'calc(40px + (100% - 80px) * 0.75)'}} /> */}

      {/* ─── CONTENT ─── */}
      <div className="relative z-10 pl-[50px] pr-0 md:px-[40px] py-0">
        
        {/* --- Top Section --- */}
        <div className="relative flex flex-col md:flex-row w-full md:min-h-[50vh]">
          {/* Left boundary line */}

          {/* Right boundary line */}
          <div className="hidden md:block absolute top-0 bottom-0 right-0 w-[1px] bg-white/20 pointer-events-none z-0" />

          {/* Left: Main Headline */}
          <div className="w-full md:w-[75%] px-2 md:px-12 py-10 md:py-16 flex flex-col relative justify-between">
            <div className="space-y-3 md:space-y-4">
              <p
                className="text-[14px] md:text-[12px] text-white/50 md:text-white/40 font-light tracking-normal md:tracking-[0.2em] md:uppercase"
                data-about-copy
              >
                Who we are
              </p>
              <h2
                className="font-light text-2xl md:text-3xl lg:text-5xl leading-[1.3] md:leading-[1.05] tracking-tight text-white/95"
                data-about-copy
              >
                We’re the production<br className="md:hidden" />
                <span className="hidden md:inline"> </span>house that turns brand<br className="md:hidden" />
                <span className="hidden md:inline"> </span>visions into compelling<br className="md:hidden" />
                <span className="hidden md:inline"> </span>visual stories, crafted with
                <span className="hidden md:inline"> </span>precision in every detail.
              </h2>
            </div>

            {/* Scroll Indicator - Bottom Right of the Left Column */}
            <div className="hidden md:flex absolute bottom-4 right-8 items-center gap-3 text-[12px] text-white/40 tracking-wider translate-y-[-10px]" data-about-copy>
              <span className="font-light">Scroll</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10H10V2M10 10L1 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
            </div>
          </div>
          
          {/* Vertical divider line at 75% - goes up from the dot and is only in the top section */}
          <div className="hidden md:block absolute top-0 bottom-0 left-[75%] w-[1px] bg-white/20 pointer-events-none z-0" />

          {/* Right: Small Top Image */}
          <div className="hidden md:flex w-full md:w-[25%] items-center justify-center relative">
            <div
              className="w-[85%] aspect-[16/10] overflow-hidden bg-zinc-900 shadow-2xl"
              data-parallax
            >
              <Image
                width={500}
                height={500}
                className="h-full w-full object-cover opacity-85"
                src="/images/aboutImages/rightImg.png"
                alt="Cinematography camera on set"
              />
            </div>
          </div>
        </div>

        {/* --- Structural Divider Line with Nodes --- */}
        {/* overflow-visible so nodes can reach the outer 4rem vertical lines */}
        <div className="relative w-full h-[1px] mb-0 md:mb-10 overflow-visible">
          {/* Full-width horizontal line to guarantee 4-way intersections */}
          <div className="absolute top-0 h-[1px] left-[-50px] right-0 md:left-[-40px] md:right-[-40px] bg-white/20" />

          {/* Left Node — centered on left-[4rem] vertical line */}
          <Node className="top-1/2" style={{ left: '0' }} />
          {/* 75% column split node */}
          <Node className="hidden md:block top-1/2" style={{ left: '75%' }} />
          {/* Right Node — centered on right-[4rem] vertical line */}
          <Node className="hidden md:block top-1/2" style={{ left: '100%' }} />
        </div>

        {/* --- Bottom Section --- */}
        <div className="relative flex flex-col md:flex-row w-full min-h-[320px]">

          {/* Left: Large Cinematic Video — ~56% of total width, padded from left */}
          <div className="w-full md:w-[70%] px-2 md:px-12 flex items-stretch">
            <div
              className="w-full overflow-hidden aspect-[1.8] md:aspect-[16/7]"
              data-parallax
            >
              <img
                className=" h-full md:h-full w-[full] md:w-[80%] object-cover opacity-85"
                src="/images/aboutImages/leftImg.png"
                alt="Cinematic production scene"
              />
            </div>
          </div>

          {/* Mobile Horizontal Divider below Image */}
          <div className="md:hidden relative w-full h-[1px] overflow-visible ">
            <div className="absolute top-5 h-[1px] left-[-50px] right-0 bg-white/20" />
            <Node className="top-5" style={{ left: '0' }} />
          </div>

          {/* Right: Text Column & Loader */}
          <div className="w-full md:w-[35%] px-2 md:pr-8 md:pl-2 flex flex-col justify-between mt-12 md:mt-3">

            {/* Text Content — tight spacing as in photo */}
            <div
              className="text-[13px] md:text-[14px] leading-[1.5] md:leading-[1.65] text-white/70 md:text-white/55 font-light space-y-4 md:space-y-5"
              data-about-copy
            >
              <p>
                Built to help brands communicate with clarity, impact, and purpose, Megamind Productions creates films, photography, and digital content for businesses across South India.
              </p>
              <p>
                One production partner, multiple disciplines:
              </p>
              <div>
                <p className="font-semibold text-white/95 mb-0.5 text-[13px] md:text-[14px]">Visual production services</p>
                <p>
                  Brand films, ad campaigns, corporate videos, photography, and podcast production for hospitality brands, corporates, institutions, and growing businesses.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white/95 mb-0.5 text-[13px] md:text-[14px]">Strategic visual storytelling</p>
                <p>
                  Content designed to strengthen brand perception, build trust, and create meaningful connections across digital platforms.
                </p>
              </div>
            </div>

            {/* Bottom-right loader UI — ISO label + progress bar + two icon buttons */}
            <div
              className="flex items-center justify-end gap-3 pt-8 pb-5 md:pb-0.5"
              data-about-copy
            >
              {/* ISO label + thin progress bar */}
              <div className="flex items-center gap-2.5">
                <span className="text-[8.5px] uppercase tracking-[0.22em] text-white/35 font-light">
                  ISO : 200
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

          {/* Mobile-only bottom image (Second Image) */}
          <div className="md:hidden w-full flex items-stretch px-2 pb-6">
            <div className="w-full overflow-hidden aspect-[1.7]" data-parallax>
              <img
                className="h-full w-full object-cover opacity-85"
                src="/images/aboutImages/rightImg.png"
                alt="Production scene"
              />
            </div>
          </div>

        </div>
        
        {/* --- Bottom Boundary Divider for GridOverlay alignment --- */}
        <div className="relative w-full h-[1px] mt-0 md:mt-18 overflow-visible">
          <div className="absolute top-0 h-[1px] left-[-50px] right-0 md:left-[-40px] md:right-[-40px] bg-white/20" />
          <Node className="top-1/2" style={{ left: '0' }} />
          <Node className="hidden md:block top-1/2" style={{ left: '100%' }} />
        </div>
      </div>
    </section>
  );
}