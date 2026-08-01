import Link from "next/link";
import { getStockStatus } from "@/lib/constants";

const STATUS_STYLE = {
    ok: { bg: "bg-sage-soft", text: "text-sage" },
    low: { bg: "bg-[#FBEFD9]", text: "text-[#9A6A1E]" },
    out: { bg: "bg-[#F5DEDE]", text: "text-[#B23A3A]" },
};

export default function ItemCard({ item }) {
    const status = getStockStatus(item.totalStock);
    const style = STATUS_STYLE[status];
    const statusLabel =
        status === "out" ? "Hết hàng" : `${item.totalStock} ${item.unit}`;

    return (
        <Link
            href={`/kho-hang/${item.id}`}
            className="flex gap-3 bg-white border border-border rounded-xl p-2.5"
        >
            <div className="w-14 h-14 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
                {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate">{item.name}</p>
                <p className="text-[11px] text-ink-soft mt-0.5">
                    {item.category}
                    {item.colorName && ` · ${item.colorName} (${item.colorCode})`}
                </p>
                <span className={`inline-block text-[11px] mt-1.5 px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                    {statusLabel}
                </span>
            </div>
        </Link>
    );
}