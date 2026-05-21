"use client";

export default function NotesHero() {
  return (
    <section className="relative min-h-[65vh] w-full bg-black flex flex-col justify-center items-start px-[40px] ">
      <h1 className="text-[clamp(4.5rem,12vw,11rem)] font-bold text-start leading-[0.82] text-white tracking-tighter">
        PRODUCTION <br /> NOTES
      </h1>

      {/* Grid Lines for Hero */}
      {/* <div className="absolute top-0 left-[40px] w-px h-full bg-white/10" />
      <div className="absolute top-0 right-[40px] w-px h-full bg-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" /> */}

      {/* Corner Dots for Hero */}
      {/* <div className="absolute bottom-[-3px] left-[40px] w-1.5 h-1.5 bg-white -translate-x-1/2" /> */}
      {/* <div className="absolute bottom-[-3px] right-[40px] w-1.5 h-1.5 bg-white translate-x-1/2" /> */}
    </section>
  );
}