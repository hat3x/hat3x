import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}

const GlassCard = ({ children, className, highlight = false }: GlassCardProps) => (
  <div
    className={cn(
      highlight ? "glass-card-highlight" : "glass-card",
      "p-6 md:p-8 transition-all duration-300 hover:-translate-y-1",
      className
    )}
  >
    {children}
  </div>
);

export default GlassCard;
