"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface DigitalMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type AnimationState = "closed" | "opening" | "open" | "closing";

export default function DigitalMobileMenu({ isOpen, onClose }: DigitalMobileMenuProps) {
  const [animState, setAnimState] = useState<AnimationState>("closed");
  const [contentVisible, setContentVisible] = useState(false);
  const [grid, setGrid] = useState({ cols: 6, rows: 12 });
  const [isMounted, setIsMounted] = useState(false);

  const hasStartedRef = useRef(false);

  // Sync state machine and content visibility with isOpen prop
  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      if (hasStartedRef.current) return; // Prevent double-triggering (e.g. React StrictMode)
      hasStartedRef.current = true;
      setAnimState("opening");
      
      // Trigger the clip-path transition 50ms after mount so the browser registers the initial closed boundary
      const revealTimer = setTimeout(() => {
        setContentVisible(true);
      }, 50);

      // Transition to open stable state after the sweep completes (1000ms)
      const completeTimer = setTimeout(() => {
        setAnimState("open");
      }, 1000);

      return () => {
        clearTimeout(revealTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setAnimState("closed");
      setContentVisible(false);
      hasStartedRef.current = false;
    }
  }, [isOpen]);

  // Handle window resizing to calculate dimensions exclusively for the CARD MODAL container
  useEffect(() => {
    if (!isMounted) return;
    const calculateGrid = () => {
      const cellWidth = 56; // Bolder, larger pixel square size (56px)
      // Card margins: left=40px, right=40px -> width is window.innerWidth - 80
      // Card margins: top=120px, bottom=100px -> height is window.innerHeight - 220
      const cardWidth = Math.max(200, window.innerWidth - 80);
      const cardHeight = Math.max(300, window.innerHeight - 220);
      
      const cols = Math.ceil(cardWidth / cellWidth);
      const rows = Math.ceil(cardHeight / cellWidth);
      setGrid({ cols, rows });
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, [isMounted]);

  // Deterministically fetch cell properties based on coordinates to avoid hydration mismatches
  const getCellColor = (c: number, r: number) => {
    const hash = (c * 17 + r * 31) % 100;
    if (hash < 22) {
      return "rgba(139, 0, 0, 0.45)"; // Deep crimson red (Frame 3)
    } else if (hash < 35) {
      return "rgba(60, 12, 12, 0.85)"; // Near-black red (Frame 3)
    } else {
      return "rgba(8, 8, 8, 0.96)"; // Solid near-black digital block (Frame 3)
    }
  };

  // Trigger the deconstruction outro sequence
  const handleCloseTrigger = () => {
    if (animState !== "open") return;
    setAnimState("closing");
    setContentVisible(false); // Trigger the closing clip-path sweep instantly!

    // Allow deconstruction wave to complete (900ms) before finally telling parent to unmount
    setTimeout(() => {
      setAnimState("closed");
      onClose();
    }, 900);
  };

  if (!isMounted || animState === "closed") return null;

  // Diagonal sweep parameters
  // Max diagonals inside card is cols + rows - 2. For 6 cols and 12 rows, maxDiag = 16 steps.
  // 16 steps * 28ms = 448ms total sweep duration.
  const cellDelayFactor = 28; 

  // Total cells generated
  const cells = [];
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      cells.push({ r, c });
    }
  }

  // Active styles based on current animation state
  const isOpening = animState === "opening";
  const isOpenState = animState === "open";
  const isClosing = animState === "closing";
  const isActive = isOpening || isOpenState;

  // Outer veil styling remains full screen to separate the menu from the page content
  const veilOpacity = isClosing 
    ? "opacity-0 backdrop-blur-none transition-all duration-700 delay-200" 
    : (isActive ? "opacity-100 backdrop-blur-[6px]" : "opacity-0 backdrop-blur-none");

  // Content block polygon clip-path reveal (Frame 6 & 7)
  // - Opening Reveal (contentVisible = true): Sweeps TR (100% 0) -> BL (0 100%).
  // - Closing Collapse (contentVisible = false): Sweeps BL (0 100%) -> TR (100% 0). Shrinks from bottom-left to top-right.
  // Set duration to exactly 450ms to match the 448ms pixel sweep front perfectly!
  const clipPathStyle = contentVisible
    ? "polygon(100% 0, -120% 0, 100% 220%, 100% 220%)" // Fully revealed
    : "polygon(100% 0, 100% 0, 100% 0, 100% 0)"; // Hidden/Collapsed to Top-Right

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden select-none pointer-events-auto">
      {/* Dynamic Keyframes Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pixelIntroCard {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          15% {
            opacity: 0.95;
            transform: scale(1.0);
          }
          55% {
            opacity: 0.95;
            transform: scale(1.0);
          }
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
        }

        @keyframes pixelOutroCard {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          40% {
            opacity: 0.95;
            transform: scale(1.0);
          }
          90% {
            opacity: 0.95;
            transform: scale(1.0);
          }
          100% {
            opacity: 0;
            transform: scale(0.3);
          }
        }
      `}} />

      {/* ─── FULL-SCREEN VEIL: FADES SCREEN BEHIND THE MODAL ONLY ─── */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-all duration-300 ease-out pointer-events-auto ${veilOpacity}`}
        onClick={handleCloseTrigger} 
      />

      {/* ─── THE CARD MODAL CONTAINER (CLIPPED DIRECTLY FOR DIAGONAL RECONSTRUCTION/DECONSTRUCTION) ─── */}
      <div
        className="absolute top-[120px] bottom-[100px] left-[40px] right-[40px] bg-[#080806] border border-white/10 p-8 flex flex-col z-[80] shadow-2xl overflow-hidden"
        style={{
          clipPath: clipPathStyle,
          transitionProperty: "clip-path",
          transitionDuration: "450ms", // Mathematically matched to cellDelayFactor * maxDiag (448ms)
          transitionTimingFunction: "linear", // Linear matches the constant speed diagonal scan perfectly
          transitionDelay: "0ms", // 0ms so reveal matches the pixel front exactly
        }}
      >
        {/* Subtle grid background inside the card modal */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(243, 238, 230, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(243, 238, 230, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Subtle grid accent inside content context */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* ─── CLOSE BUTTON ─── */}
        <button
          onClick={handleCloseTrigger}
          className="relative z-10 text-[12px] text-white/40 hover:text-white font-light tracking-[0.2em] uppercase text-left mb-10 cursor-pointer w-fit transition-colors duration-200"
          style={{
            transition: "transform 0.4s ease, opacity 0.4s ease",
            transitionDelay: isClosing ? "0ms" : "60ms", // appears right behind pixel sweep
            transform: contentVisible && !isClosing ? "translateY(0)" : "translateY(8px)",
            opacity: isClosing ? 0.2 : (contentVisible ? 1 : 0),
          }}
        >
          Close
        </button>

        {/* ─── MENU TITLE ─── */}
        <h3 
          className="relative z-10 text-4xl font-light text-white mb-10 tracking-tight"
          style={{
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
            transitionDelay: isClosing ? "0ms" : "120ms", // appears right behind pixel sweep
            transform: contentVisible && !isClosing ? "translateY(0)" : "translateY(10px)",
            opacity: isClosing ? 0.2 : (contentVisible ? 1 : 0),
          }}
        >
          Menu
        </h3>

        {/* ─── NAVIGATION LINKS ─── */}
        <nav className="relative z-10 flex flex-col gap-6 text-[18px] font-light text-white/75">
          {[
            { href: "/featured-projects", label: "Featured Projects" },
            { href: "/production-note", label: "Production Notes" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((item, index) => {
            // Rapid staggered entry starting right behind the sweep front
            const staggerDelay = isClosing ? 0 : 180 + index * 50;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  // trigger closing first
                  handleCloseTrigger();
                  setTimeout(() => {
                    window.location.href = item.href;
                  }, 800);
                }}
                className="hover:text-white transition-colors duration-300 w-fit"
                style={{
                  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, color 0.3s ease",
                  transitionDelay: `${staggerDelay}ms`,
                  transform: contentVisible && !isClosing ? "translateY(0)" : "translateY(12px)",
                  opacity: isClosing ? 0.05 : (contentVisible ? 1 : 0), // fades to invisible on collapse
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ─── DIAGONAL PIXEL CASCADE WAVE OVERLAYING THE CARD BOUNDS (Z-90 FOR FRONT VISIBILITY) ─── */}
      <div 
        className="absolute top-[120px] bottom-[100px] left-[40px] right-[40px] pointer-events-none grid z-[90] overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
          gap: "1px", // sharp border between cells
        }}
      >
        {cells.map(({ r, c }, idx) => {
          // Diagonal index:
          // - Opening Intro: Top-Right to Bottom-Left (c = cols-1, r = 0 -> distance = 0)
          // - Closing Outro: Bottom-Left to Top-Right (c = 0, r = rows-1 -> distance = 0)
          const diagIndex = isClosing
            ? c + (grid.rows - 1 - r) // BL to TR
            : (grid.cols - 1 - c) + r; // TR to BL
            
          const delay = diagIndex * cellDelayFactor;
          const color = getCellColor(c, r);

          return (
            <div
              key={idx}
              style={{
                backgroundColor: color,
                animationName: isClosing ? "pixelOutroCard" : "pixelIntroCard",
                animationDuration: isClosing ? "500ms" : "700ms",
                animationDelay: `${delay}ms`,
                animationTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                animationFillMode: "both",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
