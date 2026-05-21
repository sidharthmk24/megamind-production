"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function IntroLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLHeadingElement>(null);
  const bottomTextRef = useRef<HTMLHeadingElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const topText = topTextRef.current;
    const bottomText = bottomTextRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    const loader = loaderRef.current;

    if (!topText || !bottomText || !topHalf || !bottomHalf || !loader) return;

    // Set initial states and ensure visibility when re-running on route changes
    gsap.set(loader, { display: "flex" });
    gsap.set([topText, bottomText], { opacity: 1 });
    gsap.set(topHalf, { clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(bottomHalf, { clipPath: "inset(0% 0% 0% 0%)" });

    const tl = gsap.timeline();

    // 1. Text sliding animation - Starting from center
    tl.fromTo(
      topText,
      { x: "80vw" },
      { x: "0vw", duration: 3.5, ease: "power3.inOut" },
      0
    ).fromTo(
      bottomText,
      { x: "-80vw" },
      { x: "0vw", duration: 3.5, ease: "power3.inOut" },
      0
    );

    // 2. Split screen animation using clip-path (Top clips up, Bottom clips down)
    tl.to(
      topHalf,
      { clipPath: "inset(0% 0% 100% 0%)", duration: 1.5, ease: "expo.inOut" },
      "-=0.6" // Start slightly before the text animation completely stops
    )
      .to(
        bottomHalf,
        { clipPath: "inset(100% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
        "<" // Sync with topHalf
      )

      // 3. Hide loader container completely from DOM to allow interactions
      .set(loader, { display: "none" });

    return () => {
      tl.kill();
    };
  }, [pathname]); // Re-run animation on every route change

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex h-screen w-full flex-col pointer-events-none"
    >
      {/* Top Half */}
      <div
        ref={topHalfRef}
        className="relative z-10 flex h-1/2 w-full mb-[-2px] items-start justify-center overflow-hidden bg-black text-white"
      >
        <h1
          ref={topTextRef}
          className="absolute top-0 mt-[-2vw] whitespace-nowrap text-[32vw] leading-[0.75] tracking-tighter font-medium uppercase antialiased md:text-[28vw]"
        >
          MEGAMIND
        </h1>
      </div>

      {/* Bottom Half */}
      <div
        ref={bottomHalfRef}
        className="relative flex h-1/2 w-full items-end justify-center overflow-hidden bg-black text-white"
      >
        <h1
          ref={bottomTextRef}
          className="absolute bottom-0 mb-[-3vw] whitespace-nowrap text-[32vw] leading-[0.75] tracking-tighter font-medium uppercase antialiased md:text-[28vw]"
        >
          STUDIOS
        </h1>
      </div>
    </div>
  );
}
