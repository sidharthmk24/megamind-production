import React from 'react';

export default function ContactForm() {
  return (
    <div className="w-full bg-black px-0 md:px-[40px] max-[768px]:px-0">
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Top Row: Name & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-light text-zinc-300 mb-[10px] tracking-wide">Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Your Name" 
              className="bg-transparent border border-white/15 p-4 focus:outline-none focus:border-white/40 transition-colors duration-250 text-white placeholder:text-zinc-700 text-sm h-[56px] w-full rounded-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="brand" className="text-sm font-light text-zinc-300 mb-[10px] tracking-wide">Brand / Company</label>
            <input 
              type="text" 
              id="brand" 
              placeholder="Company / Brand Name" 
              className="bg-transparent border border-white/15 p-4 focus:outline-none focus:border-white/40 transition-colors duration-250 text-white placeholder:text-zinc-700 text-sm h-[56px] w-full rounded-none"
            />
          </div>
        </div>

        {/* Middle Row: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-light text-zinc-300 mb-[10px] tracking-wide">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Your Name" 
              className="bg-transparent border border-white/15 p-4 focus:outline-none focus:border-white/40 transition-colors duration-250 text-white placeholder:text-zinc-700 text-sm h-[56px] w-full rounded-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm font-light text-zinc-300 mb-[10px] tracking-wide">Phone</label>
            <input 
              type="tel" 
              id="phone" 
              placeholder="Company / Brand Name" 
              className="bg-transparent border border-white/15 p-4 focus:outline-none focus:border-white/40 transition-colors duration-250 text-white placeholder:text-zinc-700 text-sm h-[56px] w-full rounded-none"
            />
          </div>
        </div>

        {/* Message Area */}
        <div className="flex flex-col">
          <label htmlFor="message" className="text-sm font-light text-zinc-300 mb-[10px] tracking-wide">Message</label>
          <textarea 
            id="message" 
            placeholder="Provide all useful information" 
            className="bg-transparent border border-white/15 p-4 focus:outline-none focus:border-white/40 transition-colors duration-250 text-white placeholder:text-zinc-700 text-sm h-[180px] w-full resize-none rounded-none"
          ></textarea>
        </div>

        {/* Form Footer: Privacy & Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-4 gap-8">
          <div className="max-w-[680px]">
            <p className="text-[11px] text-zinc-500 leading-relaxed font-light mb-4">
              We're committed to your privacy. Megamind Studios uses the information you provide to contact you about our relevant content and services. For more information, check out our <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
            </p>
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                id="privacy" 
                defaultChecked
                className="w-[14px] h-[14px] accent-red-600 bg-transparent border-white/20 rounded-none cursor-pointer"
              />
              <label htmlFor="privacy" className="text-[12px] text-zinc-400 select-none cursor-pointer font-light">
                I accept the <a href="#" className="underline hover:text-white transition-colors">Privacy policy</a>
              </label>
            </div>
          </div>
          <button 
            type="submit" 
            className="bg-white text-black px-10 h-[56px] font-semibold text-[15px] hover:bg-zinc-200 transition-colors duration-300 shrink-0 select-none outline-none border-none cursor-pointer flex items-center justify-center"
          >
            Let's Talk
          </button>
        </div>
      </form>
    </div>
  );
}