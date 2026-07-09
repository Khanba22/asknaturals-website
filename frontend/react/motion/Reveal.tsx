import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  fadeDown,
  fadeIn,
  fadeUp,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  viewport,
} from './variants';

const variantMap = {
  fadeUp,
  fadeIn,
  fadeDown,
  scaleIn,
  slideInLeft,
  slideInRight,
} as const;

type RevealVariant = keyof typeof variantMap;

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  as?: 'div' | 'section' | 'header' | 'article' | 'blockquote' | 'p' | 'h1' | 'h2' | 'h3';
} & Omit<HTMLMotionProps<'div'>, 'children'>;

export function Reveal({
  children,
  className,
  variant = 'fadeUp',
  delay = 0,
  as = 'div',
  ...rest
}: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variantMap[variant]}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
};

export function HeroReveal({
  children,
  className,
  variant = 'fadeUp',
  delay = 0,
}: HeroRevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variantMap[variant]}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function Stagger({ children, className, stagger = 0.14 }: StaggerProps) {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.08,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = 'fadeUp',
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  return (
    <motion.div className={className} variants={variantMap[variant]}>
      {children}
    </motion.div>
  );
}

export { staggerContainer, viewport };
