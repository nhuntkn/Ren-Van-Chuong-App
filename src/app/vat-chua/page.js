"use client";
import { useState } from "react";
import Link from "next/link";
import { useContainerListLogic } from "./container.logic";
import LocationPill from "@/components/locationPill";
import { CONTAINER_TYPES } from "@/lib/constants";

const emptyRow = () => ({ itemId: "", qty: "" });

export default function ContainerListPage() {
    const { containers, allItems, loading, error, showCreateForm, setShowCreateForm, createContainer, newQr, setNewQr, role } =
        useContainerListLogic();

    const [form, setForm] = useState({ type: "single", zone: "", shelf: "", itemRows: [emptyRow()] });

    function updateType(type) {
        if (type === "single") {
            setForm({ ...form, type, itemRows: [form.itemRows[0] || emptyRow()] });
        } else {
            setForm({ ...form, type });
        }
    }

    function updateRow(index, field, value) {
        const newRows = [...form.itemRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setForm({ ...form, itemRows: newRows });
    }

    function addRow() {
        setForm({ ...form, itemRows: [...form.itemRows, emptyRow()] });
    }

    function removeRow(index) {
        setForm({ ...form, itemRows: form.itemRows.filter((_, i) => i !== index) });
    }

    async function handleCreate(e) {
        e.preventDefault();
        const success = await createContainer(form);
        if (success) {
            setForm({ type: "single", zone: "", shelf: "", itemRows: [emptyRow()] });
        }
    }

    return (
        <main className="px-4 py-5">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Vật chứa</h1>
                {role === "admin" && (
                    <button onClick={() => setShowCreateForm((v) => !v)} className="text-[12px] px-3 py-1.5 border border-border rounded-full">
                        + Tạo bao mới
                    </button>
                )}
            </div>

            {role === "admin" && showCreateForm && (
                <form onSubmit={handleCreate} className="bg-surface-alt rounded-lg p-3 mb-4 flex flex-col gap-2">
                    <div>
                        <label className="text-[12px] text-ink-soft block mb-1">Loại bao</label>
                        <select value={form.type} onChange={(e) => updateType(e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm">
                            {CONTAINER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Khu vực" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />
                        <input placeholder="Kệ" value={form.shelf} onChange={(e) => setForm({ ...form, shelf: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />
                    </div>

                    <div className="border-t border-border pt-2 mt-1">
                        <label className="text-[12px] text-ink-soft block mb-1">
                            {form.type === "mixed" ? "Gán các mẫu hàng vào bao (tùy chọn)" : "Gán mẫu hàng (tùy chọn)"}
                        </label>

                        {form.itemRows.map((row, index) => (
                            <div key={index} className="grid grid-cols-[1fr_90px_auto] gap-2 mb-2">
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
                                {form.type === "mixed" && form.itemRows.length > 1 && (
                                    <button type="button" onClick={() => removeRow(index)} className="text-red-500 text-[12px] px-2">
                                        Xóa
                                    </button>
                                )}
                            </div>
                        ))}

                        {form.type === "mixed" && (
                            <button type="button" onClick={addRow} className="text-[12px] text-accent-dark font-medium mt-1">
                                + Thêm mẫu khác vào bao này
                            </button>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-[12px]">{error}</p>}

                    <button type="submit" className="bg-accent text-white text-sm font-semibold py-2 rounded-md mt-1">Tạo</button>
                </form>
            )}

            {newQr && (
                <div className="bg-white border border-border rounded-lg p-4 mb-4 text-center">
                    <img src={newQr.qrDataUrl} alt="Mã QR" className="w-40 h-40 mx-auto" />
                    <p className="font-mono text-sm mt-2">{newQr.id}</p>
                    <div className="flex gap-2 mt-3">
                        <button onClick={() => window.print()} className="flex-1 border border-border rounded-md py-2 text-sm">In mã này</button>
                        <Link href={`/vat-chua/${newQr.id}`} className="flex-1 bg-accent text-white rounded-md py-2 text-sm text-center">
                            Xem chi tiết bao
                        </Link>
                    </div>
                </div>
            )}

            {!showCreateForm && loading && <p className="text-ink-soft text-sm">Đang tải...</p>}

            <div className="flex flex-col gap-2">
                {containers.map((c) => (
                    <Link key={c.id} href={`/vat-chua/${c.id}`} className="flex justify-between items-center bg-white border border-border rounded-lg px-3 py-2.5">
                        <div>
                            <p className="font-mono text-sm font-semibold">{c.id}</p>
                            <div className="mt-1">
                                <LocationPill zone={c.zone} shelf={c.shelf} isMixed={c.type === "mixed"} />
                            </div>
                        </div>
                        <span className="text-[12px] text-ink-soft">{c.itemCount} mẫu</span>
                    </Link>
                ))}
            </div>
        </main>
    );
}