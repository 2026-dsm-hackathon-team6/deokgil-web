import type { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export default function MobileFrame({
  children,
  className = "",
}: MobileFrameProps) {
  return (
    <div className="glass-stage min-h-dvh flex items-start justify-center">
      <div
        className={`glass-app w-full md:max-w-97.5 min-h-dvh relative overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
