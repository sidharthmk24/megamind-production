"use client";

import { useState } from "react";
import EncryptText from "@/components/home/encrypt-text";
import Image from "next/image";
import Link from "next/link";
import DigitalMobileMenu from "@/components/home/digital-mobile-menu";

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
      <DigitalMobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}