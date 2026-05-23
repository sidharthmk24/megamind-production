"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface NetworkMember {
  name: string;
  role: string;
  image: string;
}

const NETWORK_MEMBERS: NetworkMember[] = [
  { name: "Arjun", role: "Lighting Specialist", image: "/images/team/ceo.png" },
  { name: "Prakash JP", role: "Consultant – Director of Film", image: "/images/team/creative_director.png" },
  { name: "Om Vijay", role: "Sound Team Lead", image: "/images/team/ceo.png" },
  { name: "Pandit", role: "VFX Artist", image: "/images/team/creative_director.png" },
  { name: "Ravi Kumar", role: "Cinematographer", image: "/images/team/ceo.png" },
  { name: "Meera S", role: "Art Director", image: "/images/team/creative_director.png" },
];

const swipeVariants = {
  enter: (direction: number) => ({
    x: direction === 1 ? "100%" : "-100%",
  }),
  center: {
    zIndex: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction === 1 ? "-100%" : "100%",
  }),
};

export default function CreativeNetworkSwiper() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Mobile Swiper States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    if (currentIndex >= NETWORK_MEMBERS.length - 1) return;
    setDirection(1);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex <= 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
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

  const updateProgress = () => {
    if (!scrollRef.current) return;
    const { scrollLeft: sl, scrollWidth, clientWidth } = scrollRef.current;
    const max = scrollWidth - clientWidth;
    setProgress(max > 0 ? sl / max : 0);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    return () => el.removeEventListener("scroll", updateProgress);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <>
      {/* ── DESKTOP LAYOUT (Absolutely untouched style/structure) ── */}
      <section className="hidden min-[901px]:block bg-black text-white w-full box-border px-[40px] relative">
        {/* Structural Lines */}
        <div className="absolute left-[40px] top-0 bottom-0 w-[1px] bg-white/20 z-10 pointer-events-none" />
        <div className="absolute right-[40px] top-0 bottom-0 w-[1px] bg-white/20 z-10 pointer-events-none" />

        {/* Header */}
        <div className="pt-[100px] pb-[60px] relative pl-[40px]">
          {/* Top Dots */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[0%]" style={{ top: "0%" }} />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%]" style={{ top: "0%" }} />
          <h2 className="text-[clamp(40px,6vw,84px)] font-medium leading-[1.05] uppercase text-white hidden md:block">
           OUR CREATIVE NETWORK

          </h2>
          <h2 className="text-[clamp(40px,6vw,84px)] font-normal leading-[1.05] tracking-tight uppercase text-white md:hidden ">
            <span className="block">OUR</span>
            <span className="block">CREATIVE</span>
            <span className="block">NETWORK</span>
          </h2>
        </div>

        {/* Scrollable cards */}
        <div className="w-full">
          <div
            ref={scrollRef}
            className="flex gap-[40px] overflow-x-auto scroll-smooth w-full pl-[40px] pr-[40px] cursor-grab select-none pb-[40px] active:cursor-grabbing no-scrollbar"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {NETWORK_MEMBERS.map((member, idx) => (
              <div className="min-w-[280px] max-w-[280px] shrink-0 flex flex-col group" key={idx}>
                <div className="w-full aspect-[4/5] bg-white/5 overflow-hidden relative mb-[16px]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 280px"
                    className="object-cover grayscale transition-[filter,transform] duration-500 ease-[ease] group-hover:grayscale-0 group-hover:scale-105"
                    draggable={false}
                  />
                </div>
                <h3 className="text-[22px] font-light text-white mb-[4px] tracking-[-0.01em]">{member.name}</h3>
                <span className="text-[13px] text-white/40 font-light">{member.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: progress track + arrows */}
        <div className="flex items-center justify-between pt-[24px] pb-[48px] px-[40px] border-b border-white/20 relative">
          <div className="flex-1 h-[1px] bg-white/20 relative mr-[40px]">
            <div
              className="absolute top-[-0.5px] h-[2px] bg-white transition-[width] duration-200 ease-out"
              style={{ 
                width: `${progress * 100}%`,
                left: 0
              }}
            />
          </div>
          <div className="flex gap-[8px] shrink-0">
            <button className="w-[44px] h-[44px] border border-white/20 flex items-center justify-center bg-none text-white cursor-pointer outline-none transition-[background,border-color] duration-250 hover:bg-white hover:text-black hover:border-white" onClick={() => scroll("left")} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="w-[44px] h-[44px] border border-white/20 flex items-center justify-center bg-none text-white cursor-pointer outline-none transition-[background,border-color] duration-250 hover:bg-white hover:text-black hover:border-white" onClick={() => scroll("right")} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          {/* Bottom Dots */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[0%]" style={{ top: "100%" }} />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%]" style={{ top: "100%" }} />
        </div>
      </section>

      {/* ── MOBILE LAYOUT (Pixel Perfect Grid) ── */}
      <div className="block min-[901px]:hidden w-full bg-black relative pb-0">
        {/* Left vertical grid line extending full height */}
        <div className="absolute left-[50px] top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none z-10" />
        {/* Right vertical grid line extending full height */}
        <div className="absolute right-[12px] top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none z-10" />

        {/* ── HEADER CONTAINER ── */}
        <div className="relative ml-[50px] mr-[12px] border-t border-b border-white/20 bg-black">
          {/* Top-left & Top-right square dots of the entire section */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-0 top-0" />
          {/* <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] top-0" /> */}

          {/* Bottom-left & Bottom-right square dots of the header */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-0 top-[100%]" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] top-[100%]" />

          {/* Heading content with small padding as in the mockup */}
          <div className="py-[32px] px-[20px]">
            <h2 className="text-[36px] font-normal leading-[1.08] tracking-tight uppercase text-white">
              OUR<br />
              CREATIVE<br />
              NETWORK
            </h2>
          </div>
        </div>

        {/* ── SWIPER/CONTENT CONTAINER ── */}
        <div className="relative ml-[50px] mr-[12px] border-b border-white/20 bg-black">
          {/* Symmetrical padding inside the container */}
          <div className="p-[20px] pb-[24px] flex flex-col">
            
            {/* Square image container */}
            <div className="w-full aspect-square relative overflow-hidden bg-white/5 mb-[24px]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={swipeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={handleDragEnd}
                  transition={{
                    x: { type: "spring", stiffness: 350, damping: 35, mass: 1 },
                  }}
                  className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={NETWORK_MEMBERS[currentIndex].image}
                    alt={NETWORK_MEMBERS[currentIndex].name}
                    fill
                    sizes="(max-width: 900px) 100vw, 300px"
                    className="object-cover grayscale"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Member Details */}
            <div className="mb-[24px] pl-1">
              <h3 className="text-[24px] font-light text-white mb-1 tracking-[-0.01em]">
                {NETWORK_MEMBERS[currentIndex].name}
              </h3>
              <span className="text-[14px] text-white/40 font-light">
                {NETWORK_MEMBERS[currentIndex].role}
              </span>
            </div>

            {/* Navigation & Progress bar on the same row */}
            <div className="flex items-center justify-between pt-2 pl-1">
              {/* Progress bar with white dot */}
              <div className="w-[120px] h-[1px] bg-white/20 relative">
                <div
                  className="absolute top-[-0.5px] h-[2px] bg-white transition-[width] duration-300 ease-out"
                  style={{ width: `${(currentIndex / (NETWORK_MEMBERS.length - 1)) * 100}%` }}
                />
                <div
                  className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 transition-[left] duration-300 ease-out"
                  style={{
                    left: `${(currentIndex / (NETWORK_MEMBERS.length - 1)) * 100}%`,
                    top: "0%"
                  }}
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-[8px]">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={`flex h-10 w-10 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white active:border-white active:text-white transition-all duration-300 cursor-pointer ${
                    currentIndex === 0 ? "opacity-30 cursor-not-allowed pointer-events-none" : ""
                  }`}
                  aria-label="Previous member"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                    <path d="M19 12H5m0 0l7-7m-7 7l7 7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex === NETWORK_MEMBERS.length - 1}
                  className={`flex h-10 w-10 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white active:border-white active:text-white transition-all duration-300 cursor-pointer ${
                    currentIndex === NETWORK_MEMBERS.length - 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : ""
                  }`}
                  aria-label="Next member"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                    <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom-left & Bottom-right square dots of the entire section */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-0 top-[100%]" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] top-[100%]" />
        </div>
      </div>
    </>
  );
}