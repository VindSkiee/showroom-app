// ============================================
// Motion Tokens
// Semua animasi harus pakai tokens ini.
// Jangan hardcode stiffness/damping/duration!
// ============================================

export const motionTokens = {
  // Duration
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },

  // Spring configs
  spring: {
    snappy: { stiffness: 400, damping: 30 },
    gentle: { stiffness: 200, damping: 25 },
    bouncy: { stiffness: 300, damping: 20 },
    stiff: { stiffness: 500, damping: 40 },
  },

  // Easing
  ease: {
    in: [0.4, 0, 1, 1] as const,
    out: [0, 0, 0.2, 1] as const,
    inOut: [0.4, 0, 0.2, 1] as const,
  },
} as const;

// ============================================
// Common Animation Variants
// ============================================

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.out,
    },
  },
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.out,
    },
  },
};

export const slideUpVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: {
      type: "spring" as const,
      ...motionTokens.spring.gentle,
    },
  },
  exit: {
    y: "100%",
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.in,
    },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleVariants = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
};
