"use client";
import { useCustomerDetailLogic } from "./customer-detail.logic";

export default function CustomerDetailPage() {
    const { customer, loading, error, role, isEditing, setIsEditing, form, setForm, saveCustomer, saving, deleteCustomer } =
        useCustomerDetailLogic();

    if (loading) return <main className="px-4 py-5 text-ink-soft text-sm">Đang tải...</main>;
    if (!customer) return <main className="px-4 py-5 text-sm">{error || "Không tìm thấy khách hàng."}</main>;

    return (
        <main className="px-4 py-5">
            {isEditing ? (
                <div className="flex flex-col gap-3">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" placeholder="Tên" />
                    <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" placeholder="SĐT" />
                    <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" placeholder="Địa chỉ" />
                    <div className="grid grid-cols-2 gap-2">
                        <input value={form.customerType || ""} onChange={(e) => setForm({ ...form, customerType: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" placeholder="Loại khách" />
                        <input value={form.occupation || ""} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm" placeholder="Nghề nghiệp" />
                    </div>
                    <textarea value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className="px-3 py-2 border border-border rounded-md text-sm min-h-[70px]" placeholder="Ghi chú" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex gap-2">
                        <button onClick={saveCustomer} disabled={saving} className="flex-1 bg-accent text-white font-semibold py-2.5 rounded-md disabled:opacity-60">
                            {saving ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="flex-1 border border-border py-2.5 rounded-md">Hủy</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-start mb-1">
                        <h1 className="text-lg font-semibold">{customer.name}</h1>
                        {role === "admin" && (
                            <button onClick={() => setIsEditing(true)} className="text-[12px] text-accent-dark font-medium">Sửa</button>
                        )}
                    </div>
                    {customer.customerType && (
                        <span className="inline-block text-[11px] bg-sage-soft text-sage px-2 py-0.5 rounded-full mb-3">{customer.customerType}</span>
                    )}

                    <div className="bg-surface-alt rounded-lg p-3 flex flex-col gap-1.5 text-[13.5px] mb-4">
                        {customer.phone && <div className="flex justify-between"><span className="text-ink-soft">SĐT</span><span>{customer.phone}</span></div>}
                        {customer.address && <div className="flex justify-between"><span className="text-ink-soft">Địa chỉ</span><span className="text-right">{customer.address}</span></div>}
                        {customer.occupation && <div className="flex justify-between"><span className="text-ink-soft">Nghề nghiệp</span><span>{customer.occupation}</span></div>}
                    </div>

                    {customer.note && (
                        <div className="mb-4">
                            <p className="text-[12px] text-ink-soft mb-1">Ghi chú</p>
                            <p className="text-[13.5px] whitespace-pre-line">{customer.note}</p>
                        </div>
                    )}

                    {role === "admin" && (
                        <button onClick={deleteCustomer} className="w-full mt-4 text-red-500 text-sm font-medium py-2">
                            Xóa khách hàng này
                        </button>
                    )}
                </>
            )}
        </main>
    );
}