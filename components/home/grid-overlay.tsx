"use client";

export default function GridOverlay() {

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      {/* Left continuous vertical line */}
      <div
        className="absolute top-[90vh] bottom-0 w-px bg-white/20 left-[50px] md:left-[40px]"
      />

      {/* Right continuous vertical line */}
      <div
        className="hidden md:block absolute top-[90vh] bottom-0 w-px bg-white/20 right-[40px]"
      />
    </div>
  );
}
