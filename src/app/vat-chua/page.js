"use client";
import { useState } from "react";
import Link from "next/link";
import { useContainerListLogic } from "./container.logic";
import LocationPill from "@/components/locationPill";
import { CONTAINER_TYPES } from "@/lib/constants";

export default function ContainerListPage() {
    const { containers, loading, error, showCreateForm, setShowCreateForm, createContainer, newQr, setNewQr } =
        useContainerListLogic();

    const [form, setForm] = useState({ type: "single", zone: "", shelf: ""});

    async function handleCreate(e) {
        e.preventDefault();
        await createContainer(form);
        setForm({ type: "single", zone: "", shelf: "" });
    }

    return (
        <main className="px-4 py-5">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Vật chứa</h1>
                <button onClick={() => setShowCreateForm((v) => !v)} className="text-[12px] px-3 py-1.5 border border-border rounded-full">
                    + Tạo bao mới
                </button>
            </div>

            {showCreateForm && (
                <form onSubmit={handleCreate} className="bg-surface-alt rounded-lg p-3 mb-4 flex flex-col gap-2">
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm">
                        {CONTAINER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <div className="grid grid-cols-3 gap-2">
                        <input placeholder="Khu vực" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />
                        <input placeholder="Kệ" value={form.shelf} onChange={(e) => setForm({ ...form, shelf: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />                    </div>
                    <button type="submit" className="bg-accent text-white text-sm font-semibold py-2 rounded-md">Tạo</button>
                </form>
            )}

            {newQr && (
                <div className="bg-white border border-border rounded-lg p-4 mb-4 text-center">
                    <img src={newQr.qrDataUrl} alt="Mã QR" className="w-40 h-40 mx-auto" />
                    <p className="font-mono text-sm mt-2">{newQr.id}</p>
                    <div className="flex gap-2 mt-3">
                        <button onClick={() => window.print()} className="flex-1 border border-border rounded-md py-2 text-sm">In mã này</button>
                        <button onClick={() => setNewQr(null)} className="flex-1 bg-accent text-white rounded-md py-2 text-sm">Xong</button>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {loading && <p className="text-ink-soft text-sm">Đang tải...</p>}

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