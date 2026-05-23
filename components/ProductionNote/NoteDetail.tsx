"use client";

import Link from "next/link";
import { NOTES,Note } from "@/lib/notes-data";
import Footer from "@/components/home/footer";
import FooterVideo from "@/components/home/FooterVideo";
import Header from "../home/header";
import { useState } from "react";


interface Props {
  note: Note;
  related: Note[];
}

/* ─── Grid Dot Component ─────────────────────────────────── */
function GridDot({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const base = "absolute w-1.5 h-1.5 bg-white z-20 pointer-events-none";
  let pos = "";
  
  switch (position) {
    case "tl": pos = "top-[-3px] left-[-3px]"; break;
    case "tr": pos = "top-[-3px] right-[-3px]"; break;
    case "bl": pos = "bottom-[-3px] left-[-3px]"; break;
    case "br": pos = "bottom-[-3px] right-[-3px]"; break;
  }
  
  return <div className={`${base} ${pos}`} />;
}

export default function NoteDetail({ note, related }: Props) {
  const [visible, setVisible] = useState(3);

  return (
    <div className="nd-page bg-black text-white min-h-screen font-sans">
      <Header />

      <main className="relative pt-0">
        {/* Article Section */}
     <div className="bg-black w-full text-white font-sans selection:bg-white/20">
  <div className="max-w-[1440px] mx-auto px-4 md:px-[40px] lg:px-[60px] py-12">
    
    {/* Grid Container */}
    <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-12 md:gap-20 lg:gap-28 md:items-stretch items-start">
      
      {/* Left Col: Image */}
      <div className="relative flex flex-col justify-start md:h-full">
        <div className="md:sticky md:top-24 w-full">
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-zinc-900 rounded-sm">
            <img 
              src={note.image} 
              alt={note.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Col: Content */}
      <div className="flex flex-col justify-start relative pt-0">
        
        {/* Tag */}
        <span className="text-[12px] text-[#666] mb-3">
          {note.tag || "Blog"}
        </span>
        
        {/* Main Title */}
        <h1 className="text-[32px] md:text-[36px] lg:text-[42px] font-medium leading-[1.15] tracking-tight text-[#f5f5f5] mb-10 max-w-[700px]">
          {note.title}
        </h1>

        {/* Content Mapping */}
        <div className="max-w-[750px]">
          {note.body.map((section, i) => {
            
            {/* Paragraphs */}
            if (section.type === "paragraph") {
              return (
                <p key={i} className="text-[#a1a1aa] leading-[1.8] mb-6 text-[14.5px] lg:text-[15px] font-normal tracking-wide">
                  {section.content}
                </p>
              );
            }
            
            {/* Headings */}
            if (section.type === "heading") {
              return (
                <h2 key={i} className="text-[14.5px] lg:text-[15px] font-bold text-white mt-10 mb-2 tracking-wide">
                  {section.content}
                </h2>
              );
            }
            
            {/* Lists */}
            if (section.type === "list" && section.items) {
              return (
                <ul key={i} className="list-disc pl-5 mb-8 space-y-1.5">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-[#a1a1aa] leading-[1.8] text-[14.5px] lg:text-[15px] pl-1 tracking-wide">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            
            return null;
          })}
        </div>

      </div>
    </div>
  </div>
</div>

        {/* More Section */}
        <section className="mt-0 pb-32">
          <div className="px-4 md:px-[40px] mb-10">
            <h2 className="text-[clamp(24px,2.5vw,32px)] font-medium text-white tracking-tight text-center md:text-left">
              More from <br className="md:hidden block" /> Megamind Productions
            </h2>
          </div>
          
          <div className=" px-4 md:px-[40px]">
            
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid relative border-l border-t border-white/10 grid-cols-3 bg-black">
              {/* Top edge corner dots */}
              <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "0%", top: "0%" }} />
              <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "33.333%", top: "0%" }} />
              <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "66.666%", top: "0%" }} />
              <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "0%" }} />

              {/* Bottom edge corner dots */}
              <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none" style={{ left: "0%", top: "100%" }} />
              <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none" style={{ left: "33.333%", top: "100%" }} />
              <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none" style={{ left: "66.666%", top: "100%" }} />
              <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none" style={{ left: "100%", top: "100%" }} />

              {related.map((r, idx) => {
                const isUpsideDown = idx === 0; // Card 1 is upside down, Cards 2 & 3 are normal
                const isGrey = r.type === "grey" || r.color === "grey";
                
                const ImageBlock = (
                  <div className={`aspect-[16/10] overflow-hidden transition-all duration-500 ${isGrey ? "grayscale brightness-75" : "brightness-90"}`}>
                    <img src={r.image} alt={r.title} className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700" />
                  </div>
                );

                const TextBlock = isUpsideDown ? (
                  <div className="pt-6 pb-12 px-6 border-b border-white/10 bg-black relative flex flex-col justify-start min-h-[150px]">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3 block">{r.tag || "SHOT"}</span>
                    <h3 className="text-[15px] md:text-[16px] font-light leading-snug text-white/90 group-hover:text-white transition-colors">{r.title}</h3>
                  </div>
                ) : (
                  <div className="pt-6 pb-12 px-6 bg-black relative flex flex-col justify-start min-h-[150px]">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3 block">{r.tag || "SHOT"}</span>
                    <h3 className="text-[15px] md:text-[16px] font-light leading-snug text-white/90 group-hover:text-white transition-colors">{r.title}</h3>
                  </div>
                );

                return (
                  <Link href={`/production-note/${r.slug}`} key={r.id} className="group relative border-r border-b border-white/10 block bg-black">
                    {isUpsideDown ? (
                      <>
                        {TextBlock}
                        {ImageBlock}
                      </>
                    ) : (
                      <>
                        {ImageBlock}
                        {TextBlock}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Grid Layout */}
            <div className="md:hidden flex flex-col relative bg-black gap-[16px]">
              {related.map((r, idx) => {
                const isUpsideDown = idx === 0; // Card 1 is upside down (text first), Cards 2 & 3 are normal (image first)
                const isGrey = r.type === "grey" || r.color === "grey";

                const ImageBlock = (
                  <div className={`aspect-[16/10] overflow-hidden transition-all duration-500 ${isGrey ? "grayscale brightness-75" : "brightness-90"}`}>
                    <img src={r.image} alt={r.title} className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700" />
                  </div>
                );

                const TextBlock = (
                  <div className="pt-6 pb-12 px-6 bg-black relative flex flex-col justify-start min-h-[150px]">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3 block">{r.tag || "SHOT"}</span>
                    <h3 className="text-[15px] font-light leading-snug text-white/90 group-hover:text-white transition-colors">{r.title}</h3>
                  </div>
                );

                return (
                  <Link 
                    href={`/production-note/${r.slug}`} 
                    key={r.id} 
                    className="group relative block bg-black border-l border-r border-white/10 animate-fadeIn"
                  >
                    {/* Extended Top Line */}
                    <div className="absolute top-0 left-[-16px] right-[-16px] h-px bg-white/10 z-10" />
                    {/* Top Left dot */}
                    <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: "0%", top: "0%" }} />
                    {/* Top Right dot */}
                    <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: "100%", top: "0%" }} />

                    {/* Extended Bottom Line */}
                    <div className="absolute bottom-0 left-[-16px] right-[-16px] h-px bg-white/10 z-10" />
                    {/* Bottom Left dot */}
                    <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: "0%", top: "100%" }} />
                    {/* Bottom Right dot */}
                    <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: "100%", top: "100%" }} />

                    {isUpsideDown ? (
                      <>
                        {TextBlock}
                        {ImageBlock}
                      </>
                    ) : (
                      <>
                        {ImageBlock}
                        {TextBlock}
                      </>
                    )}
                  </Link>
                );
              })}

              {/* Mobile Load More Button */}
              <div className="flex flex-col items-center justify-center py-2 relative hover:bg-white/10 cursor-pointer transition-all duration-300 bg-black border-l border-r border-white/10">
                {/* Top separator line extending to the left edge */}
                <div className="absolute top-0 left-[-16px] right-[-16px] h-px bg-white/10 z-10" />
                {/* Top Left dot */}
                <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: "0%", top: "0%" }} />
                {/* Top Right dot */}
                <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: "100%", top: "0%" }} />

                {/* Bottom separator line extending to the left edge */}
                <div className="absolute bottom-0 left-[-16px] right-[-16px] h-px bg-white/10 z-10" />
                {/* Bottom Left dot */}
                <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: "0%", top: "100%" }} />
                {/* Bottom Right dot */}
                <div className="absolute w-[5px] h-[5px] bg-white -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: "100%", top: "100%" }} />

                {visible < NOTES.length ? (
                  <button 
                    onClick={() => setVisible(NOTES.length)}
                    className="text-white hover:text-white text-[13px] transition-colors py-4 px-12"
                  >
                    Load More
                  </button>
                ) : (
                  <span className="text-white hover:text-white text-[13px] transition-colors py-4 px-12">End of Notes</span>
                )}
              </div>
            </div>

            {/* Desktop Load More Button */}
            <div className="hidden md:flex flex-col items-center justify-center py-2 relative border-l border-r border-t border-white/10 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-300 bg-black">
              <div className="absolute bottom-[-3px] left-0 w-1.5 h-1.5 bg-white -translate-x-1/2 z-20" />
              <div className="absolute bottom-[-3px] right-0 w-1.5 h-1.5 bg-white translate-x-1/2 z-20" />
    
              {visible < NOTES.length ? (
                <button 
                  onClick={() => setVisible(NOTES.length)}
                  className="text-white hover:text-white text-[13px] transition-colors py-4 px-12"
                >
                  Load More
                </button>
              ) : (
                <span className="text-white hover:text-white text-[13px] transition-colors py-4 px-12">End of Notes</span>
              )}
            </div>
          </div>
        </section>
      </main>

      <FooterVideo />
    </div>
  );
}
