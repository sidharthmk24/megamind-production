"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface CrosshairProps {
  color?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  bottomElement?: React.ReactNode;
}

export default function Crosshair({
  color = "rgba(255, 255, 255, 0.4)",
  containerRef,
  bottomElement,
}: CrosshairProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  // Center dot (at cursor intersection)
  const centerDotRef = useRef<HTMLDivElement>(null);
  // Edge dots: top, bottom, left, right — where the crosshair lines touch the container edges
  const edgeDotTopRef = useRef<HTMLDivElement>(null);
  const edgeDotBottomRef = useRef<HTMLDivElement>(null);
  const edgeDotLeftRef = useRef<HTMLDivElement>(null);
  const edgeDotRightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const target = containerRef?.current || window;

    // quickTo for smooth tracking — move vertical line & edge dots left/right
    const moveX = gsap.quickTo(
      [vLineRef.current, centerDotRef.current, edgeDotTopRef.current, edgeDotBottomRef.current],
      "x",
      { duration: 0.5, ease: "power3.out" }
    );

    // move horizontal line & edge dots up/down
    const moveY = gsap.quickTo(
      [hLineRef.current, centerDotRef.current, edgeDotLeftRef.current, edgeDotRightRef.current],
      "y",
      { duration: 0.5, ease: "power3.out" }
    );

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      let x = mouseEvent.clientX;
      let y = mouseEvent.clientY;

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        x = mouseEvent.clientX - bounds.left;
        y = mouseEvent.clientY - bounds.top;

        // Fade out if mouse leaves the container bounds
        if (
          mouseEvent.clientX < bounds.left ||
          mouseEvent.clientX > bounds.right ||
          mouseEvent.clientY < bounds.top ||
          mouseEvent.clientY > bounds.bottom
        ) {
          gsap.to(wrapperRef.current, { opacity: 0, duration: 0.3 });
        } else {
          gsap.to(wrapperRef.current, { opacity: 1, duration: 0.3 });
        }
      }

      moveX(x);
      moveY(y);
    };

    const handleMouseEnter = () => {
      gsap.to(wrapperRef.current, { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(wrapperRef.current, { opacity: 0, duration: 0.3 });
    };

    // Start hidden
    gsap.set(wrapperRef.current, { opacity: 0 });

    target.addEventListener("mousemove", handleMouseMove);
    if (containerRef?.current) {
      target.addEventListener("mouseenter", handleMouseEnter as EventListener);
      target.addEventListener("mouseleave", handleMouseLeave as EventListener);
    }

    return () => {
      target.removeEventListener("mousemove", handleMouseMove);
      if (containerRef?.current) {
        target.removeEventListener("mouseenter", handleMouseEnter as EventListener);
        target.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      }
    };
  }, [containerRef]);

  const dotStyle = {
    width: "7px",
    height: "7px",
    backgroundColor: "white",
  };

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-none z-[100] ${containerRef ? "absolute inset-0 overflow-hidden" : "fixed inset-0"
        }`}
    >
      {/* Horizontal Line */}
      <div
        ref={hLineRef}
        className="absolute left-0 top-0 h-[1px] w-full -translate-y-1/2"
        style={{ backgroundColor: color }}
      />

      {/* Vertical Line */}
      <div
        ref={vLineRef}
        className="absolute left-0 top-0 h-full w-[1px] -translate-x-1/2"
        style={{ backgroundColor: color }}
      />

      {/* ── Center dot: white square at the cursor intersection ── */}
      <div
        ref={centerDotRef}
        className="absolute left-0 top-0 pointer-events-none"
      >
        <div
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
          style={dotStyle}
        />
        <div className="absolute left-4 bottom-3 text-white text-[10px] tracking-[0.2em] font-light drop-shadow-md whitespace-nowrap">
          PLAY
        </div>
      </div>

      {/* ── Edge dot: TOP — on the vertical line at the top edge ── */}
      <div
        ref={edgeDotTopRef}
        className="absolute top-0 left-0"
        style={{
          ...dotStyle,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── Edge dot: BOTTOM — on the vertical line at the bottom edge ── */}
      <div
        ref={edgeDotBottomRef}
        className="absolute bottom-0 left-0"
        style={{
          ...dotStyle,
          transform: "translate(-50%, 50%)",
        }}
      >
        {bottomElement && (
          <div className="absolute right-[20px] whitespace-nowrap" style={{ bottom: '40px', transform: 'translateY(50%)' }}>
            {bottomElement}
          </div>
        )}
      </div>

      {/* ── Edge dot: LEFT — on the horizontal line at the left edge ── */}
      <div
        ref={edgeDotLeftRef}
        className="absolute left-0 top-0"
        style={{
          ...dotStyle,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── Edge dot: RIGHT — on the horizontal line at the right edge ── */}
      <div
        ref={edgeDotRightRef}
        className="absolute right-0 top-0"
        style={{
          ...dotStyle,
          transform: "translate(50%, -50%)",
        }}
      />
    </div>
  );
}