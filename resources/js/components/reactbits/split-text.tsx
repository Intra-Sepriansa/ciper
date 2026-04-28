import { motion } from 'framer-motion';
import { useMemo } from 'react';

type SplitTextProps = {
    text: string;
    className?: string;
    delay?: number;
    staggerChildren?: number;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
};

export default function SplitText({
    text,
    className,
    delay = 0,
    staggerChildren = 0.04,
    as = 'h1',
}: SplitTextProps) {
    const words = useMemo(() => text.split(' '), [text]);

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: delay,
                staggerChildren,
            },
        },
    };

    const child = {
        hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: 'spring' as const,
                damping: 14,
                stiffness: 100,
            },
        },
    };

    const Tag = motion[as];

    return (
        <Tag
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
            aria-label={text}
        >
            {words.map((word, wIndex) => (
                <span key={`${word}-${wIndex}`} className="inline-block whitespace-nowrap">
                    {word.split('').map((char, cIndex) => (
                        <motion.span
                            key={`${char}-${cIndex}`}
                            variants={child}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                    {wIndex !== words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
                </span>
            ))}
        </Tag>
    );
}
