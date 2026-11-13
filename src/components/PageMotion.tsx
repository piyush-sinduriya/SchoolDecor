import type { ReactNode } from 'react';
import { motion } from 'motion/react';

export const PAGE_EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PageTransitionShell({
  routeKey,
  children,
}: {
  routeKey: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: PAGE_EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function MotionReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.48, delay, ease: PAGE_EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.44, ease: PAGE_EASE_OUT },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
