# Megamind Productions - Frontend Architecture & Development Guide

## 🎯 Project Overview
This is a highly interactive, cinematic, and pixel-perfect web project for "Megamind Productions". The goal is to achieve an Awwwards-tier user experience with advanced scroll interactions, custom cursors, and precise typography.

## 🛠 Tech Stack & Core Libraries
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (configured for a global dark theme)
- **Animation Core:** GSAP (`gsap`) + `@gsap/react` plugin
- **Scroll Animations:** GSAP `ScrollTrigger`
- **Physics/Complex Interactions:** Framer Motion (`framer-motion`)
- **Smooth Scrolling:** Lenis (`@studio-freight/react-lenis`)

## 🚨 Global Coding Standards & Rules
1. **Pixel Perfection:** Adhere strictly to the provided design references. Spacing, typography hierarchy, and CSS Grid alignments must be exact.
2. **GSAP React Integration:** You MUST use the `useGSAP()` hook from `@gsap/react` for all GSAP animations to ensure proper React lifecycle cleanup and prevent memory leaks.
3. **Client Components:** Any component utilizing GSAP, Framer Motion, or Lenis must include the `"use client"` directive at the very top.
4. **Cinematic Grid:** Implement a global, faint CSS grid overlay (`pointer-events-none`) that spans the entire background to provide a structural, cinematic backdrop.
5. **Smooth Scroll Wrapping:** The main layout must be wrapped in a Lenis provider to ensure all `ScrollTrigger` animations feel fluid and premium.

---

## 🧩 Component Blueprint & Animation Specs

### 1. Header Navigation (`/components/layout/Header.tsx`)
- **Layout:** Standard fixed/sticky transparent header.
- **Interaction:** "Encrypt/Shuffle" hover effect.
- **Tech:** Create a reusable utility hook or GSAP function (`useScrambleText`). On hover, text characters must rapidly shuffle through random symbols (e.g., `!@#$%^&*`) before resolving to the original word.

### 2. Hero Section (`/components/sections/Hero.tsx`)
- **Layout:** `min-h-screen`. Title "Work Life Vertex", subtext, and bottom constraints perfectly aligned. 
- **Media:** Silent, looping background video (use a placeholder initially).
- **Interaction (Custom Cursor):** 
  - Hide default OS cursor.
  - Use Framer Motion (`useSpring`, `useMotionValue`) to create a custom cursor resembling a camera focus target.
  - It must trail the user's mouse position with a smooth, highly dampened spring effect.

### 3. Who We Are (`/components/sections/WhoWeAre.tsx`)
- **Layout:** Typography, grid-aligned text boxes, and image placement (woman and child).
- **Interaction 1 (Micro-Parallax):** Use GSAP `ScrollTrigger` to apply a subtle `y-axis` translation to images and text blocks as they move through the viewport.
- **Interaction 2 (Scroll Loader):** 
  - Place a geometric SVG loader icon in the bottom right corner.
  - Use GSAP `ScrollTrigger` with `scrub: true`. 
  - Tie the `stroke-dashoffset` or fill-scale of this SVG directly to the scroll progress of *this specific section*.

### 4. What We Do (`/components/sections/WhatWeDo.tsx`)
- **Layout:** Stacked list of services ("Brand Films", "Ad Films", etc.) separated by thin borders.
- **Interaction:** Apply the Encrypt/Shuffle hover effect to the list items. The hover hit area must span the entire width of the grid row.

### 5. Why Choose Us (`/components/sections/WhyChooseUs.tsx`)
- **Layout:** Image alongside three metric blocks (`250+`, `50+`, `10M+`).
- **Interaction 1 (Intro):** Staggered fade-up (`y: 50`, `opacity: 0` -> `y: 0`, `opacity: 1`) using GSAP when scrolling into view.
- **Interaction 2 (Number Counters):** 
  - Use `useGSAP` and `ScrollTrigger`.
  - When the section enters the viewport, tween the numbers from `0` to their target values using `roundProps` for clean integers.
- **Interaction 3 (Parallax):** Slight GSAP `y-axis` parallax on the section image.

### 6. Wall of Fame (`/components/sections/WallOfFame.tsx`)
- **Layout:** "OUR WALL OF F(R)AME".
- **Execution:** Absolute pixel-perfect CSS Grid. Focus entirely on matching the padding, image sizing, and exact alignment of the client logos to the design reference. No heavy animations required here, just perfect layout execution.

### 7. Footer (`/components/layout/Footer.tsx`)
- **Layout:** "Ready to bring your story to life?" call to action, plus a large cinematic visual with the "Megamind Productions" watermark.
- **Interaction (Curtain Reveal):** 
  - Do not use standard scrolling for the footer.
  - Use CSS `position: sticky` (or fixed with `z-index` management) combined with GSAP so the main content `main` wrapper appears to slide *up and over* the footer, revealing it from underneath at the end of the page scroll.

---

## 📂 Required Folder Structure
```text
/src
  /app
    layout.tsx
    page.tsx
  /components
    /layout
      Header.tsx
      Footer.tsx
      SmoothScroll.tsx (Lenis Wrapper)
    /sections
      Hero.tsx
      WhoWeAre.tsx
      WhatWeDo.tsx
      WhyChooseUs.tsx
      WallOfFame.tsx
    /ui
      CustomCursor.tsx
  /hooks
    useScrambleText.ts
  /utils
    cn.ts (Tailwind merge utility)