"use client";
import Link from "next/link";
import { useContainerListLogic } from "./container.logic";
import LocationPill from "@/components/locationPill";
import CreateContainerForm from "@/components/createContainerForm";

export default function ContainerListPage() {
    const { containers, allItems, loading, error, showCreateForm, setShowCreateForm, fetchContainers, role } =
        useContainerListLogic();

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
                <CreateContainerForm allItems={allItems} onCreated={fetchContainers} />
            )}

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
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