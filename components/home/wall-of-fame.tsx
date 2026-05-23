"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: "Partner 1", logo: "/clients/1.svg" },
  { name: "Partner 2", logo: "/clients/2.svg" },
  { name: "Partner 3", logo: "/clients/3.svg" },
  { name: "Partner 4", logo: "/clients/4.svg" },
  { name: "Partner 5", logo: "/clients/5.svg" },
  { name: "Partner 6", logo: "/clients/6.svg" },
  { name: "Partner 7", logo: "/clients/7.svg" },
  { name: "Partner 8", logo: "/clients/8.svg" },
  { name: "Partner 9", logo: "/clients/9.svg" },
  { name: "Partner 10", logo: "/clients/10.svg" },
  { name: "Partner 11", logo: "/clients/11.svg" },
  { name: "Partner 12", logo: "/clients/12.svg" },
  { name: "Partner 13", logo: "/clients/13.svg" },
  { name: "Partner 14", logo: "/clients/14.svg" },
  { name: "Partner 15", logo: "/clients/15.svg" },
];

// Helper functions for mathematically perfect grid placement
const colPercent = (i: number) => `calc(100% / 6 * ${i})`;
const rowPercent = (i: number) => `calc(100% / 3 * ${i})`;

// Reusable Intersection Node
const Node = ({ col, row }: { col: number; row: number }) => (
  <div
    className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-40"
    style={{ left: colPercent(col), top: rowPercent(row) }}
  />
);

// Perfectly bounded Logo Cell
const LogoCell = ({ partner, col, row }: { partner: typeof partners[0]; col: number; row: number }) => (
  <div
    className="absolute flex flex-col items-center justify-center p-8  transition-all group text-center"
    style={{
      left: colPercent(col),
      top: rowPercent(row),
      width: "calc(100% / 6)",
      height: "calc(100% / 3)",
    }}
  >
    <div data-wall-fade className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[80%] h-[60%] transition-all duration-700 ease-out ">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain opacity-40 transition-opacity duration-500 brightness-0 invert"
        />
      </div>
    </div>
  </div>
);

// Helper functions for mathematically perfect grid placement (Mobile)
const mobColPercent = (i: number) => {
  return `${(110 / 3) * i}%`;
};
const mobRowPercent = (i: number) => `calc(100% / 4 * ${i})`;

const MobileNode = ({ col, row }: { col: number; row: number }) => (
  <div
    className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-40"
    style={{ left: mobColPercent(col), top: mobRowPercent(row) }}
  />
);

const LogoCellMobile = ({ partner, col, row }: { partner: typeof partners[0]; col: number; row: number }) => (
  <div
    className="absolute flex flex-col items-center justify-center p-4 transition-all group text-center"
    style={{
      left: mobColPercent(col),
      top: mobRowPercent(row),
      width: "36.666667%",
      height: "calc(100% / 4)",
    }}
  >
    <div data-wall-fade className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[85%] h-[60%] transition-all duration-700 ease-out">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain opacity-60 transition-opacity duration-500 brightness-0 invert"
        />
      </div>
    </div>
  </div>
);

export default function WallOfFame() {
  const wallRef = useRef<HTMLElement | null>(null);
  const wallHeading1Ref = useRef<HTMLHeadingElement | null>(null);
  const wallHeading2Ref = useRef<HTMLHeadingElement | null>(null);
  const wallHeadingMobileRef = useRef<HTMLHeadingElement | null>(null);

  const splitText = (text: string) => {
    return text.split("").map((ch, i) => (
      <span key={i} className="svc-char inline-block whitespace-pre will-change-opacity">
        {ch === " " ? "\u00a0" : ch}
      </span>
    ));
  };

  useGSAP(
    () => {
      // Fade and slide up logos
      gsap.from("[data-wall-fade]", {
        opacity: 0,
        y: 40,
        stagger: 0.05,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wallRef.current,
          start: "top 75%",
        },
      });

      // Character flicker intro animation for Wall of Fame headings (Desktop & Mobile)
      const desktopChars1 = wallHeading1Ref.current?.querySelectorAll(".svc-char");
      const desktopChars2 = wallHeading2Ref.current?.querySelectorAll(".svc-char");
      const mobileChars = wallHeadingMobileRef.current?.querySelectorAll(".svc-char");

      const allHeadingChars = [
        ...(desktopChars1 ? Array.from(desktopChars1) : []),
        ...(desktopChars2 ? Array.from(desktopChars2) : []),
        ...(mobileChars ? Array.from(mobileChars) : []),
      ];

      if (allHeadingChars.length > 0) {
        gsap.timeline({
          scrollTrigger: {
            trigger: wallRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        })
        .to(allHeadingChars, {
          opacity: 0,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        })
        .to(allHeadingChars, {
          opacity: 1,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        }, "-=0.15");
      }
    },
    { scope: wallRef }
  );

  return (
    <section
      id="wall"
      ref={wallRef}
      className="relative w-full h-screen min-h-[100px] bg-[black] text-white overflow-hidden"
    >
      {/* 
        Master Grid Container
        Provides the outer frame and perfectly constrains the absolute logic
      */}
      <div className="hidden md:block absolute top-[40px] bottom-[40px] left-[40px] right-[40px]">

        {/* =========================================
            STRUCTURAL GRID LINES
            ========================================= */}
        {/* Horizontal Lines (Rows 1-3) */}
        {[1, 2, 3].map((i) => (
          <div
            key={`h-${i}`}
            className="absolute h-[1px] w-[100vw] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 pointer-events-none"
            style={{ top: rowPercent(i) }}
          />
        ))}

        {/* Left End Vertical Line (Full Height) */}
        <div
          className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
          style={{ left: colPercent(0), top: "-40px", bottom: "-40px" }}
        />

        {/* Right End Vertical Line (Full Height) */}
        <div
          className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
          style={{ left: colPercent(6), top: "-40px", bottom: "-40px" }}
        />

        {/* Center Vertical Line (Full Height) */}
        <div
          className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
          style={{ left: colPercent(3), top: "-40px", bottom: "0px" }}
        />

        {/* Left Side Partial Verticals (Under OUR WALL: row 1 to bottom) */}
        {[1, 2].map((i) => (
          <div
            key={`v-left-${i}`}
            className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
            style={{ left: colPercent(i), top: rowPercent(1), bottom: "0px" }}
          />
        ))}

        {/* Right Side Partial Verticals (Above OF F(R)AME: row 0 to row 1) */}
        {[4, 5].map((i) => (
          <div
            key={`v-right-top-${i}`}
            className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
            style={{ left: colPercent(i), top: "-40px", height: `calc(${rowPercent(1)} + 40px)` }}
          />
        ))}

        {/* Right Side Partial Verticals (Below OF F(R)AME: row 2 to row 3) */}
        {[4, 5].map((i) => (
          <div
            key={`v-right-bot-${i}`}
            className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
            style={{ left: colPercent(i), top: rowPercent(2), bottom: "0px" }}
          />
        ))}

        {/* =========================================
            INTERSECTION NODES
            ========================================= */}
        {/* Row 0 (Top) Nodes */}
        {/* <Node col={0} row={0} />
        <Node col={3} row={0} />
        <Node col={4} row={0} />
        <Node col={5} row={0} />
        <Node col={6} row={0} /> */}

        {/* Row 1 Nodes */}
        <Node col={0} row={1} />
        <Node col={1} row={1} />
        <Node col={2} row={1} />
        <Node col={3} row={1} />
        <Node col={4} row={1} />
        <Node col={5} row={1} />
        <Node col={6} row={1} />

        {/* Row 2 Nodes */}
        <Node col={0} row={2} />
        <Node col={1} row={2} />
        <Node col={2} row={2} />
        <Node col={3} row={2} />
        <Node col={4} row={2} />
        <Node col={5} row={2} />
        <Node col={6} row={2} />

        {/* Row 3 (Bottom) Nodes */}
        <Node col={0} row={3} />
        <Node col={1} row={3} />
        <Node col={2} row={3} />
        <Node col={3} row={3} />
        <Node col={4} row={3} />
        <Node col={5} row={3} />
        <Node col={6} row={3} />

        {/* =========================================
            CONTENT PLACEMENT
            ========================================= */}

        {/* --- Top Row --- */}
        <div
          className="absolute flex items-center justify-center"
          style={{ left: 0, top: 0, width: "50%", height: "calc(100% / 5)" }}
        >
          <h2
            ref={wallHeading1Ref}
            className="text-[clamp(3rem,6vw,7rem)] font-medium tracking-tight text-white"
          >
            {splitText("OUR WALL")}
          </h2>
        </div>
        <LogoCell partner={partners[0]} col={3} row={0} />
        <LogoCell partner={partners[1]} col={4} row={0} />
        <LogoCell partner={partners[2]} col={5} row={0} />

        {/* --- Middle Row --- */}
        <LogoCell partner={partners[3]} col={0} row={1} />
        <LogoCell partner={partners[4]} col={1} row={1} />
        <LogoCell partner={partners[5]} col={2} row={1} />
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: "50%",
            top: "calc(100% / 3)",
            width: "50%",
            height: "calc(100% / 3)",
          }}
        >
          <h2
            ref={wallHeading2Ref}
            className="text-[clamp(3rem,6vw,7rem)] font-medium tracking-tight text-white"
          >
            {splitText("OF F(R)AME")}
          </h2>
        </div>

        {/* --- Bottom Row --- */}
        <LogoCell partner={partners[6]} col={0} row={2} />
        <LogoCell partner={partners[7]} col={1} row={2} />
        <LogoCell partner={partners[8]} col={2} row={2} />
        <LogoCell partner={partners[9]} col={3} row={2} />
        <LogoCell partner={partners[10]} col={4} row={2} />
        <LogoCell partner={partners[11]} col={5} row={2} />
        {/* Extra logos if needed can be added here or in a different layout */}
      </div>

      {/* =========================================
          MOBILE VIEW (Responsive Grid Layout)
          ========================================= */}
      <div className="md:hidden absolute top-0 bottom-[40px] left-[50px] right-[40px]">
        {/* Horizontal Lines (Rows 0-4) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`m-h-${i}`}
            className="absolute h-[1px] w-[100vw] left-[-50px] -translate-y-1/2 bg-white/20 pointer-events-none"
            style={{ top: mobRowPercent(i) }}
          />
        ))}

        {/* Leftmost Vertical Line (Full Height) */}
        <div
          className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
          style={{ left: mobColPercent(0), top: "0px", bottom: "0px" }}
        />

        {/* Inner Vertical Lines (Rows 1-4) */}
        {[1, 2].map((i) => (
          <div
            key={`m-v-${i}`}
            className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
            style={{ left: mobColPercent(i), top: "25%", bottom: "0px" }}
          />
        ))}

        {/* Rightmost Vertical Line (Bottom Grid Only, top starts at 25%) */}
        <div
          className="absolute w-[1px] bg-white/20 pointer-events-none -translate-x-1/2"
          style={{ left: mobColPercent(3), top: "25%", bottom: "0px" }}
        />

        {/* Top Nodes (Row 0) */}
        <MobileNode col={0} row={0} />
        {/* <MobileNode col={3} row={0} /> */}

        {/* Other Nodes (Rows 1-4) */}
        {[1, 2, 3, 4].map((row) => (
          [0, 1, 2, 3].map((col) => (
            <MobileNode key={`m-n-${row}-${col}`} col={col} row={row} />
          ))
        ))}

        {/* Title Block */}
        <div className="absolute top-0 left-0 w-full h-[25%] flex flex-col justify-center px-4">
          <h2
            ref={wallHeadingMobileRef}
            className="text-[2.2rem] font-light leading-[1.05] tracking-tight text-white uppercase"
          >
            {splitText("OUR WALL")}
            <br />
            {splitText("OF F(R)AME")}
          </h2>
        </div>

        {/* Logo Cells */}
        {partners.slice(0, 9).map((partner, idx) => {
          const row = Math.floor(idx / 3) + 1;
          const col = idx % 3;
          return <LogoCellMobile key={`m-l-${idx}`} partner={partner} col={col} row={row} />;
        })}
      </div>
    </section>
  );
}