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

  const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className="bg-black w-full relative overflow-hidden py-10 px-[40px]">
      {/* ── Persistent Grid Lines ── */}
      <div className="absolute left-[40px] top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none z-10" />
      <div className="absolute right-[40px] top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none z-10" />

      {/* Main Wrapper: 
        Uses items-start so all three columns align perfectly at the top edge.
      */}
      <div className="w-full flex flex-row items-start justify-center">
        
        {/* Left Section (10% width) 
            Total height matches the center image perfectly (75vh).
        */}
        <div className="flex flex-col w-[12%] lg:w-[10%] shrink-0 h-[50vh] lg:h-[75vh]">
          {/* Side Image: Shorter height (60vh) to create the gap at the bottom */}
          <div className="w-full h-[38vh] lg:h-[60vh] overflow-hidden bg-black">
            <img
              src={images[prevIndex]}
              alt="Previous"
              className="w-full h-full object-cover object-right grayscale-[100%] brightness-[0.3] transition-all duration-500"
            />
          </div>
          {/* The Gap: flex-1 fills the remaining height precisely, centering the arrow inside it */}
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

        {/* Center Section (Full Height) */}
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

        {/* Right Section (10% width)
            Total height matches the center image perfectly (75vh).
        */}
        <div className="flex flex-col w-[12%] lg:w-[10%] shrink-0 h-[50vh] lg:h-[75vh]">
          {/* Side Image: Shorter height (60vh) to create the gap at the bottom */}
          <div className="w-full h-[38vh] lg:h-[60vh] overflow-hidden bg-black">
            <img
              src={images[nextIndex]}
              alt="Next"
              className="w-full h-full object-cover object-left grayscale-[100%] brightness-[0.3] transition-all duration-500"
            />
          </div>
          {/* The Gap: flex-1 fills the remaining height precisely, centering the arrow inside it */}
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
    </div>
  );
}