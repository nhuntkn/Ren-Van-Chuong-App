"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

export function useContainerDetailLogic() {
    const { id } = useParams();
    const [container, setContainer] = useState(null);
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [containerRes, itemsRes, allItemsRes] = await Promise.all([
                fetch(`/api/containers/${id}`),
                fetch(`/api/containers/${id}/items`),
                fetch(`/api/items`),
            ]);
            setContainer(await containerRes.json());
            setItems(await itemsRes.json());
            setAllItems(await allItemsRes.json());
        } catch (err) {
            setError("Không tải được thông tin bao.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    async function addItemToContainer(itemId, qty) {
        setError("");
        try {
            const res = await fetch(`/api/containers/${id}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, qty }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Thêm mẫu vào bao thất bại.");
            await load();
        } catch (err) {
            setError(err.message);
        }
    }

    async function removeItemFromContainer(itemId, qtyToRemove) {
        setError("");
        try {
            const res = await fetch(`/api/containers/${id}/items`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, qtyToRemove }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Lấy mẫu ra thất bại.");
            await load();
        } catch (err) {
            setError(err.message);
        }
    }

    return { container, items, allItems, loading, error, addItemToContainer, removeItemFromContainer };
}