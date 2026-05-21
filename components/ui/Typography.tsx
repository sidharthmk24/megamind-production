import React from 'react';

interface TypographyProps {
  heading?: string;
  subheading?: string;
  description?: string;
  superScript?: string;
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({ 
  heading, 
  subheading, 
  description, 
  superScript, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* 1. Superscript at the very top */}
      {superScript && (
        <span className="text-[10px] mb-4 tracking-[0.18em] uppercase font-light">
          {superScript}
        </span>
      )}

      {/* 2. Subheading (Collaborate text) */}
      {subheading && (
        <h2 className="text-[clamp(0.95rem,1.8vw,1.35rem)] font-light leading-[1.5] tracking-tight  max-w-[860px]">
          {subheading}
        </h2>
      )}

      {/* Optional Divider if both subheading and heading exist */}
      {subheading && heading && (
        <div className="w-full h-px  my-12" />
      )}

      {/* 3. Heading (Brand Films text) */}
      {heading && (
        <h1 className="text-[clamp(1.6rem,3.2vw,2.6rem)] font-light leading-[1.1] tracking-[-0.02em] ">
          {heading}
        </h1>
      )}

      {/* Description */}
      {description && (
        <p className="text-[14px] leading-relaxed text-[#8a8a8a] font-light mt-6 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default Typography;