"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Crosshair from "@/components/ui/Crosshair";
import { PROJECTS, Project } from "@/lib/projects-data";
import Header from "../home/header";

/* ─────────────────────────────────────────────
   SCROLL CONFIG
───────────────────────────────────────────── */
const CARD_W = 520;
const CARD_H = 392; // 16:9 widescreen ratio, perfect as in the photo
const CARD_GAP = 15; // matched gap for uniform grid spacing
const STRIDE = CARD_W + CARD_GAP;

const SERVICES = [
  "All Services",
  "Brand Films",
  "Ad Films",
  "Performance Marketing Videos",
  "Testimonial and Corporate Videos",
  "Photography",
  "Podcast Production"
];

/* ─────────────────────────────────────────────
   ENCRYPT-TEXT HOOK
───────────────────────────────────────────── */
const SYMBOLS = "!@#$%^&*+-=?<>[]{}~|";
const rndSym = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

function useEncryptText(text: string, elRef: React.RefObject<HTMLElement | null>) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spansRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    node.innerHTML = "";
    spansRef.current = text.split("").map((ch) => {
      const s = document.createElement("span");
      s.dataset.orig = ch;
      s.style.display = "inline-block";
      s.style.minWidth = ch === " " ? "0.3em" : "";
      s.textContent = ch === " " ? "\u00a0" : ch;
      node.appendChild(s);
      return s;
    });
  }, [text, elRef]);

  const kill = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scrambleSpan = useCallback((s: HTMLSpanElement) => {
    if (s.dataset.orig === " ") return;
    s.textContent = rndSym();
    if (Math.random() < 0.28) {
      s.style.color = "#cc1111";
      const t = setTimeout(() => {
        s.style.color = "";
      }, 70 + Math.random() * 90);
      timersRef.current.push(t);
    } else {
      s.style.color = "";
    }
  }, []);

  const scramble = useCallback(() => {
    kill();
    const spans = spansRef.current;
    spans.forEach((s) => scrambleSpan(s));
    const order = spans
      .map((_, i) => i)
      .filter((i) => spans[i].dataset.orig !== " ")
      .sort(() => Math.random() - 0.5);
    const BASE = 38, JIT = 32;
    order.forEach((idx, pos) => {
      const s = spans[idx];
      let ticks = 0;
      const maxTicks = 3 + Math.floor(Math.random() * 4);
      const tick = () => {
        ticks++;
        if (ticks < maxTicks) {
          scrambleSpan(s);
          timersRef.current.push(setTimeout(tick, BASE + Math.random() * JIT));
        } else {
          s.textContent = s.dataset.orig ?? "";
          s.style.color = "";
        }
      };
      timersRef.current.push(setTimeout(tick, pos * (BASE + Math.random() * JIT)));
    });
  }, [kill, scrambleSpan]);

  const restore = useCallback(() => {
    kill();
    spansRef.current.forEach((s) => {
      s.textContent = s.dataset.orig === " " ? "\u00a0" : (s.dataset.orig ?? "");
      s.style.color = "";
    });
  }, [kill]);

  useEffect(() => () => kill(), [kill]);
  return { scramble, restore };
}

/* ─────────────────────────────────────────────
   SERVICE-CHAR ANIMATION HOOK
───────────────────────────────────────────── */
function useServiceCharAnim(elRef: React.RefObject<HTMLElement | null>) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    const charEls = Array.from(el.querySelectorAll<HTMLElement>(".svc-char"));
    if (!charEls.length) return;
    if (tlRef.current) { tlRef.current.kill(); gsap.set(charEls, { opacity: 1 }); }
    tlRef.current = gsap.timeline({ onComplete: () => gsap.set(charEls, { opacity: 1 }) })
      .to(charEls, { opacity: 0, duration: 0.03, stagger: { amount: 0.18, from: "random" }, ease: "none" })
      .to(charEls, { opacity: 1, duration: 0.03, stagger: { amount: 0.18, from: "random" }, ease: "none" }, "-=0.12");
  }, [elRef]);

  const stop = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = null;
    const el = elRef.current;
    if (el) gsap.set(Array.from(el.querySelectorAll<HTMLElement>(".svc-char")), { opacity: 1 });
  }, [elRef]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);
  return { play, stop };
}

/* ─────────────────────────────────────────────
   VIDEO CARD
───────────────────────────────────────────── */
function VideoCard({
  project,
  onActivate,
  activeId,
}: {
  project: Project;
  onActivate: (id: string) => void;
  activeId: string;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLElement>(null);
  const categoryRef = useRef<HTMLElement>(null);

  const { scramble: scrambleClient, restore: restoreClient } = useEncryptText(project.client, clientRef);
  const { scramble: scrambleCategory, restore: restoreCategory } = useEncryptText(project.category, categoryRef);
  const { play: playTitle, stop: stopTitle } = useServiceCharAnim(titleRef);

  const handleEnter = useCallback(() => {
    onActivate(project.id);
    videoRef.current?.play().catch(() => { });
    if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" });
    scrambleClient();
    scrambleCategory();
    setTimeout(() => playTitle(), 100);
  }, [project.id, onActivate, scrambleClient, scrambleCategory, playTitle]);

  const handleLeave = useCallback(() => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" });
    restoreClient();
    restoreCategory();
    stopTitle();
  }, [restoreClient, restoreCategory, stopTitle]);

  const handleClick = useCallback(() => {
    router.push(`/featured-projects/${project.slug}`);
  }, [router, project.slug]);

  const titleChars = project.title.split("");

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-none grayscale brightness-[0.45] transition-all duration-[550ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:grayscale-0 hover:brightness-100 hover:z-[5] group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      style={{ cursor: "none", flex: `0 0 ${CARD_W}px`, height: `${CARD_H}px` }}
    >
      <img
        src={project.poster}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-[ease] group-hover:scale-[1.04]"
        draggable={false}
      />

      <video
        ref={videoRef}
        src={project.videoSrc}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-[400ms] ease-[ease] group-hover:opacity-100"
      />

      <div className="absolute inset-0 pointer-events-none z-[2] bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div
        ref={overlayRef}
        className="absolute inset-0 z-[10] flex items-end justify-start py-[30px] px-[32px] opacity-0 pointer-events-none"
      >
        <div className="flex flex-col gap-[4px] items-start">
          <span
            ref={clientRef as React.RefObject<HTMLSpanElement>}
            className="text-[14px] tracking-normal normal-case text-white/85 font-light inline-block min-h-[1em]"
          />
          <h3
            ref={titleRef as React.RefObject<HTMLHeadingElement>}
            className="text-[clamp(2.4rem,3.4vw,3.2rem)] font-extralight tracking-[-0.02em] text-white mt-[2px] mb-[8px] mx-0 leading-[1.05]"
          >
            {titleChars.map((ch, i) => (
              <span key={i} className="svc-char inline-block whitespace-pre">{ch}</span>
            ))}
          </h3>
          <span
            ref={categoryRef as React.RefObject<HTMLSpanElement>}
            className="inline-block bg-white text-black border-none py-[4px] px-[10px] text-[11px] tracking-normal normal-case font-medium min-h-auto"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INFINITE ROW (parallax scroll)
───────────────────────────────────────────── */
function InfiniteRow({
  projects,
  direction,
  scrollProgress,
  activeId,
  onActivate,
}: {
  projects: Project[];
  direction: 1 | -1;
  scrollProgress: number;
  activeId: string;
  onActivate: (id: string) => void;
}) {
  if (projects.length === 0) return null; // Gracefully handle empty rows

  const SINGLE_SET = projects.length * STRIDE;
  const raw = scrollProgress * 0.35 * direction;
  const offset = ((raw % SINGLE_SET) + SINGLE_SET) % SINGLE_SET;

  // Extend the array significantly to guarantee screen coverage even for 1 item
  let extended: Project[] = [];
  while (extended.length < 20) {
    extended = [...extended, ...projects];
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex will-change-transform" style={{ transform: `translateX(-${offset}px)`, gap: `${CARD_GAP}px` }}>
        {extended.map((p, i) => (
          <VideoCard key={`${p.id}-${i}`} project={p} activeId={activeId} onActivate={onActivate} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN GALLERY
───────────────────────────────────────────── */
export default function VideoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedService, setSelectedService] = useState("All Services");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const [isCapturing, setIsCapturing] = useState(false);

  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastScrollRef = useRef(0);

  const filteredProjects = selectedService === "All Services"
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedService);

  // Guarantee mutually exclusive rows
  const half = Math.ceil(filteredProjects.length / 2);
  const rowAProjects = filteredProjects.slice(0, half);
  const rowBProjects = filteredProjects.slice(half);

  // Fallback to safely track the active project
  useEffect(() => {
    if (filteredProjects.length > 0 && !filteredProjects.find(p => p.id === activeId)) {
      setActiveId(filteredProjects[0].id);
    }
  }, [filteredProjects, activeId]);

  const activeProject = filteredProjects.find((p) => p.id === activeId) ?? filteredProjects[0] ?? PROJECTS[0];

  const handleActivate = useCallback((id: string) => setActiveId(id), []);

  const animateInertia = useCallback(() => {
    if (Math.abs(velocityRef.current) < 0.1) { velocityRef.current = 0; return; }
    velocityRef.current *= 0.94;
    setScrollProgress((p) => p + velocityRef.current);
    lastScrollRef.current += velocityRef.current;
    rafRef.current = requestAnimationFrame(animateInertia);
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isCapturing) return;
      e.preventDefault();
      e.stopPropagation();
      cancelAnimationFrame(rafRef.current);
      velocityRef.current += e.deltaY * 0.15;
      setScrollProgress((p) => p + e.deltaY * 0.15);
      lastScrollRef.current += e.deltaY * 0.15;
      rafRef.current = requestAnimationFrame(animateInertia);
    },
    [isCapturing, animateInertia]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCapturing(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div ref={sectionRef} className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-72px)] bg-black text-white overflow-hidden flex flex-col justify-center cursor-none gap-0 p-0 pb-[80px]">

      {/* Two infinite rows */}
      <div className="relative z-[5] w-full flex flex-col gap-[24px] p-0 before:content-[''] before:absolute before:top-0 before:bottom-0 before:w-[100px] before:z-10 before:pointer-events-none before:left-0 before:bg-gradient-to-r before:from-black before:to-transparent after:content-[''] after:absolute after:top-0 after:bottom-0 after:w-[100px] after:z-10 after:pointer-events-none after:right-0 after:bg-gradient-to-l after:from-black after:to-transparent">

        {/* Dropdown Services Menu */}
        <div className="absolute top-[24px] left-[40px] z-[100] flex flex-col items-start">
          <button
            className="inline-flex items-center gap-[8px] text-[13px] text-white cursor-pointer transition-all duration-300 border border-white/20 rounded-full px-4 py-1.5 bg-black/40 backdrop-blur-sm hover:border-white/40 hover:bg-black/60 font-light"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-[5px] h-[5px] border border-white bg-transparent" />
            {selectedService === "All Services" ? "Services" : selectedService}
          </button>

          <div className={`flex flex-col bg-black/75 backdrop-blur-md border border-white/10 rounded-lg p-2 mt-[8px] ml-[6px] gap-[4px] min-w-[200px] shadow-xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isDropdownOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-[10px]'}`}>
            {SERVICES.map((svc, idx) => (
              <button
                key={svc}
                style={{
                  transitionDelay: isDropdownOpen ? `${idx * 40}ms` : '0ms',
                }}
                className={`bg-transparent border-none text-[13px] text-left py-[6px] px-3 rounded-md cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[8px] pointer-events-none'
                  } ${selectedService === svc ? 'text-white font-medium bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                onClick={() => {
                  setSelectedService(svc);
                  setIsDropdownOpen(false);
                }}
              >
                {svc}
              </button>
            ))}
          </div>
        </div>
        {/* Row A — scrolls right */}
        <InfiniteRow
          projects={rowAProjects}
          direction={1}
          scrollProgress={scrollProgress}
          activeId={activeId}
          onActivate={handleActivate}
        />
        {/* Row B — scrolls left */}
        <InfiniteRow
          projects={rowBProjects}
          direction={-1}
          scrollProgress={scrollProgress}
          activeId={activeId}
          onActivate={handleActivate}
        />
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[20] grid grid-cols-[1fr_auto_1fr] items-center py-[22px] px-[40px] pointer-events-none bg-black border-t border-white/10">
        <span className="col-start-2 text-center text-[11px] tracking-[0.18em] text-white/80 font-normal">{activeProject.index}</span>
        <span className="col-start-3 justify-self-end flex items-center gap-[6px] text-[11px] tracking-[0.15em] text-white font-light">
          Scroll&nbsp;
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.9987 10.3995L10.3995 10.3995L10.3994 1.8775M10.3995 10.3995L0.5 0.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>

      {/* Global Crosshair cursor */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <Crosshair
          containerRef={sectionRef as React.RefObject<HTMLElement>}
          color="rgba(255,255,255,0.3)"
        />
      </div>
    </div>
  );
}