import type { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export default function MobileFrame({ children, className = "" }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-[#E8EFE8] flex items-start justify-center">
      <div
        className={`w-full max-w-97.5 min-h-screen bg-white relative overflow-hidden shadow-2xl ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
