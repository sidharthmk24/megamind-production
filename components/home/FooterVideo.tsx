"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Megamind Productions";

export default function FooterVideo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const chars = useMemo(() => {
    return TITLE.split("").map((char, i) => ({ char, i }));
  }, []);

  // Sort indices by distance from center so center letters animate first
  const centerOutwardOrder = useMemo(() => {
    const mid = (TITLE.length - 1) / 2;
    return chars
      .map(({ i }) => ({ i, dist: Math.abs(i - mid) }))
      .sort((a, b) => a.dist - b.dist)
      .map(({ i }) => i);
  }, [chars]);

  useGSAP(
    () => {
      // Subtle parallax on the video
      gsap.from(".footer-video", {
        scale: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Center-outward letter reveal — pure upward slide, no flips
      const orderedNodes = centerOutwardOrder.map(
        (i) => lettersRef.current[i]
      );

      gsap.fromTo(
        orderedNodes,
        {
          y: "120%",
        },
        {
          y: "0%",
          ease: "power3.out",
          duration: 1.2,
          stagger: {
            each: 0.045,
            ease: "power1.inOut",
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [centerOutwardOrder] }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[85vh] md:h-[100vh] overflow-hidden bg-black"
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="footer-video absolute inset-0 w-full h-full object-cover"
        src="https://cdn.prod.website-files.com/680370eb38ccbea9790c27e5%2F6916d1418e1c458b0bb6de91_1footer%20video%20final_mp4.mp4"
      />

      {/* ─── DESKTOP VIEW OVERLAYS ─── */}
      <div className="hidden md:block">
        <div
          className="absolute inset-0 flex flex-col justify-end pb-[4rem] pointer-events-none select-none z-10"
          style={{ mixBlendMode: "difference" }}
        >
          <div style={{ overflow: "hidden" }}>
            <h1
              className="text-[14vw] md:text-[9vw] font-semibold tracking-tight leading-none text-center whitespace-nowrap"
              aria-label={TITLE}
            >
              {chars.map(({ char, i }) => (
                <span
                  key={i}
                  ref={(el) => {
                    lettersRef.current[i] = el;
                  }}
                  style={{
                    display: "inline-block",
                    whiteSpace: char === " " ? "pre" : undefined,
                    color: "#ffffff",
                    willChange: "transform",
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* Bottom utility links */}
        <div className="absolute bottom-6 left-0 right-0 px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 z-20 text-[13px] text-white/80 font-light">
          <div className="w-full md:w-1/3 flex justify-start">
            <a href="/legal" className="hover:text-white transition-colors">
              Legal
            </a>
          </div>

          <div className="w-full md:w-1/3 flex justify-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              YouTube
            </a>
          </div>

          <div className="w-full md:w-1/3 flex justify-end">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-2 hover:text-white transition-colors"
            >
              <span className="text-[16px] group-hover:-translate-y-1 transition-transform">
                ↑
              </span>
              Back to Top
            </button>
          </div>
        </div>
      </div>

      {/* ─── MOBILE VIEW OVERLAY ─── */}
      <div className="md:hidden absolute inset-0 flex flex-col justify-end items-center pb-12 px-6 z-20 text-white select-none">
        
        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-[14px] font-light text-white/90 hover:text-white transition-colors tracking-wide cursor-pointer mb-8"
        >
          <span className="text-[15px]">↑</span> Back to Top
        </button>

        {/* Social Links */}
        <div className="flex justify-center gap-6 text-[14px] font-light text-white/80 mb-6 w-full">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            YouTube
          </a>
        </div>

        {/* Giant Title */}
        <div 
          className="w-full flex justify-center text-center select-none mb-8"
          style={{ mixBlendMode: "difference" }}
        >
          <h1 className="text-[16vw] font-normal tracking-tight leading-[0.95] text-center text-white whitespace-pre-wrap">
            Megamind{"\n"}Productions
          </h1>
        </div>

        {/* Legal Link */}
        <div className="flex justify-center items-center">
          <a
            href="/legal"
            className="text-[13px] font-light text-white/50 hover:text-white transition-colors tracking-wide"
          >
            Legal
          </a>
        </div>
      </div>
    </div>
  );
}