"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

export function useContainerDetailLogic() {
    const { id } = useParams();
    const router = useRouter();
    const [container, setContainer] = useState(null);
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [role, setRole] = useState(null);

    useEffect(() => {
        fetch("/api/me")
            .then((r) => r.json())
            .then((data) => setRole(data.role))
            .catch(() => setRole(null));
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [containerRes, itemsRes, allItemsRes] = await Promise.all([
                fetch(`/api/containers/${id}`),
                fetch(`/api/containers/${id}/items`),
                fetch(`/api/items?limit=2000`),
            ]);
            setContainer(await containerRes.json());
            setItems(await itemsRes.json());

            const allItemsData = await allItemsRes.json();
            setAllItems(Array.isArray(allItemsData.items) ? allItemsData.items : []);
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

    async function deleteContainer() {
        setError("");
        try {
            const res = await fetch(`/api/containers/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Xóa bao thất bại.");
            router.push("/vat-chua");
        } catch (err) {
            setError(err.message);
        }
    }

    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [locationForm, setLocationForm] = useState({ zone: "", shelf: "" });
    const [savingLocation, setSavingLocation] = useState(false);

    function startEditLocation() {
        setLocationForm({ zone: container.zone || "", shelf: container.shelf || "" });
        setIsEditingLocation(true);
    }

    function cancelEditLocation() {
        setIsEditingLocation(false);
    }

    async function saveLocation() {
        setSavingLocation(true);
        setError("");
        try {
            const res = await fetch(`/api/containers/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: container.type, zone: locationForm.zone, shelf: locationForm.shelf }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Lưu vị trí thất bại.");
            setIsEditingLocation(false);
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingLocation(false);
        }
    }

    return {
        container, items, allItems, loading, error, addItemToContainer, removeItemFromContainer, deleteContainer, role,
        isEditingLocation, locationForm, setLocationForm, startEditLocation, cancelEditLocation, saveLocation, savingLocation,
    };
}