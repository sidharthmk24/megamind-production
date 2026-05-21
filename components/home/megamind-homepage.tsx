"use client";

import { useRef } from "react";
import Header from "./header";
import Hero from "./hero";
import About from "./about";
import Services from "./services";
import Metrics from "./metrics";
import WallOfFame from "./wall-of-fame";
import Footer from "./footer";
import FooterVideo from "./FooterVideo";
import GridOverlay from "./grid-overlay";
import NewHero from "./NewHero";
import HeroCarousel from "./NewHero";

export default function MegamindHomepage() {
  const pageRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={pageRef} className="relative w-full">
      <Header />

      {/* relative wrapper so GridOverlay can use absolute inset-0 */}
      <div className="relative">
        <main className="relative z-20 bg-background">
          <HeroCarousel />
          <About />
          <Services />
          <Metrics />
          <WallOfFame />
        </main>

        <Footer />

        {/* Global continuous grid lines + boundary nodes — one source of truth */}
        <GridOverlay />
      </div>

      <FooterVideo />
    </div>
  );
}
