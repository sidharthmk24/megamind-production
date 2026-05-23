"use client";

import Link from "next/link";
import { useState } from "react";
import { NOTES, Note } from "@/lib/notes-data";

/* ─── Grid Dot Component ─────────────────────────────────── */
function GridDot({ position }: { position: "tl" | "tr" | "bl" | "br" | "cl" | "cr" }) {
  const base = "absolute w-1.5 h-1.5 bg-white z-20 pointer-events-none";
  let pos = "";
  
  switch (position) {
    case "tl": pos = "top-[-3px] left-[-3px]"; break;
    case "tr": pos = "top-[-3px] right-[-3px]"; break;
    case "bl": pos = "bottom-[-3px] left-[-3px]"; break;
    case "br": pos = "bottom-[-3px] right-[-3px]"; break;
    case "cl": pos = "top-1/2 left-[-3px] -translate-y-1/2"; break;
    case "cr": pos = "top-1/2 right-[-3px] -translate-y-1/2"; break;
  }
  
  return <div className={`${base} ${pos}`} />;
}

/* ─── Note Card Component ─────────────────────────────────── */
interface NoteCardProps {
  note: Note;
  orientation: "text-first" | "image-first";
}

function NoteCard({ note, orientation }: NoteCardProps) {
  const isGrey = note.type === "grey" || note.color === "grey";

  // If layout is gradient, render the full-image style
  if (note.layout === "gradient") {
    return (
      <Link href={`/production-note/${note.slug}`} className="note-card-wrapper group block relative border-b border-white/10 last:border-b-0 h-[90vh]">
        
        {/* Full Image background */}
        <div className={`absolute inset-0 transition-all duration-700 overflow-hidden ${isGrey ? "grayscale brightness-75" : "brightness-90"}`}>
          <img
            src={note.image}
            alt={note.title}
            className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
        </div>

        {/* Bottom Gradient and Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8">
           <span className="text-[10px] uppercase tracking-[0.15em] text-white/50 mb-4 font-sans">{note.tag}</span>
           <h3 className="text-[clamp(18px,1.8vw,26px)] font-medium leading-[1.2] text-white tracking-tight font-display">
             {note.title}
           </h3>
        </div>
      </Link>
    );
  }

  // Default Checkerboard Layout
  const TextContent = (
    <div className="note-card-text flex flex-col justify-start p-8 h-[220px] group-hover:bg-white/[0.02] transition-colors relative">
      <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-6 font-sans">{note.tag}</span>
      <h3 className="text-[clamp(16px,1.5vw,22px)] font-medium leading-[1.25] text-white/90 group-hover:text-white transition-colors tracking-tight font-display">
        {note.title}
      </h3>
    </div>
  );

  const ImageContent = (
    <div className={`note-card-image relative h-[58vh] overflow-hidden transition-all duration-700 ${isGrey ? "grayscale brightness-75" : "brightness-90"}`}>
      <img
        src={note.image}
        alt={note.title}
        className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
      />
    </div>
  );

  return (
    <Link href={`/production-note/${note.slug}`} className="note-card-wrapper group block relative border-b border-white/10 last:border-b-0">
      <GridDot position="tl" />
      <GridDot position="tr" />
      <GridDot position="bl" />
      <GridDot position="br" />
      
      <div className="absolute top-[220px] left-[-3px] w-1.5 h-1.5 bg-white -translate-y-1/2 z-20" />
      <div className="absolute top-[220px] right-[-3px] w-1.5 h-1.5 bg-white -translate-y-1/2 z-20" />

      {orientation === "text-first" ? (
        <>
          {TextContent}
          <div className="w-full h-px bg-white/10" />
          {ImageContent}
        </>
      ) : (
        <>
          {ImageContent}
          <div className="w-full h-px bg-white/10" />
          {TextContent}
        </>
      )}
    </Link>
  );
}

/* ─── Main Component ───────────────────────────────────────── */
export default function Notes() {
  const [visible, setVisible] = useState(6);
  const shown = NOTES.slice(0, visible);

  const col1 = shown.filter((_, i) => i % 3 === 0);
  const col2 = shown.filter((_, i) => i % 3 === 1);
  const col3 = shown.filter((_, i) => i % 3 === 2);

  return (
    <section className="relative bg-black w-full pb-32">
      <div className="max-w-full mx-auto pl-[50px] pr-4 md:px-[40px]">
        
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col border-l border-r border-white/10 relative gap-[40px]">
          {shown.map((note) => (
            <Link 
              key={note.id} 
              href={`/production-note/${note.slug}`}
              className="flex flex-col relative"
            >
              {/* Extended Top Line */}
              <div className="absolute top-0 left-[-50px] right-0 h-px bg-white/10 z-10" />
              {/* Extended Bottom Line */}
              <div className="absolute bottom-0 left-[-50px] right-0 h-px bg-white/10 z-10" />

              {/* Top Left dot */}
              <div className="absolute top-[-3px] left-[-3px] w-1.5 h-1.5 bg-white z-20" />
              {/* Top Right dot */}
              <div className="absolute top-[-3px] right-[-3px] w-1.5 h-1.5 bg-white z-20" />
              {/* Bottom Left dot */}
              <div className="absolute bottom-[-3px] left-[-3px] w-1.5 h-1.5 bg-white z-20" />
              {/* Bottom Right dot */}
              <div className="absolute bottom-[-3px] right-[-3px] w-1.5 h-1.5 bg-white z-20" />
              
              <div className="px-5 pt-8 pb-6">
                <span className="text-[12px] text-white/50 mb-3 block font-sans tracking-wide">
                  {note.tag}
                </span>
                <h3 className="text-[26px] font-normal leading-[1.25] text-white mb-0 font-display tracking-tight pr-4">
                  {note.title}
                </h3>
              </div>
              <div className="w-full px-5">
                <div className={`relative w-full aspect-[4/3] overflow-hidden ${note.type === "grey" || note.color === "grey" ? "grayscale brightness-75" : "brightness-90"}`}>
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid relative grid-cols-3 border-l border-white/10 border-r border-white/10 border-t border-white/10">
          
          <div className="absolute top-[-3px] left-[33.333%] w-1.5 h-1.5 bg-white -translate-x-1/2 z-20" />
          <div className="absolute top-[-3px] left-[66.666%] w-1.5 h-1.5 bg-white -translate-x-1/2 z-20" />

          <div className="flex flex-col relative border-r border-white/10 last:border-r-0">
             {col1.map((note) => (
               <NoteCard key={note.id} note={note} orientation="text-first" />
             ))}
          </div>

          <div className="flex flex-col relative border-r border-white/10 last:border-r-0">
             {col2.map((note) => (
               <NoteCard key={note.id} note={note} orientation="image-first" />
             ))}
          </div>

          <div className="flex flex-col relative last:border-r-0">
             {col3.map((note) => (
               <NoteCard key={note.id} note={note} orientation="text-first" />
             ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-2 relative border-l border-r md:border-t md:border-b border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-300">
          {/* Extended Top and Bottom Lines for Mobile, normal for Desktop via borders */}
          <div className="md:hidden absolute top-0 left-[-50px] right-0 h-px bg-white/10 z-10" />
          <div className="md:hidden absolute bottom-0 left-[-50px] right-0 h-px bg-white/10 z-10" />

          <div className="hidden md:block absolute top-[-3px] left-[66.666%] w-1.5 h-1.5 bg-white -translate-x-1/2 z-20" />
          {/* <div className="absolute top-[-3px] left-[-3px] w-1.5 h-1.5 bg-white z-20" /> */}
          <div className="absolute top-[-3px] right-[-3px] w-1.5 h-1.5 bg-white z-20" />
          
          <div className="absolute bottom-[-3px] left-[-3px] w-1.5 h-1.5 bg-white z-20" />
          <div className="absolute bottom-[-3px] right-[-3px] w-1.5 h-1.5 bg-white z-20" />

          {visible < NOTES.length ? (
            <button 
              onClick={() => setVisible(NOTES.length)}
              className="text-white hover:text-white text-[13px]  transition-colors py-2 md:py-4 px-12"
            >
              Load More
            </button>
          ) : (
            <span className="text-white hover:text-white text-[13px]  transition-colors py-2 md:py-4 px-12">End of Notes</span>
          )}
        </div>
      </div>
    </section>
  );
}