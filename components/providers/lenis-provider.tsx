"use client";

import { useRef } from "react";
import type { ElementRef } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisRefCompat = any;

export default function LenisProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lenisRef = useRef<LenisRefCompat | null>(null);

  useGSAP(() => {
    const lenis = lenisRef.current?.lenis;

    if (!lenis) {
      return;
    }

    const syncScrollTrigger = () => ScrollTrigger.update();
    const handleRefresh = () => {
      lenis.resize?.();
    };

    lenis.on("scroll", syncScrollTrigger);
    ScrollTrigger.addEventListener("refresh", handleRefresh);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      lenis.off("scroll", syncScrollTrigger);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      autoRaf={true}
      options={{
        duration: 1.25,
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      }}
    >
      {children as any}
    </ReactLenis>
  );
}
