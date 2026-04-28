import type { CSSProperties, ReactNode } from 'react';

type GlareHoverProps = {
    children: ReactNode;
    glareColor?: string;
    glareOpacity?: number;
    glareAngle?: number;
    transitionDuration?: number;
    className?: string;
    style?: CSSProperties;
};

export default function GlareHover({
    children,
    glareColor = '#ffffff',
    glareOpacity = 0.35,
    glareAngle = -30,
    transitionDuration = 650,
    className = '',
    style,
}: GlareHoverProps) {
    const hex = glareColor.replace('#', '');
    const rgba =
        hex.length === 6
            ? `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, ${glareOpacity})`
            : glareColor;

    const vars = {
        '--glare-bg': `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgba} 70%, hsla(0,0%,0%,0) 100%)`,
        '--glare-duration': `${transitionDuration}ms`,
    } as CSSProperties;

    return (
        <div className={`reactbits-glare ${className}`} style={{ ...vars, ...style }}>
            <div className="reactbits-glare-layer" aria-hidden />
            {children}
        </div>
    );
}
