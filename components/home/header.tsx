"use client";

import { useState } from "react";
import EncryptText from "@/components/home/encrypt-text";
import Image from "next/image";
import Link from "next/link";

// Split navigation to match the left/right alignment in the reference image
const leftNavigation = [
  { href: "/featured-projects", label: "Featured Projects" },
  { href: "/production-note", label: "Production Notes" },
];

const rightNavigation = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative w-full z-[60] bg-black border-b border-white/10">
      {/* ─── DESKTOP VIEW ─── */}
      <div className="hidden md:flex h-[72px] w-full items-center bg-black">
        {/* Logo container with border-r */}
        <div className="h-full flex items-center justify-center px-[12px] border-r border-white/10 shrink-0">
          <Link href="/" aria-label="Home" className="flex items-center justify-center">
            <Image src="/svgs/logo.svg" alt="Logo" width={32} height={32} className="brightness-0 invert w-15 h-8" />
          </Link>
        </div>

        {/* Left Navigation */}
        <nav className="flex items-center gap-10 pl-[40px] text-[13px] tracking-wide font-normal text-white/80">
          {leftNavigation.map((item) => (
            <EncryptText
              key={item.href}
              as={Link}
              className="transition-colors hover:text-white focus-visible:text-white"
              data-nav-item=""
              href={item.href}
              text={item.label}
            />
          ))}
        </nav>

        {/* Right Navigation */}
        <nav className="ml-auto flex items-center gap-10 pr-[40px] text-[13px] tracking-wide font-normal text-white/80">
          {rightNavigation.map((item) => (
            <EncryptText
              key={item.href}
              as={Link}
              className="transition-colors hover:text-white focus-visible:text-white"
              data-nav-item=""
              href={item.href}
              text={item.label}
            />
          ))}
        </nav>
      </div>

      {/* ─── MOBILE VIEW ─── */}
      <div className="md:hidden flex h-20 w-full items-center bg-black">
        {/* Left: Logo container with border-r and fixed width matching the MOBILE_INSET (52px) */}
        <div className="relative h-full flex items-center justify-center w-[51px] border-r border-white/10 shrink-0">
          <Link href="/" aria-label="Home" className="flex items-center justify-center">
            <Image src="/svgs/logo.svg" alt="Logo" width={24} height={24} className="brightness-0 invert opacity-90" />
          </Link>
          
          {/* Intersection dot at bottom-right corner of the logo container */}
          <div className="absolute bottom-0 -right-0 translate-x-1/2 translate-y-1/2 w-[5px] h-[5px] bg-white z-20" />
        </div>

        {/* Right: Menu Trigger */}
        <div className="flex-1 flex items-center justify-end pr-[40px] h-full">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-[14px] font-light tracking-[0.05em] text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            Menu
          </button>
        </div>
      </div>

      {/* ─── MOBILE MENU OVERLAY ─── */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          {/* Card Modal */}
          <div className="absolute top-[120px] bottom-[100px] left-[40px] right-[40px] bg-black border border-white/10 p-8 flex flex-col z-[80] shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-[12px] text-white/40 hover:text-white font-light tracking-[0.2em] uppercase text-left mb-10 cursor-pointer w-fit"
            >
              Close
            </button>

            {/* Menu Title */}
            <h3 className="text-4xl font-light text-white mb-10 tracking-tight">Menu</h3>

            {/* Nav Stack */}
            <nav className="flex flex-col gap-6 text-[18px] font-light text-white/75">
              <Link
                href="/featured-projects"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-white transition-colors"
              >
                Featured Projects
              </Link>
              <Link
                href="/#services"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-white transition-colors"
              >
                Our Services
              </Link>
              <Link
                href="/production-note"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-white transition-colors"
              >
                Production Notes
              </Link>
              <Link
                href="/#about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}