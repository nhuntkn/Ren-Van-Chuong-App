export default function LocationPill({ zone, shelf, isMixed }) {
    const parts = [];
    if (zone) parts.push(zone);
    if (shelf) parts.push(`Kệ ${shelf}`);

    if (parts.length === 0) {
        return <span className="inline-block text-[11px] font-mono bg-surface-alt text-ink-faint px-2.5 py-1 rounded-full">Chưa có vị trí</span>;
    }

    return (
        <span
            className={`inline-block text-[11px] font-mono px-2.5 py-1 rounded-full ${
                isMixed ? "bg-accent-soft text-accent-dark" : "bg-sage-soft text-sage"
            }`}
        >
            {isMixed && "Hàng lẻ · "}
            {parts.join(" · ")}
        </span>
    );
}