import React from 'react';
import { cn } from '../lib/utils';

export const AuroraBackground = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-[100svh] items-center justify-center bg-zinc-950 text-slate-50 transition-bg",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -inset-[10px] opacity-50"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(61, 220, 132, 0.15) 0%, transparent 70%)`,
          }}
        />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
