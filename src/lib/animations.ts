import { Variants } from "framer-motion";

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Slide up animation
export const slideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Scale animation for cards
export const scaleUp: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

// Hero text animation
export const heroText: Variants = {
  hidden: { 
    opacity: 0, 
    y: 100 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1, 
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

// Button hover animation
export const buttonHover: Variants = {
  rest: { 
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Card hover animation
export const cardHover: Variants = {
  rest: { 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: { 
    y: -8,
    transition: { duration: 0.3 }
  }
};

// Before/After slider animation
export const sliderAnimation: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
};

// Testimonial card animation
export const testimonialCard: Variants = {
  hidden: { 
    opacity: 0, 
    rotateY: -15,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    rotateY: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

// FAQ accordion animation
export const accordionAnimation: Variants = {
  hidden: { 
    height: 0, 
    opacity: 0 
  },
  visible: { 
    height: "auto", 
    opacity: 1,
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    }
  }
};

// Page transition animation
export const pageTransition: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4, 
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { 
      duration: 0.3, 
      ease: "easeIn" 
    }
  }
};

// Floating animation for decorative elements
export const floating: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse animation for CTAs
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Advanced text reveal animation (from extracted App.tsx)
export const revealText: Variants = {
  hidden: { 
    opacity: 0, 
    y: 75 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.21, 0.47, 0.32, 0.98] 
    }
  }
};

// Advanced stagger container (from extracted App.tsx)
export const advancedStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Advanced stagger item (from extracted App.tsx)
export const advancedStaggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  },
};

// Parallax scroll animation
export const parallaxScroll: Variants = {
  hidden: { 
    opacity: 0, 
    y: 100 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.2, 
      ease: [0.21, 0.47, 0.32, 0.98] 
    }
  }
};

// Rotating animation for icons
export const rotating: Variants = {
  animate: {
    rotate: 360,
    transition: { 
      duration: 20, 
      repeat: Infinity, 
      ease: "linear" 
    }
  }
};

// Scale and fade animation
export const scaleAndFade: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.21, 0.47, 0.32, 0.98] 
    }
  }
};

// Slide in from right animation
export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.21, 0.47, 0.32, 0.98] 
    }
  }
};

// Slide in from left animation
export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.21, 0.47, 0.32, 0.98] 
    }
  }
};

// Bounce animation
export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Glow animation for primary elements
export const glow: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(220, 38, 38, 0.4)",
      "0 0 0 10px rgba(220, 38, 38, 0)",
      "0 0 0 0 rgba(220, 38, 38, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}; 