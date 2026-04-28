import type { MouseEvent, ReactNode } from 'react';
import { useRef } from 'react';

type SpotlightCardProps = {
    children: ReactNode;
    className?: string;
    spotlightColor?: string;
};

export default function SpotlightCard({
    children,
    className = '',
    spotlightColor = 'rgba(16, 185, 129, 0.25)',
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);

    function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
        if (!divRef.current) {
            return;
        }

        const rect = divRef.current.getBoundingClientRect();
        divRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        divRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        divRef.current.style.setProperty('--spotlight-color', spotlightColor);
    }

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            className={`reactbits-spotlight ${className}`}
        >
            {children}
        </div>
    );
}
