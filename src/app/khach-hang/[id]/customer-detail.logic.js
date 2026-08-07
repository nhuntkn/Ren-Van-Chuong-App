"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

export function useCustomerDetailLogic() {
    const { id } = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [role, setRole] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/customers/${id}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Không tìm thấy khách hàng.");
            setCustomer(data);
            setForm(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        fetch("/api/me").then((r) => r.json()).then((d) => setRole(d.role)).catch(() => setRole(null));
    }, []);

    async function saveCustomer() {
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Lưu thất bại.");
            setIsEditing(false);
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function deleteCustomer() {
        if (!confirm("Xóa khách hàng này? Hành động không thể hoàn tác.")) return;
        try {
            const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Xóa thất bại.");
            router.push("/khach-hang");
        } catch (err) {
            setError(err.message);
        }
    }

    return { customer, loading, error, role, isEditing, setIsEditing, form, setForm, saveCustomer, saving, deleteCustomer };
}