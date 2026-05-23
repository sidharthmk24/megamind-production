"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PROJECTS, type Project } from "@/lib/projects-data";
import Header from "../home/header";
import EncryptText from "../home/encrypt-text";
import gsap from "gsap";

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

/* ─── helpers ─── */
function formatTime(sec: number) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─────────────────────────────────────────────
   VIDEO PLAYER PAGE
───────────────────────────────────────────── */
export default function VideoPlayer({ project }: { project: Project }) {
  const router = useRouter();
  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS[currentIndex === -1 ? 0 : (currentIndex + 1) % PROJECTS.length];
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const clientRef = useRef<HTMLSpanElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);


  const { scramble: scrambleClient } = useEncryptText(project.client, clientRef);
  const { scramble: scrambleCategory } = useEncryptText(project.category, categoryRef);
  const { play: playTitle } = useServiceCharAnim(titleRef);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrambleClient();
      scrambleCategory();
      playTitle();
    }, 150);
    return () => clearTimeout(timer);
  }, [scrambleClient, scrambleCategory, playTitle, project]);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = () => window.innerWidth <= 768;
  /* Auto-show / hide controls on mouse move */
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (isMobile()) return; // never hide on mobile
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (playing) setControlsVisible(false);
    }, 2800);
  }, [playing]);

  const hideControls = useCallback(() => {
    if (isMobile()) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) setControlsVisible(false);
  }, [playing]);
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  /* Smooth 60fps progress update loop */
  useEffect(() => {
    let animId: number;
    const updateSmooth = () => {
      const v = videoRef.current;
      if (v && v.duration) {
        setSmoothProgress((v.currentTime / v.duration) * 100);
      }
      animId = requestAnimationFrame(updateSmooth);
    };
    if (playing) {
      animId = requestAnimationFrame(updateSmooth);
    } else {
      const v = videoRef.current;
      if (v && v.duration) {
        setSmoothProgress((v.currentTime / v.duration) * 100);
      }
    }
    return () => cancelAnimationFrame(animId);
  }, [playing, currentTime]);

  /* Video events */
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
  }, []);

  /* Play / Pause */
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
      setControlsVisible(true);
    }
  }, []);

  /* Mute */
  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  /* Fullscreen */
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  /* Seek on progress bar click */
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressRef.current;
      const v = videoRef.current;
      if (!bar || !v || !duration) return;
      const rect = bar.getBoundingClientRect();
      const activeWidth = rect.width - (window.innerWidth * 0.1); // Clamp active region to dot at 10vw
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / activeWidth));
      v.currentTime = ratio * duration;
      setSmoothProgress(ratio * 100);
    },
    [duration]
  );

  const progress = smoothProgress;
  // Use JS to calculate the fraction (0 to 1) so CSS calc() works correctly
  const progressFraction = progress / 100;
  const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768;
  const activeWidthStr = isMobileView
    ? `calc(${progressFraction} * 100%)`
    : `calc(${progressFraction} * (100% - 10vw))`;
  return (
    <>
      <style>{`
        /* ── Reset & Page ── */
        .vp-page {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: #000;
          overflow: hidden;
          display: flex;
          
          flex-direction: column;
          cursor: default;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ── Grid Line (Left Vertical Line) ── */
        .vp-grid-line-vertical {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 84px;
          width: 1px;
          background: rgba(255, 255, 255, 0.15);
          z-index: 15;
          pointer-events: none;
        }

        .vp-grid-intersection-node {
          position: absolute;
          top: 72px; 
          left: 80px; 
          width: 4px;
          height: 4px;
          background: #fff;
          transform: translate(-50%, -50%);
          z-index: 65; 
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .vp-grid-line-vertical {
            left: 14px;
          }
          .vp-grid-intersection-node {
            left: 14px;
          }
          .vp-bottom-content {
            left: 14px;
            right: 14px;
          }
          .vp-bottom-gradient {
            left: 14px;
            right: 14px;
          }
          .vp-controls-text-row {
            padding-left: 0px;
          }
          .vp-title-row {
            padding-left: 0px;
          }
        }

        /* ── Header ── */
        .vp-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          height: 64px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%);
          transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(0);
          opacity: 1;
        }
        .vp-header.hidden {
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
        }

        .vp-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px; 
          height: 100%;
          flex-shrink: 0;
        }
        .vp-nav-left {
          display: flex;
          align-items: center;
          gap: 32px;
          padding-left: 24px;
        }
        .vp-nav-right {
          display: flex;
          align-items: center;
          gap: 32px;
          padding-right: 40px;
          margin-left: auto;
        }
        .vp-nav-link {
          font-size: 13px;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 300;
          text-decoration: none;
          transition: color 0.2s;
        }
        .vp-nav-link:hover, .vp-nav-link--active {
          color: #fff;
        }

        /* ── Video ── */
        .vp-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── Bottom Overlay Gradient ── */
        .vp-bottom-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 45vh;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
          z-index: 20;
          pointer-events: none;
          transition: opacity 0.65s ease;
        }
        .vp-bottom-gradient.hidden { opacity: 0; }

        /* ── Bottom Content Block ── */
        .vp-bottom-content {
          position: absolute;
          bottom: 40px;
          left: 80px; 
          right: 40px;
          z-index: 30;
          display: flex;
          flex-direction: column;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .vp-bottom-content {
            left: 14px;
            right: 14px;
          }
        }

        /* Controls Top Text Row */
        .vp-controls-text-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-left: 20px; 
          margin-bottom: 2px;
          transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s ease;
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        .vp-bottom-content.hidden-controls .vp-controls-text-row {
          transform: translateY(80px);
          opacity: 0;
          pointer-events: none;
        }

        .vp-ctrl-left, .vp-ctrl-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .vp-text-btn {
          background: none;
          border: none;
          padding: 0;
          color: #fff;
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .vp-text-btn:hover { opacity: 0.8; }

        /* ── Dynamic Timer (Moves with the head) ── */
        .vp-dynamic-timer {
          position: absolute;
          bottom: 24px;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.05em;
          font-variant-numeric: tabular-nums;
          pointer-events: none;
          white-space: nowrap;
        }

        /* Progress Track Container */
        .vp-progress-wrapper {
          position: relative;
          width: 100%;
          height: 20px; /* hit area */
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-bottom: 20px;
          transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(0);
          pointer-events: auto;
        }
        .vp-bottom-content.hidden-controls .vp-progress-wrapper {
          transform: translateY(142px);
        }

        .vp-progress-track {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
          position: relative;
        }
        
        .vp-progress-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #fff;
          pointer-events: none;
        }

        /* Moving SVG Head */
        .vp-svg-head {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 10;
        }

        /* Tiny Grid Intersection Dots */
        .vp-progress-dot {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          background: #fff;
        }
        .vp-progress-dot--start { left: -2px; }
        .vp-progress-dot--end { right: 10vw; }

        /* Title & Tags Row */
        .vp-title-row {
          padding-left: 20px; 
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s ease;
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        .vp-bottom-content.hidden-controls .vp-title-row {
          transform: translateY(120px);
          opacity: 0;
          pointer-events: none;
        }

        .vp-project-title {
          font-size: clamp(3rem, 5.5vw, 5rem);
          font-weight: 300;
          color: #fff;
          margin: 2px 0 8px 0;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .vp-tags {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .vp-tag {
          font-size: 11px;
          letter-spacing: 0.08em;
          padding: 6px 14px;
          font-weight: 400;
        }
        .vp-tag--outline {
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #fff;
          background: transparent;
        }
        .vp-tag--solid {
          background: #fff;
          color: #000;
          border: 1px solid #fff;
        }
         @media (max-width: 768px) {

  /* ── Page: vertical stack, pure black ── */
  .vp-page {
    flex-direction: column;
    overflow-y: auto;
    background: #000;
    height: auto;
    min-height: 100vh;
  }

  /* ── Grid line ── */
  .vp-grid-line-vertical {
    display: none;
  }
  .vp-grid-intersection-node {
    display: none;
  }

  /* ── Header: slim fixed bar ── */
  .vp-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 44px;
    background: #000 !important;
    background: rgba(0,0,0,1) !important;
    z-index: 100;
    display: flex;
    align-items: center;
    transform: none !important;
    opacity: 1 !important;
  }
  .vp-header.hidden {
    transform: none !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }

  /* ── "Back / Next Project" row ── */
  .vp-mobile-nav {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    height: 36px;
    background: #000;
    margin-top: 44px; /* below fixed header */
  }
  .vp-mobile-nav-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.02em;
    padding: 0;
    cursor: pointer;
  }

  /* ── Black spacer above video ── */
  .vp-mobile-spacer {
    display: block !important;
    height: 60px;
    background: #000;
  }

  /* ── Video: contained 16:9 block ── */
  .vp-video {
    position: relative !important;
    inset: unset !important;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
    flex-shrink: 0;
  }

  /* ── Kill full-bleed overlays ── */
  .vp-bottom-gradient {
    display: none !important;
  }

  /* ── Bottom content: static flow, black bg ── */
  .vp-bottom-content {
    position: static !important;
    bottom: unset !important;
    left: unset !important;
    right: unset !important;
    background: #000;
    padding: 0 14px;
    pointer-events: auto;
  }

  /* Kill all slide animations on mobile */
  .vp-bottom-content.hidden-controls .vp-controls-text-row,
  .vp-bottom-content.hidden-controls .vp-progress-wrapper,
  .vp-bottom-content.hidden-controls .vp-title-row {
    transform: none !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
  .vp-controls-text-row {
    transform: none !important;
    opacity: 1 !important;
  }
  .vp-progress-wrapper {
    transform: none !important;
  }
  .vp-title-row {
    transform: none !important;
    opacity: 1 !important;
  }

  /* ── Controls text row: PLAY | time | SOUND OFF ── */
  .vp-controls-text-row {
    padding-left: 0;
    padding-top: 12px;
    margin-bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .vp-ctrl-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .vp-ctrl-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ── Dynamic timer: inline next to PLAY, not floating ── */
  .vp-dynamic-timer {
    position: static !important;
    transform: none !important;
    bottom: unset !important;
    left: unset !important;
    display: inline;
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    font-weight: 300;
    letter-spacing: 0.03em;
  }

  /* ── Progress bar: thin line, full width ── */
  .vp-progress-wrapper {
    height: 14px;
    margin-top: 4px;
    margin-bottom: 0;
  }
  .vp-progress-track {
    height: 1px;
    background: rgba(255,255,255,0.25);
  }
  .vp-progress-dot--end {
    right: 0 !important;
  }
  .vp-progress-fill {
    /* on mobile, fill to actual ratio of full width */
  }

  /* ── Title ── */
  .vp-title-row {
    padding-left: 0;
    padding-top: 6px;
    gap: 6px !important;
  }
  .vp-project-title {
    font-size: 2.6rem !important;
    font-weight: 300;
    letter-spacing: -0.01em;
    margin: 0 0 4px 0 !important;
    line-height: 1.05;
  }

  /* ── Tags: both outlined on mobile ── */
  .vp-tag--solid {
    background: transparent !important;
    color: #fff !important;
    border: 1px solid rgba(255,255,255,0.45) !important;
  }
  .vp-tags {
    gap: 8px;
  }
  .vp-tag {
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 0;
  }

  /* ── SVG head: hide on mobile for cleanliness ── */
  .vp-svg-head {
    display: none;
  }
}
      `}</style>

      <div
        className="vp-page"
        onMouseMove={showControls}
        onMouseLeave={hideControls}
        onClick={togglePlay}
      >
        {/* ── Persistent Grid Line ── */}
        <div className="vp-grid-line-vertical" />
        <div className="vp-grid-intersection-node " />

        {/* ── Video ── */}
        <video
          ref={videoRef}
          src={project.videoSrc}
          className="vp-video"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setPlaying(false)}
        />

        {/* ── Header ── */}
        <Header />

        {/* ── Bottom Dark Gradient ── */}
        <div className={`vp-bottom-gradient ${!controlsVisible ? "hidden" : ""}`} />

        {/* ── Bottom UI Content ── */}
        <div
          className={`vp-bottom-content ${!controlsVisible ? "hidden-controls" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Controls Text Row */}
          <div className="vp-controls-text-row">
            <div className="vp-ctrl-left">
              <EncryptText
                as="button"
                className="vp-text-btn"
                onClick={togglePlay}
                scrambleOnUpdate={true}
                text={playing ? "PAUSE" : "PLAY"}
              />
            </div>
            <div className="vp-ctrl-right">
              <span className="inline-flex items-center gap-1.5">
                <EncryptText
                  as="span"
                  className="opacity-60 text-[12px] font-light tracking-[0.08em] uppercase cursor-pointer"
                  onClick={toggleMute}
                  text="SOUND"
                />
                <EncryptText
                  as="button"
                  className="vp-text-btn"
                  onClick={toggleMute}
                  scrambleOnUpdate={true}
                  text={muted ? "ON" : "OFF"}
                />
              </span>
              <EncryptText
                as="button"
                className="vp-text-btn"
                onClick={toggleFullscreen}
                scrambleOnUpdate={true}
                text={fullscreen ? "EXIT" : "FULLSCREEN"}
              />
            </div>
          </div>

          {/* Intersecting Progress Bar */}
          <div
            ref={progressRef}
            className="vp-progress-wrapper"
            onClick={handleProgressClick}
          >
            {/* Dynamic tracking timer  */}
            <span
              className="vp-dynamic-timer"
              style={{
                left: `max(125px, ${activeWidthStr})`,
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="vp-progress-track">
              <div className="vp-progress-dot vp-progress-dot--start" />

              {/* HTML Fill Line */}
              <div
                className="vp-progress-fill"
                style={{ width: activeWidthStr }}
              />

              {/* Independent Moving SVG Indicator Head */}
              <div
                className="vp-svg-head"
                style={{ left: activeWidthStr }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <rect x="2" y="2" width="8" height="8" fill="#fff" stroke="#000" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="vp-progress-dot vp-progress-dot--end" />
            </div>
          </div>

          {/* Project Details */}
          <div className="vp-title-row flex flex-col gap-[4px] items-start pointer-events-auto">
            <span
              ref={clientRef}
              className="text-[14px] tracking-normal normal-case text-white/85 font-light inline-block min-h-[1em]"
            />
            <h1 ref={titleRef} className="vp-project-title">
              {project.title.split("").map((ch, i) => (
                <span key={i} className="svc-char inline-block whitespace-pre">{ch}</span>
              ))}
            </h1>
            <span
              ref={categoryRef}
              className="inline-block bg-white text-black border-none py-[4px] px-[10px] text-[11px] tracking-normal normal-case font-medium min-h-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
}