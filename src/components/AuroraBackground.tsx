import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function AuroraBackground({ children, className }: AuroraBackgroundProps) {
  return (
    <div className="min-h-screen w-full bg-zinc-950 flex justify-center sm:items-center sm:p-8">
      <div className="relative h-[100dvh] sm:h-[844px] w-full sm:max-w-[390px] bg-bg-dark text-text-primary flex flex-col sm:rounded-[3rem] shadow-2xl sm:ring-[12px] ring-zinc-900 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-[140%] h-[140%] -top-[40%] -right-[50%] rounded-full bg-android-green/20 blur-[100px] opacity-70" style={{ transform: 'translate3d(0,0,0)' }} />
          <div className="absolute w-[130%] h-[130%] -bottom-[40%] -left-[50%] rounded-full bg-android-teal/20 blur-[90px] opacity-60" style={{ transform: 'translate3d(0,0,0)' }} />
          <div className="absolute w-[110%] h-[110%] top-[10%] -right-[30%] rounded-full bg-android-blue/20 blur-[90px] opacity-50" style={{ transform: 'translate3d(0,0,0)' }} />
        </div>
        <div className={cn("relative z-10 flex-1 flex flex-col overflow-x-hidden overflow-y-auto no-scrollbar", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
