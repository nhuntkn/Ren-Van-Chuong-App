"use client";
import { useState } from "react";
import Link from "next/link";
import { useCustomerListLogic } from "./customer.logic";

export default function CustomerListPage() {
    const { customers, search, setSearch, loading, role } = useCustomerListLogic();
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <main className="px-4 py-5">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Khách hàng</h1>
                {role === "admin" && (
                    <Link href="/khach-hang/them" className="text-[12px] px-3 py-1.5 border border-border rounded-full">
                        + Thêm khách
                    </Link>
                )}
            </div>

            <input
                type="text"
                placeholder="Tìm theo tên, SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm mb-3"
            />

            {loading && <p className="text-ink-soft text-sm">Đang tải...</p>}
            {!loading && customers.length === 0 && (
                <p className="text-ink-soft text-sm text-center py-8">Chưa có khách hàng nào.</p>
            )}

            <div className="flex flex-col gap-2">
                {customers.map((c) => (
                    <Link key={c.id} href={`/khach-hang/${c.id}`} className="bg-white border border-border rounded-lg px-3 py-2.5">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold">{c.name}</p>
                            {c.customerType && (
                                <span className="text-[11px] bg-sage-soft text-sage px-2 py-0.5 rounded-full">{c.customerType}</span>
                            )}
                        </div>
                        <p className="text-[12px] text-ink-soft mt-1">{c.phone}</p>
                        {c.note && <p className="text-[12px] text-ink-faint mt-0.5 truncate">{c.note}</p>}
                    </Link>
                ))}
            </div>
        </main>
    );
}