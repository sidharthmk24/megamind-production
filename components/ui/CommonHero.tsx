"use client";

interface CommonHeroProps {
    title: string;
}
export default function CommonHero({title}:CommonHeroProps) {
  return (
    <section className="relative min-h-[65vh] w-full bg-black flex flex-col justify-center items-start px-[40px] ">
      <h1 className="text-[clamp(4.5rem,12vw,11rem)] font-bold text-start leading-[0.82] text-white tracking-tighter">
       {title}
      </h1>

    
    </section>
  );
}