import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = "w-9 h-9" }: BrandLogoProps) {
  return (
    <div className={`relative ${className} flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md group overflow-hidden transition-all duration-300`}>
      {/* Vibe Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-red-500/5 dark:from-red-600/30 dark:to-transparent opacity-100" />
      
      {/* Decorative pulse element */}
      <div className="absolute w-2 h-2 rounded-full bg-red-500/40 -top-0.5 -right-0.5 animate-ping" />

      {/* Modern Creator Vector Icon */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-5 h-5 text-red-600 dark:text-red-500 relative z-10 transition-transform duration-300 group-hover:scale-110"
      >
        {/* Play triangle with customized modern gap design */}
        <path 
          d="M7 4.5V19.5L19 12L7 4.5Z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
        />
        {/* Sleek inner line to signify professionalism / creator wave */}
        <path 
          d="M11 10.5V13.5" 
          stroke="white" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
}
