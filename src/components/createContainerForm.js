"use client";
import { useState } from "react";
import Link from "next/link";
import { CONTAINER_TYPES } from "@/lib/constants";

const emptyRow = () => ({ itemId: "", qty: "" });

export default function CreateContainerForm({ allItems, presetItem, onCreated }) {
    const [type, setType] = useState("single");
    const [zone, setZone] = useState("");
    const [shelf, setShelf] = useState("");
    const [itemRows, setItemRows] = useState(
        presetItem ? [{ itemId: presetItem.id, qty: "" }] : [emptyRow()]
    );
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [newQr, setNewQr] = useState(null);

    function updateType(nextType) {
        setType(nextType);
        if (nextType === "single") {
            setItemRows([itemRows[0] || (presetItem ? { itemId: presetItem.id, qty: "" } : emptyRow())]);
        }
    }

    function updateRow(index, field, value) {
        const newRows = [...itemRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setItemRows(newRows);
    }

    function addRow() {
        setItemRows([...itemRows, emptyRow()]);
    }

    function removeRow(index) {
        setItemRows(itemRows.filter((_, i) => i !== index));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!zone.trim() && !shelf.trim()) {
            setError("Vui lòng nhập ít nhất khu vực hoặc kệ.");
            return;
        }

        if (presetItem) {
            const firstRow = itemRows[0];
            if (!firstRow.qty || Number(firstRow.qty) <= 0) {
                setError("Vui lòng nhập số lượng cho mẫu này.");
                return;
            }
        }

        if (itemRows.some((row) => row.itemId && (!row.qty || Number(row.qty) <= 0))) {
            setError("Có mẫu đã chọn nhưng chưa nhập số lượng hợp lệ.");
            return;
        }

        const validRows = itemRows.filter((row) => row.itemId && row.qty && Number(row.qty) > 0);

        setSubmitting(true);
        try {
            const res = await fetch("/api/containers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, zone, shelf }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Tạo bao thất bại.");

            for (const row of validRows) {
                const linkRes = await fetch(`/api/containers/${data.id}/items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: row.itemId, qty: Number(row.qty) }),
                });
                const linkData = await linkRes.json();
                if (!linkRes.ok) throw new Error(linkData.error || "Gán mẫu vào bao thất bại.");
            }

            setNewQr(data);
            setZone("");
            setShelf("");
            setItemRows(presetItem ? [{ itemId: presetItem.id, qty: "" }] : [emptyRow()]);
            onCreated?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (newQr) {
        return (
            <div className="bg-white border border-border rounded-lg p-4 mb-4 text-center">
                <img src={newQr.qrDataUrl} alt="Mã QR" className="w-40 h-40 mx-auto" />
                <p className="font-mono text-sm mt-2">{newQr.id}</p>
                <div className="flex gap-2 mt-3">
                    <button onClick={() => window.print()} className="flex-1 border border-border rounded-md py-2 text-sm">In mã này</button>
                    <Link href={`/vat-chua/${newQr.id}`} className="flex-1 bg-accent text-white rounded-md py-2 text-sm text-center">
                        Xem chi tiết bao
                    </Link>
                </div>
                <button onClick={() => setNewQr(null)} className="text-[12px] text-ink-soft mt-3">
                    Tạo thêm bao khác
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-surface-alt rounded-lg p-3 mb-4 flex flex-col gap-2">
            <div>
                <label className="text-[12px] text-ink-soft block mb-1">Loại bao</label>
                <select value={type} onChange={(e) => updateType(e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm">
                    {CONTAINER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <input placeholder="Khu vực" value={zone} onChange={(e) => setZone(e.target.value)} className="px-3 py-2 border border-border rounded-md text-sm" />
                <input placeholder="Kệ" value={shelf} onChange={(e) => setShelf(e.target.value)} className="px-3 py-2 border border-border rounded-md text-sm" />
            </div>

            <div className="border-t border-border pt-2 mt-1">
                <label className="text-[12px] text-ink-soft block mb-1">
                    {presetItem ? "Mẫu hàng trong bao" : (type === "mixed" ? "Gán các mẫu hàng vào bao (tùy chọn)" : "Gán mẫu hàng (tùy chọn)")}
                </label>

                {itemRows.map((row, index) => {
                    const isLockedRow = presetItem && index === 0;
                    return (
                        <div key={index} className="grid grid-cols-[1fr_90px_auto] gap-2 mb-2">
                            {isLockedRow ? (
                                <div className="px-3 py-2 border border-border rounded-md text-sm bg-white text-ink-soft">
                                    {presetItem.itemCode}
                                </div>
                            ) : (
                                <select
                                    value={row.itemId}
                                    onChange={(e) => updateRow(index, "itemId", e.target.value)}
                                    className="px-3 py-2 border border-border rounded-md text-sm"
                                >
                                    <option value="">Chọn mẫu hàng...</option>
                                    {allItems.map((it) => (
                                        <option key={it.id} value={it.id}>{it.itemCode || it.name}</option>
                                    ))}
                                </select>
                            )}
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                placeholder="SL"
                                value={row.qty}
                                onChange={(e) => updateRow(index, "qty", e.target.value)}
                                className="px-2 py-2 border border-border rounded-md text-sm"
                            />
                            {!isLockedRow && itemRows.length > (presetItem ? 1 : 1) && type === "mixed" && (
                                <button type="button" onClick={() => removeRow(index)} className="text-red-500 text-[12px] px-2">
                                    Xóa
                                </button>
                            )}
                        </div>
                    );
                })}

                {type === "mixed" && (
                    <button type="button" onClick={addRow} className="text-[12px] text-accent-dark font-medium mt-1">
                        + Thêm mẫu khác vào bao này
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-[12px]">{error}</p>}

            <button type="submit" disabled={submitting} className="bg-accent text-white text-sm font-semibold py-2 rounded-md mt-1 disabled:opacity-60">
                {submitting ? "Đang tạo..." : "Tạo"}
            </button>
        </form>
    );
}