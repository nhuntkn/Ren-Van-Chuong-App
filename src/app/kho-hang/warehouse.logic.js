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

    const hasMore = items.length < total;

    return { items, total, search, setSearch, loading, loadingMore, loadMore, hasMore, role };
}