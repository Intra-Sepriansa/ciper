import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

type CountUpProps = {
    to: number;
    from?: number;
    direction?: 'up' | 'down';
    duration?: number;
    delay?: number;
    className?: string;
    separator?: string;
    decimals?: number;
    onStart?: () => void;
    onEnd?: () => void;
};

export default function CountUp({
    to,
    from = 0,
    direction = 'up',
    duration = 2,
    delay = 0,
    className,
    separator = '',
    decimals = 0,
    onStart,
    onEnd,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === 'down' ? to : from);

    const damping = 20 + 40 * (1 / duration);
    const stiffness = 100 * (1 / duration);

    const springValue = useSpring(motionValue, { damping, stiffness });
    const isInView = useInView(ref, { once: true, margin: '0px' });

    useEffect(() => {
        if (!ref.current || !isInView) {
            return;
        }

        onStart?.();
        const timer = window.setTimeout(() => {
            motionValue.set(direction === 'down' ? from : to);
        }, delay * 1000);

        const durationTimer = window.setTimeout(() => {
            onEnd?.();
        }, (delay + duration) * 1000);

        return () => {
            window.clearTimeout(timer);
            window.clearTimeout(durationTimer);
        };
    }, [isInView, motionValue, from, to, direction, delay, duration, onStart, onEnd]);

    useEffect(() => {
        const unsubscribe = springValue.on('change', (latest) => {
            if (!ref.current) {
                return;
            }

            const formatted = Intl.NumberFormat('id-ID', {
                useGrouping: !!separator,
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(latest);

            ref.current.textContent = separator
                ? formatted.replace(/\./g, separator)
                : formatted;
        });

        return () => unsubscribe();
    }, [springValue, separator, decimals]);

    return <motion.span ref={ref} className={className} />;
}
