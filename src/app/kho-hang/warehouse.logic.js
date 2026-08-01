"use client";
import { useState, useEffect, useCallback } from "react";

export function useWarehouseLogic() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            const res = await fetch(`/api/items?${params.toString()}`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timeout = setTimeout(fetchItems, 300); // debounce gõ tìm kiếm
        return () => clearTimeout(timeout);
    }, [fetchItems]);

    return { items, search, setSearch, loading };
}