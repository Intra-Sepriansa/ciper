type ShinyTextProps = {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
};

export default function ShinyText({ text, disabled = false, speed = 5, className = '' }: ShinyTextProps) {
    const animationDuration = `${speed}s`;

    return (
        <span
            className={`reactbits-shiny ${disabled ? 'reactbits-shiny-disabled' : ''} ${className}`}
            style={{ animationDuration }}
        >
            {text}
        </span>
    );
}
