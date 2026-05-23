"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Crosshair from "@/components/ui/Crosshair";
import { PROJECTS, Project } from "@/lib/projects-data";
import Header from "../home/header";

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const CARD_W = 520;
const CARD_H = 340;
const CARD_ASPECT_RATIO = CARD_W / CARD_H;
const CARD_MIN_H = 220;
const CARD_GAP = 15;
const DESKTOP_HEADER_HEIGHT = 72;
const MOBILE_HEADER_HEIGHT = 80;
const BOTTOM_BAR_ESTIMATE = 56;
const ROW_GAP = 24;

function getResponsiveCardSize({
  footerBarHeight,
  headerHeight,
  rowCount,
  viewportHeight,
}: {
  footerBarHeight: number;
  headerHeight: number;
  rowCount: number;
  viewportHeight: number;
}) {
  if (!viewportHeight || rowCount === 0) {
    return {
      cardHeight: CARD_H,
      cardWidth: CARD_W,
      stride: CARD_W + CARD_GAP,
    };
  }

  const usableHeight =
    viewportHeight -
    headerHeight -
    footerBarHeight -
    (rowCount - 1) * ROW_GAP;
  const cardHeight = Math.max(
    CARD_MIN_H,
    Math.min(CARD_H, Math.floor(usableHeight / rowCount)),
  );
  const cardWidth = Math.round(cardHeight * CARD_ASPECT_RATIO);

  return {
    cardHeight,
    cardWidth,
    stride: cardWidth + CARD_GAP,
  };
}

const SERVICES = [
  "All Services",
  "Brand Films",
  "Ad Films",
  "Performance Marketing Videos",
  "Testimonial and Corporate Videos",
  "Photography",
  "Podcast Production",
];

/* ─────────────────────────────────────────────
   ENCRYPT-TEXT HOOK
───────────────────────────────────────────── */
const SYMBOLS = "!@#$%^&*+-=?<>[]{}~|";
const rndSym = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

function useEncryptText(
  text: string,
  elRef: React.RefObject<HTMLElement | null>
) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spansRef = useRef<HTMLSpanElement[]>([]);

  /* Build spans once on mount / text change */
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
    const BASE = 38,
      JIT = 32;
    order.forEach((idx, pos) => {
      const s = spans[idx];
      let ticks = 0;
      const maxTicks = 3 + Math.floor(Math.random() * 4);
      const tick = () => {
        ticks++;
        if (ticks < maxTicks) {
          scrambleSpan(s);
          timersRef.current.push(
            setTimeout(tick, BASE + Math.random() * JIT)
          );
        } else {
          s.textContent = s.dataset.orig ?? "";
          s.style.color = "";
        }
      };
      timersRef.current.push(
        setTimeout(tick, pos * (BASE + Math.random() * JIT))
      );
    });
  }, [kill, scrambleSpan]);

  const restore = useCallback(() => {
    kill();
    spansRef.current.forEach((s) => {
      s.textContent =
        s.dataset.orig === " " ? "\u00a0" : (s.dataset.orig ?? "");
      s.style.color = "";
    });
  }, [kill]);

  useEffect(() => () => kill(), [kill]);
  return { scramble, restore };
}

/* ─────────────────────────────────────────────
   TITLE CHAR-FLICKER HOOK  (replaces GSAP service anim)
───────────────────────────────────────────── */
function useTitleFlicker(elRef: React.RefObject<HTMLElement | null>) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>(".tch"));
    if (!chars.length) return;
    if (tlRef.current) {
      tlRef.current.kill();
      gsap.set(chars, { opacity: 1 });
    }
    tlRef.current = gsap
      .timeline({ onComplete: () => gsap.set(chars, { opacity: 1 }) })
      .to(chars, {
        opacity: 0,
        duration: 0.03,
        stagger: { amount: 0.18, from: "random" },
        ease: "none",
      })
      .to(
        chars,
        {
          opacity: 1,
          duration: 0.03,
          stagger: { amount: 0.18, from: "random" },
          ease: "none",
        },
        "-=0.12"
      );
  }, [elRef]);

  const stop = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = null;
    const el = elRef.current;
    if (el)
      gsap.set(
        Array.from(el.querySelectorAll<HTMLElement>(".tch")),
        { opacity: 1 }
      );
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
  cardHeight,
  cardWidth,
}: {
  project: Project;
  onActivate: (id: string) => void;
  cardHeight: number;
  cardWidth: number;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLElement>(null);

  const { scramble: scrambleClient, restore: restoreClient } =
    useEncryptText(project.client, clientRef);
  const { scramble: scrambleCategory, restore: restoreCategory } =
    useEncryptText(project.category, categoryRef);
  const { play: playTitle, stop: stopTitle } = useTitleFlicker(
    titleRef as React.RefObject<HTMLElement>
  );

  const handleEnter = useCallback(() => {
    onActivate(project.id);
    videoRef.current?.play().catch(() => {});
    if (overlayRef.current)
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    scrambleClient();
    scrambleCategory();
    setTimeout(() => playTitle(), 100);
  }, [project.id, onActivate, scrambleClient, scrambleCategory, playTitle]);

  const handleLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (overlayRef.current)
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    restoreClient();
    restoreCategory();
    stopTitle();
  }, [restoreClient, restoreCategory, stopTitle]);

  const handleClick = useCallback(() => {
    router.push(`/featured-projects/${project.slug}`);
  }, [router, project.slug]);

  return (
    <div
      className="relative overflow-hidden grayscale brightness-[0.45]
                 transition-all duration-[550ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                 hover:grayscale-0 hover:brightness-100 hover:z-[5] group"
      style={{
        cursor: "none",
        flex: `0 0 ${cardWidth}px`,
        height: `${cardHeight}px`,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {/* Poster */}
      <img
        src={project.poster}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover
                   transition-transform duration-[600ms] ease-[ease] group-hover:scale-[1.04]"
        draggable={false}
      />

      {/* Video — fades over poster on hover */}
      <video
        ref={videoRef}
        src={project.videoSrc}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover
                   opacity-0 transition-opacity duration-[400ms] ease-[ease]
                   group-hover:opacity-100"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none z-[2]
                      bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Text overlay — fades in on hover */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[10] flex items-end justify-start
                   py-[30px] px-[32px] opacity-0 pointer-events-none"
      >
        <div className="flex flex-col gap-[4px] items-start">
          {/* Client — scramble animation */}
          <span
            ref={clientRef as React.RefObject<HTMLSpanElement>}
            className="text-[14px] tracking-normal normal-case
                       text-white/85 font-light inline-block min-h-[1em]"
          />

          {/* Title — char flicker animation */}
          <h3
            ref={titleRef}
            className="text-[clamp(2rem,3.4vw,3.2rem)] font-extralight
                       tracking-[-0.02em] text-white mt-[2px] mb-[8px]
                       mx-0 leading-[1.05]"
          >
            {project.title.split("").map((ch, i) => (
              <span
                key={i}
                className="tch inline-block whitespace-pre"
              >
                {ch}
              </span>
            ))}
          </h3>

          {/* Category — scramble animation */}
          <span
            ref={categoryRef as React.RefObject<HTMLSpanElement>}
            className="inline-block bg-white text-black border-none
                       py-[4px] px-[10px] text-[11px] tracking-normal
                       normal-case font-medium min-h-[1em]"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INFINITE ROW
───────────────────────────────────────────── */
function InfiniteRow({
  projects,
  direction,
  scrollProgress,
  onActivate,
  cardHeight,
  cardWidth,
  stride,
}: {
  projects: Project[];
  direction: 1 | -1;
  scrollProgress: number;
  onActivate: (id: string) => void;
  cardHeight: number;
  cardWidth: number;
  stride: number;
}) {
  if (!projects.length) return null;

  const SINGLE_SET = projects.length * stride;
  const raw = scrollProgress * 0.35 * direction;
  const offset = ((raw % SINGLE_SET) + SINGLE_SET) % SINGLE_SET;

  /* Repeat enough copies to fill screen at any size */
  let extended: Project[] = [];
  while (extended.length < 24) extended = [...extended, ...projects];

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex will-change-transform"
        style={{
          transform: `translateX(-${offset}px)`,
          gap: `${CARD_GAP}px`,
        }}
      >
        {extended.map((p, i) => (
          <VideoCard
            key={`${p.id}-${i}`}
            project={p}
            cardHeight={cardHeight}
            cardWidth={cardWidth}
            onActivate={onActivate}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SERVICES DROPDOWN
───────────────────────────────────────────── */
function ServicesDropdown({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-[24px] left-[40px] z-[100] flex flex-col items-start">
      <button
        className="inline-flex items-center gap-[8px] text-[13px] text-white
                   cursor-none  font-light transition-all duration-300"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-[5px] h-[5px] border border-white bg-transparent flex-shrink-0" />
        {selected === "All Services" ? "Services" : selected}
      </button>

      <div
        className={`flex flex-col 
                    rounded-lg p-2 mt-[8px] ml-[6px] gap-[4px] min-w-[220px] shadow-xl
                    transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                    ${open
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none -translate-y-[10px]"
                    }`}
      >
        {SERVICES.map((svc, idx) => (
          <button
            key={svc}
            style={{ transitionDelay: open ? `${idx * 40}ms` : "0ms" }}
            className={`bg-transparent border-none text-[13px] text-left
                        py-[6px] px-3 rounded-md cursor-none
                        transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                        ${open
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-[8px] pointer-events-none"
                        }
                        ${selected === svc
                          ? "text-white font-medium "
                          : "text-white/60 hover:text-white "
                        }`}
            onClick={() => { onChange(svc); setOpen(false); }}
          >
            {svc}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
function DesktopGallerySwiper() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const footerBarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedService, setSelectedService] = useState("All Services");
  const [activeId, setActiveId] = useState(PROJECTS[0]?.id ?? "");
  const [isCapturing, setIsCapturing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [footerBarHeight, setFooterBarHeight] = useState(BOTTOM_BAR_ESTIMATE);

  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);

  /* ── Filter & split into two rows ── */
  const filtered =
    selectedService === "All Services"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedService);

  const half = Math.ceil(filtered.length / 2);
  const rowA = filtered.slice(0, half);
  const rowB = filtered.slice(half);
  const rowCount = rowB.length > 0 ? 2 : rowA.length > 0 ? 1 : 0;
  const headerHeight = DESKTOP_HEADER_HEIGHT;
  const { cardHeight, cardWidth, stride } = getResponsiveCardSize({
    footerBarHeight,
    headerHeight,
    rowCount,
    viewportHeight,
  });

  const activeProject =
    filtered.find((p) => p.id === activeId) ?? filtered[0] ?? PROJECTS[0];

  const handleActivate = useCallback((id: string) => setActiveId(id), []);

  /* ── Inertia loop ── */
  const animateInertia = useCallback(() => {
    const step = () => {
      if (Math.abs(velocityRef.current) < 0.1) {
        velocityRef.current = 0;
        return;
      }
      velocityRef.current *= 0.94;
      setScrollProgress((p) => p + velocityRef.current);
      rafRef.current = requestAnimationFrame(step);
    };

    step();
  }, []);

  /* ── IntersectionObserver — capture wheel only when section is visible ── */
  useEffect(() => {
    const updateViewportMetrics = () => {
      setViewportHeight(
        Math.round(window.visualViewport?.height ?? window.innerHeight),
      );
      setViewportWidth(
        Math.round(window.visualViewport?.width ?? window.innerWidth),
      );
      if (footerBarRef.current) {
        setFooterBarHeight(footerBarRef.current.offsetHeight);
      }
    };

    updateViewportMetrics();
    window.addEventListener("resize", updateViewportMetrics);
    window.visualViewport?.addEventListener("resize", updateViewportMetrics);

    return () => {
      window.removeEventListener("resize", updateViewportMetrics);
      window.visualViewport?.removeEventListener("resize", updateViewportMetrics);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setIsCapturing(
          entry.isIntersecting && entry.intersectionRatio >= 0.6
        ),
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (!isCapturing) return;
      e.preventDefault();
      e.stopPropagation();
      cancelAnimationFrame(rafRef.current);
      velocityRef.current += e.deltaY * 0.15;
      setScrollProgress((p) => p + e.deltaY * 0.15);
      animateInertia();
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [animateInertia, isCapturing]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /* ── Active project index label ── */
  const activeIndex = activeProject
    ? String(
        filtered.findIndex((p) => p.id === activeProject.id) + 1
      ).padStart(2, "0") +
      "/" +
      String(filtered.length).padStart(2, "0")
    : "01/00";

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-black">
      <Header />

      <div
        ref={sectionRef}
        className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-black text-white cursor-none"
      >
        {/* ── TWO INFINITE ROWS ── */}
        <div
          className="relative z-[5] flex min-h-0 w-full flex-1 flex-col gap-[24px] overflow-hidden
                     before:content-[''] before:absolute before:top-0 before:bottom-0
                     before:w-[120px] before:z-10 before:pointer-events-none
                     before:left-0 before:bg-gradient-to-r before:from-black before:to-transparent
                     after:content-[''] after:absolute after:top-0 after:bottom-0
                     after:w-[120px] after:z-10 after:pointer-events-none
                     after:right-0 after:bg-gradient-to-l after:from-black after:to-transparent"
        >
          <ServicesDropdown
            selected={selectedService}
            onChange={setSelectedService}
          />

          {/* Row A — scrolls right (direction +1) */}
          <InfiniteRow
            projects={rowA}
            direction={1}
            scrollProgress={scrollProgress}
            cardHeight={cardHeight}
            cardWidth={cardWidth}
            onActivate={handleActivate}
            stride={stride}
          />

          {/* Row B — scrolls left (direction -1) */}
          <InfiniteRow
            projects={rowB}
            direction={-1}
            scrollProgress={scrollProgress}
            cardHeight={cardHeight}
            cardWidth={cardWidth}
            onActivate={handleActivate}
            stride={stride}
          />
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          ref={footerBarRef}
          className="w-full z-[20] grid grid-cols-[1fr_auto_1fr] items-center
                     py-[22px] px-[40px] bg-black border-t border-white/10"
        >
          <span
            className="col-start-2 text-center text-[11px] tracking-[0.18em]
                       text-white/80 font-normal"
          >
            {activeIndex}
          </span>
          <span
            className="col-start-3 justify-self-end flex items-center gap-[6px]
                       text-[11px] tracking-[0.15em] text-white font-light"
          >
            Scroll&nbsp;
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.9987 10.3995L10.3995 10.3995L10.3994 1.8775M10.3995 10.3995L0.5 0.5"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {/* ── CROSSHAIR CURSOR ── */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <Crosshair
            containerRef={sectionRef as React.RefObject<HTMLElement>}
            color="rgba(255,255,255,0.3)"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE VIDEO CARD
   Matches the layouts, lines, text placements
   and overlay animations exactly as in the mockup photo.
───────────────────────────────────────────── */
interface MobileVideoCardProps {
  project: Project;
  isActive: boolean;
}

function MobileVideoCard({ project, isActive }: MobileVideoCardProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLElement>(null);

  const { scramble: scrambleClient, restore: restoreClient } =
    useEncryptText(project.client, clientRef);
  const { scramble: scrambleCategory, restore: restoreCategory } =
    useEncryptText(project.category, categoryRef);
  const { play: playTitle, stop: stopTitle } = useTitleFlicker(
    titleRef as React.RefObject<HTMLElement>
  );

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {});
      scrambleClient();
      scrambleCategory();
      const t = setTimeout(() => playTitle(), 100);
      return () => clearTimeout(t);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      restoreClient();
      restoreCategory();
      stopTitle();
    }
  }, [isActive, scrambleClient, scrambleCategory, playTitle, restoreClient, restoreCategory, stopTitle]);

  const handleClick = useCallback(() => {
    router.push(`/featured-projects/${project.slug}`);
  }, [router, project.slug]);

  return (
    <div
      data-project-card=""
      className={`relative w-full h-[280px] overflow-hidden border-b border-white/10 shrink-0 transition-all duration-[600ms] ease-out select-none
                 ${isActive ? "grayscale-0 brightness-100" : "grayscale brightness-[0.35]"}`}
      onClick={handleClick}
    >
      {/* Background Poster */}
      <img
        src={project.poster}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Video Overlay */}
      <video
        ref={videoRef}
        src={project.videoSrc}
        muted
        loop
        playsInline
        preload="none"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
                   ${isActive ? "opacity-100" : "opacity-0"}`}
      />

      {/* Dark Ambient Overlay */}
      <div className={`absolute inset-0 pointer-events-none z-[2] bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-500
                      ${isActive ? "opacity-100" : "opacity-0"}`} />

      {/* Elegant index positioning matching photo */}
      <div className="absolute top-[20px] left-[72px] text-[11px] tracking-[0.08em] text-white/50 font-light z-[8]">
        {project.index}
      </div>

      {/* Active overlay content details */}
      <div
        className={`absolute inset-0 z-[10] flex items-end justify-start py-[30px] pl-[72px] pr-[20px] pointer-events-none transition-all duration-500 ease-out
                   ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[10px]"}`}
      >
        <div className="flex flex-col gap-[3px] items-start">
          <span
            ref={clientRef as React.RefObject<HTMLSpanElement>}
            className="text-[13px] tracking-normal normal-case text-white/85 font-light min-h-[1.2em]"
          />

          <h3
            ref={titleRef}
            className="text-[clamp(1.8rem,8vw,2.5rem)] font-extralight tracking-[-0.02em] text-white mt-[1px] mb-[6px] leading-[1.1]"
          >
            {project.title.split("").map((ch, i) => (
              <span key={i} className="tch inline-block whitespace-pre">
                {ch}
              </span>
            ))}
          </h3>

          <span
            ref={categoryRef as React.RefObject<HTMLSpanElement>}
            className="inline-block bg-white text-black border-none py-[3px] px-[8px] text-[10px] tracking-normal normal-case font-semibold"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE GALLERY SWIPER
   Single vertical infinite repeating list of project cards
   with left margin grid lines and centered viewport activation.
───────────────────────────────────────────── */
function MobileGallerySwiper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Repeat projects 3 times to allow smooth scrolling loop bounds
  const duplicatedProjects = [...PROJECTS, ...PROJECTS, ...PROJECTS];

  const updateActiveIndex = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerCenter = container.scrollTop + container.clientHeight / 2;
    const centerCardIndex = Math.floor(containerCenter / 280);
    const activeProjIdx = centerCardIndex % PROJECTS.length;

    setActiveIndex(activeProjIdx);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop } = container;
    const singleSetHeight = PROJECTS.length * 280;

    // Scroll loops at boundaries
    if (scrollTop < 50) {
      container.scrollTop = scrollTop + singleSetHeight;
      return;
    }

    if (scrollTop >= singleSetHeight * 2 - container.clientHeight) {
      container.scrollTop = scrollTop - singleSetHeight;
      return;
    }

    updateActiveIndex();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scroll to the start of the middle set immediately on mount
    container.scrollTop = PROJECTS.length * 280;

    // Set initial active state based on center
    updateActiveIndex();

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[calc(100dvh-80px)] overflow-hidden bg-black flex flex-col">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Grid vertical line aligned perfectly to the header container at 51px */}
      <div className="absolute left-[51px] top-0 bottom-0 w-[1px] bg-white/10 z-[15] pointer-events-none" />

      {/* Single stationary scanner center dot centered vertically on left line */}
      <div
        className="absolute w-[6px] h-[6px] bg-white z-[20] top-1/2"
        style={{
          left: "51px",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Scrollable Project Column */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex flex-col w-full relative">
          {duplicatedProjects.map((project, idx) => {
            const activeProjIdx = idx % PROJECTS.length;
            const isActive = activeProjIdx === activeIndex;

            return (
              <MobileVideoCard
                key={`${project.id}-mobile-${idx}`}
                project={project}
                isActive={isActive}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MASTER SWITCHER (MAIN EXPORT)
───────────────────────────────────────────── */
export default function CarouselSwiper() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen w-full bg-black" />;
  }

  return (
    <>
      {isMobile ? (
        <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-black">
          <Header />
          <MobileGallerySwiper />
        </div>
      ) : (
        <DesktopGallerySwiper />
      )}
    </>
  );
}
