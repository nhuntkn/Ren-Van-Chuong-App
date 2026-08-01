"use client";
import { useState, useEffect, useCallback } from "react";

export function useContainerListLogic() {
    const [containers, setContainers] = useState([]);
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
    }, [fetchContainers]);

    async function createContainer(form) {
        setError("");
        try {
            const res = await fetch("/api/containers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Tạo bao thất bại.");
            setNewQr(data);
            await fetchContainers();
        } catch (err) {
            setError(err.message);
        }
    }

    return {
        containers, loading, error,
        showCreateForm, setShowCreateForm,
        createContainer, newQr, setNewQr,
    };
}