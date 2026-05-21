import React from 'react';

export default function LocationAndFooter() {
  return (
    <div className="w-full relative bg-black">
      {/* Map Section Container */}
      <div className="px-[80px] max-[768px]:px-[40px] py-[50px] max-[768px]:py-[30px]">
        <div className="w-full h-[180px] md:h-[240px] bg-zinc-900 overflow-hidden relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d972.1957375648274!2d74.86750245094298!3d12.92166727611852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba3597e4d08052b%3A0x1fe3a4ecfefebfd0!2sMegamind%20Studios!5e0!3m2!1sen!2sin!4v1778845929365!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Studio Location"
          ></iframe>
        </div>
      </div>

      {/* Horizontal divider below map with 3 dots */}
      <div className="relative w-full">
        <div className="absolute left-0 right-0 h-[1px] bg-white/10" />
        
        {/* Three dots on the divider line */}
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[40px] max-[768px]:left-[20px]" />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-1/2" />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none right-[40px] max-[768px]:right-[20px]" />
      </div>

      {/* Footer Contact Details: Two equal columns with vertical divider */}
      <div className="grid grid-cols-1 md:grid-cols-2 relative w-full px-[40px] max-[768px]:px-[20px]">
        {/* Vertical divider down the center */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 z-10 pointer-events-none" />

        <div className="py-[80px] text-center flex flex-col justify-center items-center max-[768px]:py-[40px]">
          <p className="text-zinc-500 text-[13px] uppercase tracking-[0.2em] font-light mb-3">Get in Touch</p>
          <a 
            href="mailto:hello@megamindproductions.in" 
            className="text-white hover:text-white/70 transition-colors text-[clamp(16px,1.5vw,22px)] font-light tracking-tight"
          >
            hello@megamindproductions.in
          </a>
        </div>
        
        <div className="py-[80px] text-center flex flex-col justify-center items-center border-t md:border-t-0 border-white/10 max-[768px]:py-[40px]">
          <p className="text-zinc-500 text-[13px] uppercase tracking-[0.2em] font-light mb-3">Looking to join us?</p>
          <a 
            href="mailto:Careers@megamindproductions.in" 
            className="text-white hover:text-white/70 transition-colors text-[clamp(16px,1.5vw,22px)] font-light tracking-tight"
          >
            Careers@megamindproductions.in
          </a>
        </div>
      </div>

      {/* Bottom Horizontal divider separating details columns from FooterVideo with 3 dots */}
      <div className="relative w-full">
        <div className="absolute left-0 right-0 h-[1px] bg-white/10" />
        
        {/* Three dots on the divider line */}
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-[40px] max-[768px]:left-[20px]" />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none left-1/2" />
        <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none right-[40px] max-[768px]:right-[20px]" />
      </div>
    </div>
  );
}