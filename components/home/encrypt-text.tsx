"use client";

import { forwardRef, useRef, useEffect, useCallback } from "react";
import type { MouseEventHandler, CSSProperties, ElementType } from "react";
import Link from "next/link";

const SYMBOLS = "!@#$%^&*+-=?<>[]{}~|";
const rndSym = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

type EncryptTextProps = {
  as?: "span" | "div" | "p" | "button" | "a" | typeof Link;
  text: string;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLElement>;
  style?: CSSProperties;
  scrambleOnUpdate?: boolean;
  "data-nav-item"?: string;
  "data-service-row"?: string;
};

const EncryptText = forwardRef<HTMLElement, EncryptTextProps>(function EncryptText(
  { as = "span", className, href, onClick, text, type = "button", style, scrambleOnUpdate, ...dataAttributes },
  forwardedRef,
) {
  const wrapRef = useRef<HTMLElement | null>(null);
  const charSpansRef = useRef<HTMLSpanElement[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number | null>(null);

  // Build one <span> per character inside the wrapper
  const buildChars = useCallback((node: HTMLElement) => {
    node.innerHTML = "";
    charSpansRef.current = text.split("").map((ch) => {
      const s = document.createElement("span");
      s.dataset.orig = ch;
      s.style.display = "inline-block";
      s.style.minWidth = ch === " " ? "0.3em" : "";
      s.textContent = ch === " " ? "\u00a0" : ch;
      node.appendChild(s);
      return s;
    });
  }, [text]);

  // Re-build chars whenever text changes
  useEffect(() => {
    if (wrapRef.current) {
      buildChars(wrapRef.current);
      if (scrambleOnUpdate) {
        handleEnter();
      }
    }
  }, [buildChars, text, scrambleOnUpdate]);

  const kill = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  // Scramble a single span — randomly flash it red
  const scrambleSpan = (s: HTMLSpanElement) => {
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
  };

  const handleEnter = () => {
    const spans = charSpansRef.current;
    kill();

    // Scramble all letters immediately
    spans.forEach((s) => scrambleSpan(s));

    // Build fully shuffled reveal order
    const order = spans
      .map((_, i) => i)
      .filter((i) => spans[i].dataset.orig !== " ")
      .sort(() => Math.random() - 0.5);

    const BASE = 38;
    const JIT = 32;

    order.forEach((idx, pos) => {
      const s = spans[idx];
      let ticks = 0;
      const maxTicks = 3 + Math.floor(Math.random() * 4);
      const tickMs = BASE + Math.random() * JIT;
      const startMs = pos * (BASE + Math.random() * JIT);

      const tick = () => {
        ticks++;
        if (ticks < maxTicks) {
          scrambleSpan(s);
          timersRef.current.push(setTimeout(tick, tickMs));
        } else {
          s.textContent = s.dataset.orig ?? "";
          s.style.color = "";
        }
      };

      timersRef.current.push(setTimeout(tick, startMs));
    });
  };

  const handleLeave = () => {
    const spans = charSpansRef.current;
    kill();

    let ticks = 0;
    const flick = () => {
      ticks++;
      if (ticks < 5) {
        spans.forEach((s) => {
          if (s.dataset.orig !== " " && Math.random() > 0.5) scrambleSpan(s);
        });
        rafRef.current = requestAnimationFrame(flick);
      } else {
        spans.forEach((s) => {
          s.textContent = s.dataset.orig === " " ? "\u00a0" : (s.dataset.orig ?? "");
          s.style.color = "";
        });
      }
    };
    rafRef.current = requestAnimationFrame(flick);
  };

  useEffect(() => {
    return () => kill();
  }, []);

  const setRefs = (node: HTMLElement | null) => {
    wrapRef.current = node;
    if (node) buildChars(node);
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const sharedProps = {
    ...dataAttributes,
    className,
    onClick,
    onFocus: handleEnter,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    ref: setRefs,
    style: {
      display: "inline-flex",
      fontFamily: "inherit",
      cursor: "pointer",
      ...style,
    } as CSSProperties,
  };

  if (as === Link && href) {
    return <Link {...sharedProps} href={href} />;
  }

  if (as === "a") return <a {...sharedProps} href={href} />;
  if (as === "button") return <button {...sharedProps} type={type} />;

  const Tag = as as any;
  return <Tag {...(sharedProps as any)} />;
});

export default EncryptText; 