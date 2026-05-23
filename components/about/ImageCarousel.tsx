"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
];

// Pure swipe math: No opacity fades, just structural X-axis sliding
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

export default function PixelPerfectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [direction, setDirection] = useState(0); 

  const nextSlide = () => {
    setDirection(1); 
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1); 
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className="bg-black w-full relative overflow-hidden py-10 px-[40px] max-[900px]:px-0 max-[900px]:py-0">
      {/* ── Persistent Grid Lines (Desktop Only) ── */}
      <div className="absolute left-[40px] top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none z-10 max-[900px]:hidden" />
      <div className="absolute right-[40px] top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none z-10 max-[900px]:hidden" />
      
      {/* Bottom Separating Line (Desktop Only) */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20 pointer-events-none z-10 max-[900px]:hidden" />

      {/* Intersection Nodes at the bottom separating line (Desktop Only) */}
      {/* <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[40px] bottom-0 max-[900px]:hidden" /> */}
      {/* <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none right-[40px] bottom-0 max-[900px]:hidden" /> */}

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden min-[901px]:flex w-full flex-row items-start justify-center">
        {/* Left Section (Desktop Only) */}
        <div className="flex flex-col w-[12%] lg:w-[10%] shrink-0 h-[50vh] lg:h-[75vh]">
          <div className="w-full h-[38vh] lg:h-[60vh] overflow-hidden bg-black">
            <img
              src={images[prevIndex]}
              alt="Previous"
              className="w-full h-full object-cover object-right grayscale-[100%] brightness-[0.3] transition-all duration-500"
            />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={prevSlide}
              className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white transition-all duration-300 z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                <path d="M19 12H5m0 0l7-7m-7 7l7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center Section */}
        <div className="w-[72%] lg:w-[78%] mx-4 md:mx-8 h-[50vh] lg:h-[75vh] relative overflow-hidden bg-black">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt="Current"
              custom={direction}
              variants={swipeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 350, damping: 35, mass: 1 },
              }}
              className="w-full h-full object-cover absolute inset-0 shadow-2xl"
            />
          </AnimatePresence>
        </div>

        {/* Right Section (Desktop Only) */}
        <div className="flex flex-col w-[12%] lg:w-[10%] shrink-0 h-[50vh] lg:h-[75vh]">
          <div className="w-full h-[38vh] lg:h-[60vh] overflow-hidden bg-black">
            <img
              src={images[nextIndex]}
              alt="Next"
              className="w-full h-full object-cover object-left grayscale-[100%] brightness-[0.3] transition-all duration-500"
            />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={nextSlide}
              className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white transition-all duration-300 z-10 cursor-pointer"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (Pixel Perfect Grid) ── */}
      <div className="block min-[901px]:hidden relative w-full bg-black py-[1px]">
        {/* Full-width horizontal lines crossing the viewport */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20 pointer-events-none" />

        {/* Carousel frame container bounded by left (50px) and right (20px) lines */}
        <div className="relative ml-[50px] mr-[12px] border-l border-r border-white/20 bg-black">
          {/* Four corner intersection white dots */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-0 top-0" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] top-0" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-0 top-[100%]" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[100%] top-[100%]" />

          {/* Symmetrical padding for the centered landscape image */}
          <div className="p-[20px] pb-4 flex flex-col">
            <div className="w-full aspect-[4/3] relative overflow-hidden bg-white/5 mb-6">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt="Current"
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
                  className="w-full h-full object-cover absolute inset-0 shadow-2xl cursor-grab active:cursor-grabbing"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Center aligned navigation arrows */}
          <div className="flex justify-center items-center gap-2 pb-6 pt-2">
            <button
              onClick={prevSlide}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white active:border-white active:text-white transition-all duration-300 cursor-pointer"
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                <path d="M19 12H5m0 0l7-7m-7 7l7 7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-zinc-500 hover:border-white hover:text-white active:border-white active:text-white transition-all duration-300 cursor-pointer"
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}