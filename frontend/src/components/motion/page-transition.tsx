"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion-tokens";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className,
}: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: motionTokens.duration.normal,
        ease: motionTokens.ease.out,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
