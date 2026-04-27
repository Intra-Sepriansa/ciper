import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type AnimatedListProps = {
    children: ReactNode[];
    className?: string;
    stagger?: number;
    delay?: number;
};

export default function AnimatedList({ children, className = '', stagger = 0.05, delay = 0 }: AnimatedListProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="show"
            variants={{
                hidden: {},
                show: {
                    transition: { staggerChildren: stagger, delayChildren: delay },
                },
            }}
        >
            {children.map((child, idx) => (
                <motion.div
                    key={idx}
                    variants={{
                        hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
                        show: {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0)',
                            transition: { type: 'spring', damping: 18, stiffness: 120 },
                        },
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}
