"use client";
import { useState } from "react";

export function useScanQrLogic() {
    const [container, setContainer] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleScan(containerId) {
        setLoading(true);
        setError("");
        try {
            const [containerRes, itemsRes] = await Promise.all([
                fetch(`/api/containers/${containerId}`),
                fetch(`/api/containers/${containerId}/items`),
            ]);
            const containerData = await containerRes.json();
            if (!containerRes.ok) throw new Error(containerData.error || "Không tìm thấy bao này.");
            setContainer(containerData);
            setItems(await itemsRes.json());
        } catch (err) {
            setError(err.message);
            setContainer(null);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    return { container, items, loading, error, handleScan };
}