"use client";

import React from "react";
import Header from "@/components/home/header";
import ContactForm from "@/components/contact/ContactForm";
import LocationAndFooter from "@/components/contact/LocationAndFooter";
import FooterVideo from "@/components/home/FooterVideo";

export default function ContactPage() {
  return (
    <div className="relative bg-black text-white w-full min-h-screen overflow-x-hidden flex flex-col font-sans">
      {/* Header Navigation */}
      <Header />

      {/* Title Section (Completely Clean) */}
      <div className="relative pt-[120px] pb-[40px] px-[40px] max-[768px]:px-[20px] max-[768px]:pt-[80px] max-[768px]:pb-[20px]">
        <h1 className="text-[clamp(4.5rem,11.5vw,10.5rem)] font-semibold tracking-tight uppercase text-white pl-[40px] max-[768px]:pl-0 leading-[0.85]">
          CONTACT
        </h1>
      </div>

      {/* Horizontal divider under CONTACT title */}
      <div className="relative w-full">
        <div className="absolute left-0 right-0 h-[1px] bg-white/10" />
        {/* Two dots on the divider line */}
        {/* <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[40px] max-[768px]:left-[20px]" /> */}
        {/* <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none right-[40px] max-[768px]:right-[20px]" /> */}
      </div>

      {/* Contact Form Wrapper (Completely Clean - no lines, no dots) */}
      <div className="relative px-[40px] max-[768px]:px-[20px] pt-[80px] pb-[80px] max-[768px]:pt-[40px] max-[768px]:pb-[40px]">
        <ContactForm />
      </div>

      {/* Map & Info Footer section (Grid starts here!) */}
      <div className="relative w-full flex flex-col">
        {/* Horizontal divider above the map (marks the start of the grid) */}
        <div className="relative w-full">
          <div className="absolute left-0 right-0 h-[1px] bg-white/10" />
          {/* Two dots at the start of the grid */}
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[40px] max-[768px]:left-[20px]" />
          <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none right-[35.5px] max-[768px]:right-[20px]" />
        </div>

        {/* Continuous vertical grid lines restricted to the map and details columns */}
        <div className="absolute left-[40px] -top-[0px] -bottom-[30px] w-[1px] bg-white/10 z-10 pointer-events-none max-[768px]:left-[20px]" />
        <div className="absolute right-[40px] top-[0px] -bottom-[30px] w-[1px] bg-white/10 z-10 pointer-events-none max-[768px]:right-[20px]" />

        {/* Location Map and Contact Columns */}
        <LocationAndFooter />
      </div>

      {/* Footer Video Section */}
      <FooterVideo />
    </div>
  );
}


