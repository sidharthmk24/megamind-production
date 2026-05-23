"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "Brand Films",
  "Ad Films",
  "Performance Marketing Videos",
  "Testimonial and Corporate Videos",
  "Photography",
  "Podcast Production",
];

// Full-width horizontal divider line with white square nodes at the outer vertical line intersections
const GridDivider = ({ nodes = [0, 100] }: { nodes?: number[] }) => (
  <div className="relative w-full h-[1px]">
    {/* Full width line to cross the 4rem vertical lines and form 4-way intersections */}
    <div className="absolute top-0 h-[1px] w-[100vw] left-1/2 -translate-x-1/2 bg-white/10" />
    {nodes.map((pos) => (
      <div
        key={pos}
        className={`absolute top-1/2 w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-40 ${pos === 100 ? "hidden md:block" : ""}`}
        style={{ left: `${pos}%` }}
      />
    ))}
  </div>
);

function ServiceItem({ title }: { title: string }) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTlRef = useRef<gsap.core.Timeline | null>(null);

  const characters = title.split("");

  useGSAP(
    () => {
      const charElements = textRef.current?.querySelectorAll(".char");

      // Character split-text flicker intro animation when scrolled into view
      if (charElements && charElements.length > 0) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        })
        .to(charElements, {
          opacity: 0,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        })
        .to(charElements, {
          opacity: 1,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        }, "-=0.15");

        scrollTlRef.current = scrollTl;
      }

      const handleMouseEnter = () => {
        if (!charElements) return;

        // Kill scroll-trigger intro timeline if it's running to prevent overlap issues
        if (scrollTlRef.current) {
          scrollTlRef.current.kill();
          scrollTlRef.current = null;
        }

        if (tlRef.current) {
          tlRef.current.kill();
          gsap.set(charElements, { opacity: 1 });
        }

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(charElements, { opacity: 1 });
          },
        });

        tl.to(charElements, {
          opacity: 0,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        })
          .to(
            charElements,
            {
              opacity: 1,
              duration: 0.03,
              stagger: { amount: 0.2, from: "random" },
              ease: "none",
            },
            "-=0.15"
          )
          .to(
            indicatorRef.current,
            { width: "32px", opacity: 1, duration: 0.6, ease: "expo.out" },
            0
          );

        tlRef.current = tl;
      };

      const handleMouseLeave = () => {
        if (tlRef.current) {
          tlRef.current.kill();
          tlRef.current = null;
        }

        if (charElements) gsap.set(charElements, { opacity: 1 });

        gsap.to(indicatorRef.current, {
          width: "0px",
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const el = itemRef.current;
      if (el) {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      }

      return () => {
        if (el) {
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("mouseleave", handleMouseLeave);
        }
        if (tlRef.current) tlRef.current.kill();
        if (scrollTlRef.current) scrollTlRef.current.kill();
      };
    },
    { scope: itemRef }
  );

  return (
    <button
      ref={itemRef}
      type="button"
      className="group relative w-full text-left py-[18px] md:py-[20px] px-5 md:px-12 overflow-hidden"
    >
      <span
        ref={textRef}
        className="block font-light text-4xl md:text-6xl leading-[1.1] tracking-[-0.02em] text-white"
      >
        {title.split(" ").map((word, wIdx, arr) => (
          <span key={wIdx}>
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((char, cIdx) => (
                <span
                  key={cIdx}
                  className="char inline-block will-change-transform"
                >
                  {char}
                </span>
              ))}
            </span>
            {wIdx < arr.length - 1 && " "}
          </span>
        ))}
      </span>

      {/* <div
        ref={indicatorRef}
        className="absolute left-5 md:left-7 bottom-[12px] w-0 h-[2px] bg-white opacity-0"
      /> */}
    </button>
  );
}

export default function Services() {
  const servicesRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const splitText = (text: string) => {
    return text.split("").map((ch, i) => (
      <span key={i} className="svc-char inline-block whitespace-pre will-change-opacity">
        {ch === " " ? "\u00a0" : ch}
      </span>
    ));
  };

  useGSAP(
    () => {
      // Decoupled sub-heading fade and rise up
      gsap.from("[data-about-copy]", {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: "power3.out",
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
        },
      });

      // Main intro heading character split-text flicker animation
      const charEls = headingRef.current?.querySelectorAll(".svc-char");
      if (charEls && charEls.length > 0) {
        gsap.timeline({
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        })
        .to(charEls, {
          opacity: 0,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        })
        .to(charEls, {
          opacity: 1,
          duration: 0.03,
          stagger: { amount: 0.2, from: "random" },
          ease: "none",
        }, "-=0.15");
      }

      gsap.from(".service-item-container", {
        duration: 1,
        opacity: 0,
        y: 50,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: servicesRef }
  );

  return (
    <section
      id="services"
      ref={servicesRef}
      className="relative w-full bg-[black] text-white overflow-hidden"
    >
      {/* ─── INNER CONTENT COLUMN ─── */}
      <div className="relative z-10 pl-[50px] pr-0 md:px-[40px] md:pt-6">

        {/* Intro Block - Hidden on mobile since it's merged into metrics.tsx */}
        {/* Top GridDivider — nodes align with the outer vertical lines */}
        {/* <GridDivider nodes={[0, 100]} /> */}
        <div className="block px-2 md:px-12 pt-7 pb-8">
          <div className="md:max-w-[70%]">
            <p
              className="text-[12px] text-white/40 font-light tracking-[0.2em] uppercase mb-3 md:mb-6"
              data-about-copy
            >
              <span className="md:hidden">What we do</span>
              <span className="hidden md:inline">What we do</span>
            </p>
            <h2 ref={headingRef} className="md:text-5xl text-2xl font-light tracking-tight text-white/90">
              {splitText("We collaborate with brands across industries to create visual stories that feel purposeful, cinematic, and human.")}
            </h2>
          </div>
        </div>

        {/* Services List */}
        {services.map((service) => (
          <div key={service} className="service-item-container">
            <GridDivider nodes={[0, 100]} />
            <ServiceItem title={service} />
          </div>
        ))}

        <GridDivider nodes={[0, 100]} />
      </div>
    </section>
  );
}