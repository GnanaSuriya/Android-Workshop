import React from 'react';
import { cn } from '../lib/utils';

export const GlassCard = ({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-[24px] bg-white/5 border border-white/10 p-6 backdrop-blur-md",
        onClick && "cursor-pointer hover:bg-white/10 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
};
