"use client";

export default function SectionEyebrow({
  index,
  label,
}: Readonly<{
  index: string;
  label: string;
}>) {
  return (
    <div className="col-span-12 flex items-center gap-3 md:col-span-2">
      <span className="text-[0.63rem] uppercase tracking-[0.32em] text-white/35">
        {index}
      </span>
      <span className="h-px flex-1 bg-white/10" />
      <span className="text-[0.63rem] uppercase tracking-[0.32em] text-white/55">
        {label}
      </span>
    </div>
  );
}
