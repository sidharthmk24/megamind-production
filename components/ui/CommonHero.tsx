"use client";

interface CommonHeroProps {
    title: string;
}
export default function CommonHero({title}:CommonHeroProps) {
  return (
    <section className="relative min-h-[15vh] md:min-h-[65vh] w-full bg-black flex flex-col justify-center items-start pl-[50px] pr-[20px] md:px-[40px]  md:pt-0">
      <h1 className="text-[40px] md:text-[clamp(4.5rem,12vw,11rem)] font-normal md:font-bold text-start leading-[1.1] md:leading-[0.82] text-white tracking-normal md:tracking-tighter uppercase">
       {title}
      </h1>

    
    </section>
  );
}