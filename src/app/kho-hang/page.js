"use client";
import { useWarehouseLogic } from "./warehouse.logic";
import ItemCard from "@/components/itemCard";

export default function WarehousePage() {
    const { items, search, setSearch, loading } = useWarehouseLogic();

    return (
        <main className="px-4 py-5">
            <div className="flex justify-between items-baseline mb-3">
                <h1 className="text-lg font-semibold">Kho hàng</h1>
                <span className="text-[12px] text-ink-soft">{loading ? "Đang tải..." : `${items.length} mẫu`}</span>
            </div>

            <input
                type="text"
                placeholder="Tìm theo tên, loại, màu, vị trí..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm mb-3"
            />

            {!loading && items.length === 0 && (
                <p className="text-ink-soft text-sm text-center py-8">Không tìm thấy mẫu nào.</p>
            )}

            <div className="flex flex-col gap-2">
                {items.map((item) => <ItemCard key={item.id} item={item} />)}
            </div>
        </main>
    );
}