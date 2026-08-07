"use client";
import { useState, useEffect, useCallback } from "react";

export function useContainerListLogic() {
    const [containers, setContainers] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [role, setRole] = useState(null);

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
        fetch("/api/items").then((r) => r.json()).then((d) => setAllItems(Array.isArray(d.items) ? d.items : []))
        fetch("/api/me").then((r) => r.json()).then((d) => setRole(d.role)).catch(() => setRole(null));
    }, [fetchContainers]);

    return { containers, allItems, loading, error, showCreateForm, setShowCreateForm, fetchContainers, role };
}