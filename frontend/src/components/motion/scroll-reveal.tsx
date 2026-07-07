"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUpVariants, fadeInVariants } from "@/lib/motion-tokens";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fadeUp" | "fadeIn";
}

export function ScrollReveal({
  children,
  className,
  variant = "fadeUp",
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion();
  const variants = variant === "fadeUp" ? fadeUpVariants : fadeInVariants;

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
