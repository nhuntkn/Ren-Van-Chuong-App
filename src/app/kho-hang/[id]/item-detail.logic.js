"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { fileToImage, resizeToDataURL, computeHashAndColor } from "@/lib/imageHash";

export function useItemDetailLogic() {
    const { id } = useParams();
    const router = useRouter();

    const [item, setItem] = useState(null);
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [priceInput, setPriceInput] = useState("");
    const [publishLoading, setPublishLoading] = useState(false);

    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteInput, setNoteInput] = useState("");
    const [savingNote, setSavingNote] = useState(false);
    const [role, setRole] = useState(null);

    const [allItems, setAllItems] = useState([]);
    const [showCreateContainer, setShowCreateContainer] = useState(false);
    const [changingPhoto, setChangingPhoto] = useState(false);

    useEffect(() => {
        fetch("/api/items").then((r) => r.json()).then((d) => setAllItems(Array.isArray(d) ? d : [])).catch(() => setAllItems([]));
    }, []);

    useEffect(() => {
        fetch("/api/me")
            .then((r) => r.json())
            .then((data) => setRole(data.role))
            .catch(() => setRole(null));
    }, []);

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
            setNoteInput(itemData.note || "");

            const containersData = await containersRes.json();
            setContainers(Array.isArray(containersData) ? containersData : []);
            if (!containersRes.ok) {
                console.error("Lỗi tải breakdown bao hàng:", containersData.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    function startEditNote() {
        setNoteInput(item.note || "");
        setIsEditingNote(true);
    }

    function cancelEditNote() {
        setIsEditingNote(false);
        setNoteInput(item.note || "");
    }

    async function saveNote() {
        setSavingNote(true);
        setError("");
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: noteInput.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Lưu ghi chú thất bại.");
            setIsEditingNote(false);
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingNote(false);
        }
    }

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

    async function changePhoto(file) {
        setChangingPhoto(true);
        setError("");
        try {
            const img = await fileToImage(file);
            const newPreview = resizeToDataURL(img, 320, 0.65);
            const feature = computeHashAndColor(img);

            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: newPreview, hash: feature.hash, avgColor: feature.avgColor }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Đổi ảnh thất bại.");
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setChangingPhoto(false);
        }
    }

    return {
        item, containers, loading, error, load,
        priceInput, setPriceInput, togglePublish, publishLoading,
        deleteItem,
        isEditingNote, noteInput, setNoteInput, startEditNote, cancelEditNote, saveNote, savingNote,
        role,
        allItems, showCreateContainer, setShowCreateContainer,
        changingPhoto, changePhoto,
    };
}