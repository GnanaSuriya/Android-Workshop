import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn(
      "bg-glass-bg border border-glass-border rounded-[22px] p-4",
      className
    )}>
      {children}
    </div>
  );
}
