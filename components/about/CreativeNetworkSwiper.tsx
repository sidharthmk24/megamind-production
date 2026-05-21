"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface NetworkMember {
  name: string;
  role: string;
  image: string;
}

const NETWORK_MEMBERS: NetworkMember[] = [
  { name: "Arjun", role: "Lighting Technician", image: "/images/team/arjun.png" },
  { name: "Prakash JP", role: "Consultant – Director of Film", image: "/images/team/prakash.png" },
  { name: "Om Vijay", role: "Sound Team Lead", image: "/images/team/om_vijay.png" },
  { name: "Pandit", role: "VFX Artist", image: "/images/team/pandit.png" },
  { name: "Ravi Kumar", role: "Cinematographer", image: "/images/team/ravi.png" },
  { name: "Meera S", role: "Art Director", image: "/images/team/meera.png" },
];

export default function CreativeNetworkSwiper() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
    <section className="bg-black text-white w-full box-border px-[40px] relative max-[768px]:px-[20px]">
      <div className="absolute left-[40px] -top-[30px] -bottom-[30px] w-[1px] bg-white/20 z-10 pointer-events-none max-[768px]:left-[20px]" />
      <div className="absolute right-[40px] -top-[30px] -bottom-[30px] w-[1px] bg-white/20 z-10 pointer-events-none max-[768px]:right-[20px]" />

      {/* Header */}
      <div className="pt-[100px] pb-[60px] border-t border-white/20 relative pl-[40px] max-[768px]:pt-[60px] max-[768px]:pb-[40px] max-[768px]:pl-0">
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "0%", top: "0%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "0%" }} />
        <h2 className="text-[clamp(48px,6vw,84px)] font-medium leading-none tracking-[-0.02em] uppercase text-white">Our Creative Network</h2>
      </div>

      {/* Scrollable cards */}
      <div className="w-full">
        <div
          ref={scrollRef}
          className="flex gap-[40px] overflow-x-auto scroll-smooth w-full pl-[40px] pr-[40px] cursor-grab select-none pb-[40px] active:cursor-grabbing no-scrollbar max-[768px]:pl-0 max-[768px]:pb-[20px]"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {NETWORK_MEMBERS.map((member, idx) => (
            <div className="min-w-[280px] max-w-[280px] shrink-0 flex flex-col group" key={idx}>
              <div className="w-full aspect-square bg-white/5 overflow-hidden relative mb-[20px]">
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

      {/* Bottom: progress track + arrows */}
      <div className="flex items-center justify-between pt-[24px] pb-[48px] px-[40px] border-b border-white/20 relative max-[768px]:px-0">
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
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "0%", top: "100%" }} />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "100%" }} />
      </div>
    </section>
  );
}