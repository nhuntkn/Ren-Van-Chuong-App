"use client";
import { useState } from "react";
import { useContainerDetailLogic } from "./container-detail.logic";
import LocationPill from "@/components/locationPill";

export default function ContainerDetailPage() {
    const { container, items, allItems, loading, error, addItemToContainer, removeItemFromContainer } =
        useContainerDetailLogic();

    const [selectedItemId, setSelectedItemId] = useState("");
    const [addQty, setAddQty] = useState("");

    if (loading) return <main className="px-4 py-5 text-ink-soft text-sm">Đang tải...</main>;
    if (!container) return <main className="px-4 py-5 text-sm">Không tìm thấy bao hàng.</main>;

    async function handleAdd() {
        if (!selectedItemId || !addQty) return;
        await addItemToContainer(selectedItemId, Number(addQty));
        setSelectedItemId("");
        setAddQty("");
    }

    return (
        <main className="px-4 py-5">
            <p className="font-mono text-lg font-semibold">{container.id}</p>
            <div className="mb-4 mt-1">
                <LocationPill zone={container.zone} shelf={container.shelf} bin={container.bin} isMixed={container.type === "mixed"} />
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex flex-col gap-2 mb-4">
                {items.length === 0 && <p className="text-ink-soft text-sm">Bao này đang trống.</p>}
                {items.map((it) => (
                    <div key={it.itemId} className="flex justify-between items-center border border-border rounded-lg px-3 py-2">
                        <span className="text-sm">{it.name} — {it.qty} {it.unit}</span>
                        <button
                            onClick={() => removeItemFromContainer(it.itemId, it.qty)}
                            className="text-[11px] text-red-500 font-medium px-2 py-1"
                        >
                            Lấy ra
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-surface-alt rounded-lg p-3">
                <p className="text-[12px] text-ink-soft mb-2">Thêm mẫu vào bao này</p>
                <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2">
                    <option value="">Chọn mẫu hàng...</option>
                    {allItems.map((it) => <option key={it.id} value={it.id}>{it.name}</option>)}
                </select>
                <div className="flex gap-2">
                    <input type="number" placeholder="Số lượng" value={addQty} onChange={(e) => setAddQty(e.target.value)} className="flex-1 px-3 py-2 border border-border rounded-md text-sm" />
                    <button onClick={handleAdd} className="bg-accent text-white px-4 rounded-md text-sm font-semibold">Thêm</button>
                </div>
            </div>

            <button onClick={() => window.print()} className="w-full mt-3 border border-border rounded-md py-2.5 text-sm">
                In lại mã QR
            </button>
        </main>
    );
}