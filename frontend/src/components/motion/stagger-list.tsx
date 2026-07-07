"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  staggerContainerVariants,
  fadeUpVariants,
} from "@/lib/motion-tokens";

interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerList({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerListProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        ...staggerContainerVariants,
        visible: {
          ...staggerContainerVariants.visible,
          transition: { staggerChildren: staggerDelay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={fadeUpVariants} className={className}>
      {children}
    </motion.div>
  );
}
