"use client";
import { useState, useEffect, useCallback } from "react";

export function useContainerListLogic() {
    const [containers, setContainers] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newQr, setNewQr] = useState(null);

    const fetchContainers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/containers");
            const data = await res.json();
            setContainers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Không tải được danh sách bao.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContainers();
        fetch("/api/items")
            .then((res) => res.json())
            .then((data) => setAllItems(Array.isArray(data) ? data : []))
            .catch(() => setAllItems([]));
    }, [fetchContainers]);

    async function createContainer(form) {
        setError("");

        if (!form.zone.trim() && !form.shelf.trim()) {
            setError("Vui lòng nhập ít nhất khu vực hoặc kệ, để không bị mất dấu vị trí sau này.");
            return false;
        }
        if (form.itemId && (!form.qty || Number(form.qty) <= 0)) {
            setError("Đã chọn mẫu hàng thì cần nhập số lượng hợp lệ.");
            return false;
        }

        try {
            const res = await fetch("/api/containers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: form.type, zone: form.zone, shelf: form.shelf }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Tạo bao thất bại.");

            if (form.itemId) {
                const linkRes = await fetch(`/api/containers/${data.id}/items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: form.itemId, qty: Number(form.qty) }),
                });
                const linkData = await linkRes.json();
                if (!linkRes.ok) throw new Error(linkData.error || "Gán mẫu vào bao thất bại.");
            }

            setNewQr(data);
            await fetchContainers();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    }

    return {
        containers, allItems, loading, error,
        showCreateForm, setShowCreateForm,
        createContainer, newQr, setNewQr,
    };
}