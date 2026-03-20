export const premiumTransition = {
  duration: 0.8,
  ease: [0.21, 0.45, 0.32, 0.9],
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: premiumTransition,
};

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: premiumTransition,
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: premiumTransition,
};

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: premiumTransition,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: premiumTransition,
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const revealTransition = {
  initial: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
  animate: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
  transition: { ...premiumTransition, duration: 1.2 },
};

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.3, ease: "easeOut" },
};
