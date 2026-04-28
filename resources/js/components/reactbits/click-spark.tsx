import { useCallback, useEffect, useRef } from 'react';

type Spark = {
    id: number;
    x: number;
    y: number;
    angle: number;
    startTime: number;
};

type ClickSparkProps = {
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
};

export default function ClickSpark({
    sparkColor = '#059669',
    sparkSize = 8,
    sparkRadius = 18,
    sparkCount = 9,
    duration = 500,
}: ClickSparkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparksRef = useRef<Spark[]>([]);
    const rafRef = useRef<number | null>(null);

    const resize = useCallback(() => {
        if (!canvasRef.current) {
            return;
        }

        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
    }, []);

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, [resize]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        function tick(now: number) {
            if (!canvas || !ctx) {
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            sparksRef.current = sparksRef.current.filter((spark) => {
                const progress = (now - spark.startTime) / duration;

                if (progress >= 1) {
                    return false;
                }

                const distance = progress * sparkRadius * 8;
                const length = sparkSize * (1 - progress);
                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + length) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + length) * Math.sin(spark.angle);

                ctx.strokeStyle = sparkColor;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 1 - progress;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                return true;
            });

            if (sparksRef.current.length > 0) {
                rafRef.current = window.requestAnimationFrame(tick);
            } else {
                rafRef.current = null;
            }
        }

        function onClick(e: MouseEvent) {
            const now = performance.now();

            for (let i = 0; i < sparkCount; i++) {
                sparksRef.current.push({
                    id: now + i,
                    x: e.clientX,
                    y: e.clientY,
                    angle: (Math.PI * 2 * i) / sparkCount,
                    startTime: now,
                });
            }

            if (rafRef.current === null) {
                rafRef.current = window.requestAnimationFrame(tick);
            }
        }

        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('click', onClick);

            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
            }
        };
    }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[60]"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
}
