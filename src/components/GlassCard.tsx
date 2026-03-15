import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}

const GlassCard = ({ children, className, highlight = false }: GlassCardProps) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
    className={cn(
      highlight ? "glass-card-highlight" : "glass-card",
      "p-6 md:p-8 transition-all duration-300",
      "hover:shadow-[0_8px_40px_hsl(265_100%_50%/0.12)] hover:border-primary/25",
      highlight && "hover:shadow-[0_8px_40px_hsl(265_100%_50%/0.22)] hover:border-primary/50",
      className
    )}
  >
    {children}
  </motion.div>
);

export default GlassCard;
