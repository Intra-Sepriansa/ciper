import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { MouseEvent, ReactNode } from 'react';

type MagnetProps = {
    children: ReactNode;
    padding?: number;
    disabled?: boolean;
    strength?: number;
    className?: string;
};

const SPRING = { damping: 15, stiffness: 200, mass: 0.4 };

export default function Magnet({
    children,
    padding = 60,
    disabled = false,
    strength = 0.35,
    className = '',
}: MagnetProps) {
    const x = useSpring(useMotionValue(0), SPRING);
    const y = useSpring(useMotionValue(0), SPRING);

    function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
        if (disabled) {
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        const expanded = {
            x: -padding,
            y: -padding,
            w: rect.width + padding * 2,
            h: rect.height + padding * 2,
        };

        if (
            relX >= expanded.x &&
            relX <= expanded.x + expanded.w &&
            relY >= expanded.y &&
            relY <= expanded.y + expanded.h
        ) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            x.set((relX - centerX) * strength);
            y.set((relY - centerY) * strength);
        } else {
            x.set(0);
            y.set(0);
        }
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <div className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <motion.div style={{ x, y }}>{children}</motion.div>
        </div>
    );
}
