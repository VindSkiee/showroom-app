"use client";

import { ScrollReveal } from "./scroll-reveal";

interface ScrollRevealWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fadeUp" | "fadeIn";
}

export function ScrollRevealWrapper({
  children,
  className,
  variant = "fadeUp",
}: ScrollRevealWrapperProps) {
  return (
    <ScrollReveal variant={variant} className={className}>
      {children}
    </ScrollReveal>
  );
}
