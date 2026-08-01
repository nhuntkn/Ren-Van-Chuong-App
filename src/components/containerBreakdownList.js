import LocationPill from "./locationPill";

export default function ContainerBreakdownList({ containers }) {
    if (!containers || containers.length === 0) {
        return (
            <p className="text-[13px] text-ink-soft text-center py-6">
                Mẫu này chưa được gán vào bao nào.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {containers.map((c) => (
                <div
                    key={c.containerId}
                    className={`flex justify-between items-center border rounded-lg px-3 py-2.5 ${
                        c.type === "mixed" ? "border-accent bg-accent-soft/40" : "border-border"
                    }`}
                >
                    <div>
                        <p className="text-[13px] font-semibold font-mono">{c.containerId}</p>
                        <div className="mt-1">
                            <LocationPill zone={c.zone} shelf={c.shelf} bin={c.bin} isMixed={c.type === "mixed"} />
                        </div>
                    </div>
                    <span className="text-[14px] font-semibold">{c.qty}</span>
                </div>
            ))}
        </div>
    );
}