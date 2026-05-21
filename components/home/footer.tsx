"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      // Reveal animations for top section elements
      gsap.from("[data-footer-reveal]", {
        duration: 1.2,
        opacity: 0,
        stagger: 0.1,
        y: 20,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        },
      });


    },
    { scope: footerRef }
  );

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative flex flex-col bg-black text-white font-sans z-[35] md:z-10"
    >
      {/* ─── DESKTOP VIEW ─── */}
      <div className="hidden md:flex flex-col w-full">
        {/* Top Boundary Divider for GridOverlay alignment */}
        <div className="relative w-full h-[1px] overflow-visible z-20">
          {/* <div className="absolute top-0 h-[1px] w-[100vw] left-1/2 -translate-x-1/2 bg-white/10" /> */}
          {/* <div className="absolute top-1/2 left-[40px] w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-40" /> */}
          {/* <div className="absolute top-1/2 right-[40px] w-[5px] h-[5px] bg-white translate-x-1/2 -translate-y-1/2 z-40" /> */}
        </div>

        {/* ─── TOP SECTION ─── */}
        <div className="relative w-full px-[40px] pt-24 pb-16 flex flex-col justify-between z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8 px-12">

            {/* Left Content Area */}
            <div className="flex flex-col gap-8 max-w-2xl ">
              <h2
                className="text-[40px] md:text-[56px] font-normal leading-[1.1] tracking-tight text-white"
                data-footer-reveal
              >
                Ready to bring your <br /> story to life?
              </h2>
              <div data-footer-reveal>
                <button
                  onClick={() =>
                    (window.location.href = "mailto:hello@megamindproductions.in")
                  }
                  className="px-8 py-3 bg-white text-black text-[17px] font-medium hover:bg-gray-200 transition-colors duration-300"
                >
                  Let's Talk
                </button>
              </div>
            </div>

            {/* Right Links Area */}
            <div className="flex flex-col gap-6 w-full lg:w-auto lg:pr-12 text-[15px]">
              {/* Email Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6" data-footer-reveal>
                <span className="w-24 text-white/50 text-right sm:text-left">Email</span>
                <a
                  href="mailto:hello@megamindproductions.in"
                  className="text-white hover:text-white/70 transition-colors"
                >
                  hello@megamindproductions.in
                </a>
              </div>

              {/* Quick Links Row */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6" data-footer-reveal>
                <span className="w-24 text-white/50 text-right sm:text-left pt-1">Quick Links</span>
                <ul className="space-y-3 text-white">
                  <li>
                    <a href="/featured-projects" className="hover:text-white/70 transition-colors">
                      Featured Projects
                    </a>
                  </li>
                  <li>
                    <a href="/production-note" className="hover:text-white/70 transition-colors">
                      Production Notes
                    </a>
                  </li>
                  <li>
                    <a href="/#about" className="hover:text-white/70 transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/#contact" className="hover:text-white/70 transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Branding & Copyright Bar */}
          <div className="mt-32 pt-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 z-10 px-12">
            {/* Logo Assembly */}
            <div className="flex items-center gap-4" data-footer-reveal>
              {/* Custom SVG approximating the stylized 'M' logo */}
              <Image src="/svgs/namedlogo.svg" alt="Megamind Productions" width={400} height={400} />
            </div>

            <p
              className="text-[13px] text-white/50 font-light text-left md:text-right"
              data-footer-reveal
            >
              All Rights Reserved. Megamind Productions ©2026-27
            </p>
          </div>
        </div>
      </div>

      {/* ─── MOBILE VIEW ─── */}
      <div className="md:hidden w-full flex flex-col z-10 px-4 pt-16 pb-10">
        {/* Title */}
        <h2 className="text-[2.2rem] font-light leading-[1.1] tracking-tight text-white mb-8">
          Ready to bring your <br /> story to life?
        </h2>

        {/* Button */}
        <button
          onClick={() => (window.location.href = "mailto:hello@megamindproductions.in")}
          className="w-full bg-white text-black py-4 text-center font-medium text-[16px] transition-colors duration-300 hover:bg-gray-200 mb-16"
        >
          Let's Talk
        </button>

        {/* Logo */}
        <div className="w-full flex items-center justify-start mb-16">
          <Image
            src="/svgs/namedlogo.svg"
            alt="Megamind Productions"
            width={320}
            height={100}
            className="w-full max-w-[280px] h-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Email Block */}
        <div className="flex flex-col gap-1 mb-8">
          <span className="text-[12px] text-white/40 font-light tracking-wide">Email</span>
          <a
            href="mailto:hello@megamindproductions.in"
            className="text-[16px] text-white font-light hover:text-white/70 transition-colors"
          >
            hello@megamindproductions.in
          </a>
        </div>

        {/* Quick Links Block */}
        <div className="flex flex-col gap-4 mb-16">
          <span className="text-[12px] text-white/40 font-light tracking-wide">Quick Links</span>
          <ul className="flex flex-col gap-4 text-[16px] text-white font-light">
            <li>
              <a href="/featured-projects" className="hover:text-white/70 transition-colors">
                Featured Projects
              </a>
            </li>
            <li>
              <a href="/#services" className="hover:text-white/70 transition-colors">
                Our Services
              </a>
            </li>
            <li>
              <a href="/production-note" className="hover:text-white/70 transition-colors">
                Production Notes
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-white/70 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="/#contact" className="hover:text-white/70 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Horizontal Divider line */}
        <div className="w-full h-[1px] bg-white/10 mb-8" />

        {/* Copyright */}
        <div className="w-full flex flex-col items-start gap-1">
          <p className="text-[12px] text-white/50 font-light tracking-wide">
            All Rights Reserved.
          </p>
          <p className="text-[12px] text-white/50 font-light tracking-wide">
            Megamind Productions ©2026-27
          </p>
        </div>
      </div>

    </footer>
  );
}