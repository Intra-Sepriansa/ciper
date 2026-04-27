import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { MouseEvent, ReactNode } from 'react';

type TiltedCardProps = {
    children: ReactNode;
    className?: string;
    rotateAmplitude?: number;
    scaleOnHover?: number;
    overlay?: ReactNode;
};

const SPRING = {
    damping: 30,
    stiffness: 100,
    mass: 2,
};

export default function TiltedCard({
    children,
    className = '',
    rotateAmplitude = 10,
    scaleOnHover = 1.04,
    overlay,
}: TiltedCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useMotionValue(0), SPRING);
    const rotateY = useSpring(useMotionValue(0), SPRING);
    const scale = useSpring(1, SPRING);

    function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
        x.set(offsetX);
        y.set(offsetY);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
    }

    function handleMouseLeave() {
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
    }

    return (
        <div
            className={`relative [perspective:900px] ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="h-full w-full [transform-style:preserve-3d]"
                style={{ rotateX, rotateY, scale }}
            >
                {children}
                {overlay ? (
                    <div className="pointer-events-none absolute inset-0 [transform:translateZ(40px)]">
                        {overlay}
                    </div>
                ) : null}
            </motion.div>
        </div>
    );
}
