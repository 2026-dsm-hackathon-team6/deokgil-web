import type { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export default function MobileFrame({ children, className = "" }: MobileFrameProps) {
  return (
    <div className="glass-stage min-h-screen flex items-start justify-center">
      <div
        className={`glass-app w-full max-w-97.5 min-h-screen relative overflow-hidden ${className}`}
      >
        <span className="glass-orb glass-orb-top" aria-hidden="true" />
        <span className="glass-orb glass-orb-bottom" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
