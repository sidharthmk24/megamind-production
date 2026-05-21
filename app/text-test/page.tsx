import React from 'react';
import Typography from '@/components/ui/Typography';

export default function TextTestPage() {
  const tailwindSizes = [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 
    'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 
    'text-7xl', 'text-8xl', 'text-9xl'
  ];

  return (
    <main className="min-h-screen bg-white text-[black] p-20 space-y-20 font-sans">
      <section>
        {/* <h1 className="text-4xl font-bold mb-10 border-b pb-4">Typography Component Test</h1> */}
        <div className="space-y-12">
          <div className="bg-[black]/20 p-20">
            {/* <p className="text-xs text-blue-500 mb-6 uppercase tracking-widest">New Cinematic Typography (Black BG)</p> */}
            <Typography 
              superScript="What we do"
              subheading="We collaborate with brands across industries to create visual stories that feel purposeful, cinematic, and human."
              heading="Brand Films"
              description="Built to help brands communicate with clarity, impact, and purpose, Megamind Productions creates films, photography, and digital content."
            />
          </div>

        </div>
      </section>

      <section>
        <h1 className="text-4xl font-bold mb-10 border-b pb-4">Standard Tailwind Scales</h1>
        <div className="space-y-8">
          {tailwindSizes.map((size) => (
            <div key={size} className="flex items-baseline gap-10">
              <span className="w-32 text-xs font-mono text-gray-400">{size}</span>
              <p className={`${size} font-light`}>
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h1 className="text-4xl font-bold mb-10 border-b pb-4">Homepage Scale Reference</h1>
        <div className="space-y-12">
          <div>
            <p className="text-xs text-blue-500 mb-2 uppercase tracking-widest">Hero Heading (clamp(4.5rem,8vw,8rem))</p>
            <h1 className="text-[clamp(4.5rem,8vw,8rem)] leading-[0.95] tracking-tight font-bold">
              Work Life<br />Vertex
            </h1>
          </div>

          <div>
            <p className="text-xs text-blue-500 mb-2 uppercase tracking-widest">About Heading (clamp(2rem,3.5vw,3.5rem))</p>
            <h2 className="text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.1] tracking-tight">
              We're the production house that turns brand visions into compelling visual stories.
            </h2>
          </div>

          <div>
            <p className="text-xs text-blue-500 mb-2 uppercase tracking-widest">Services Item (clamp(1.6rem,3.2vw,2.6rem))</p>
            <h3 className="text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.1] tracking-[-0.02em]">
              Performance Marketing Videos
            </h3>
          </div>
        </div>
      </section>
    </main>
  );
}
