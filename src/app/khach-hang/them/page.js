"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCustomerPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", phone: "", address: "", customerType: "", occupation: "", note: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        if (!form.name.trim()) {
            setError("Vui lòng nhập tên khách hàng.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Thêm khách hàng thất bại.");
            router.push(`/khach-hang/${data.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="px-4 py-5">
            <h1 className="text-lg font-semibold mb-4">Thêm khách hàng</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input placeholder="Tên khách hàng *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />
                <input placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />
                <input placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />
                <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Loại khách (VD: Sỉ, Lẻ)" value={form.customerType} onChange={(e) => setForm({ ...form, customerType: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />
                    <input placeholder="Nghề nghiệp" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" />
                </div>
                <textarea placeholder="Ghi chú (VD: Thích ren trắng, 2 tuần mua 1 lần)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm min-h-[70px]" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={submitting} className="bg-accent text-white font-semibold py-2.5 rounded-md disabled:opacity-60">
                    {submitting ? "Đang lưu..." : "Thêm khách hàng"}
                </button>
            </form>
        </main>
    );
}