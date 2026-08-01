"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

export function useItemDetailLogic() {
    const { id } = useParams();
    const router = useRouter();

    const [item, setItem] = useState(null);
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [priceInput, setPriceInput] = useState("");
    const [publishLoading, setPublishLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [itemRes, containersRes] = await Promise.all([
                fetch(`/api/items/${id}`),
                fetch(`/api/items/${id}/containers`),
            ]);
            const itemData = await itemRes.json();
            if (!itemRes.ok) throw new Error(itemData.error || "Không tìm thấy mẫu.");
            setItem(itemData);
            setPriceInput(itemData.price || "");
            setContainers(await containersRes.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    async function togglePublish() {
        const nextState = !item.isPublished;
        if (nextState && (!priceInput || Number(priceInput) <= 0)) {
            setError("Vui lòng nhập giá bán hợp lệ trước khi đăng bán.");
            return;
        }
        setPublishLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/items/${id}/publish`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: nextState, price: Number(priceInput) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Cập nhật thất bại.");
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setPublishLoading(false);
        }
    }

    async function deleteItem() {
        if (!confirm("Xóa mẫu này khỏi kho? Hành động không thể hoàn tác.")) return;
        try {
            const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Xóa thất bại.");
            router.push("/kho-hang");
        } catch (err) {
            setError(err.message);
        }
    }

    return { item, containers, loading, error, priceInput, setPriceInput, togglePublish, publishLoading, deleteItem };
}