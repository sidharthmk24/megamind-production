"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function FocusCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 340, damping: 30, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 340, damping: 30, mass: 0.35 });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const syncState = () => {
      setEnabled(media.matches);
    };

    syncState();
    media.addEventListener("change", syncState);

    return () => {
      media.removeEventListener("change", syncState);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      delete document.documentElement.dataset.cursor;
      return;
    }

    document.documentElement.dataset.cursor = "focus";

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const handleLeave = () => {
      setVisible(false);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ opacity: visible ? 1 : 0, x: springX, y: springY }}
    >
      <div className="relative h-18 w-18 rounded-full border border-white/80">
        <div className="absolute inset-3 rounded-full border border-white/35" />
        <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-white/75" />
        <div className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-white/75" />
        <div className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-white/75" />
        <div className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-white/75" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>
    </motion.div>
  );
}
