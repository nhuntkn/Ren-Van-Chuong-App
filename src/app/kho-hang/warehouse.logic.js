"use client";
import { useState, useEffect, useCallback } from "react";

const PAGE_SIZE = 50;

export function useWarehouseLogic() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [role, setRole] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState("");

    const fetchItems = useCallback(async (offset = 0, append = false) => {
        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            params.set("offset", offset.toString());
            params.set("limit", PAGE_SIZE.toString());

            const res = await fetch(`/api/items?${params.toString()}`);
            const data = await res.json();

            setItems((prev) => (append ? [...prev, ...data.items] : data.items));
            setTotal(data.total || 0);
        } catch (err) {
            if (!append) setItems([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [search]);

    useEffect(() => {
        const timeout = setTimeout(() => fetchItems(0, false), 300);
        return () => clearTimeout(timeout);
    }, [fetchItems]);

    useEffect(() => {
        fetch("/api/me").then((r) => r.json()).then((d) => setRole(d.role)).catch(() => setRole(null));
    }, []);

    function loadMore() {
        fetchItems(items.length, true);
    }

    async function handleSyncNow() {
        setSyncing(true);
        setSyncMessage("");
        try {
            const res = await fetch("/api/sync-now", { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Đồng bộ thất bại.");
            setSyncMessage("Đã đồng bộ xong.");
        } catch (err) {
            setSyncMessage(err.message);
        } finally {
            setSyncing(false);
            setTimeout(() => setSyncMessage(""), 3000);
        }
    }

    const hasMore = items.length < total;

    return { items, total, search, setSearch, loading, loadingMore, loadMore, hasMore, role, syncing, syncMessage, handleSyncNow };
}