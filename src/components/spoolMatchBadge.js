export default function SpoolMatchBadge({ percent, size = 52 }) {
    const r = size / 2 - 5;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - percent / 100);

    const color = percent >= 70 ? "var(--color-accent)" : percent >= 45 ? "var(--color-sage)" : "var(--color-ink-soft)";

    const ticks = Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 2 * Math.PI;
        const x1 = cx + (r - 6) * Math.cos(angle);
        const y1 = cy + (r - 6) * Math.sin(angle);
        const x2 = cx + (r - 2) * Math.cos(angle);
        const y2 = cy + (r - 2) * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-border)" strokeWidth="1" />;
    });

    return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
            {ticks}
            <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
            />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill={color}>
                {percent}%
            </text>
        </svg>
    );
}