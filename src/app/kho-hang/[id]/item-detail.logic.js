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
    const [publishLoading, setPublishLoading] = useState(false);

    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteInput, setNoteInput] = useState("");
    const [savingNote, setSavingNote] = useState(false);
    const [role, setRole] = useState(null);

    const [allItems, setAllItems] = useState([]);
    const [showCreateContainer, setShowCreateContainer] = useState(false);
    const [changingPhoto, setChangingPhoto] = useState(false);

    const [priceForm, setPriceForm] = useState({
        fabricWidth: "", conversionInfo: "", supplier: "", costPrice: "", wholesalePrice: "", price: "",
    });
    const [savingPrice, setSavingPrice] = useState(false);

    const [colorOptions, setColorOptions] = useState([]);
    const [widthOptions, setWidthOptions] = useState([]);

    useEffect(() => {
        fetch("/api/items?limit=2000")
            .then((r) => r.json())
            .then((d) => setAllItems(Array.isArray(d.items) ? d.items : []))
            .catch(() => setAllItems([]));

        fetch("/api/me")
            .then((r) => r.json())
            .then((data) => setRole(data.role))
            .catch(() => setRole(null));

        fetch("/api/meta/color-width-options")
            .then((r) => r.json())
            .then((d) => {
                setColorOptions(d.colors || []);
                setWidthOptions(d.widths || []);
            })
            .catch(() => {
                setColorOptions([]);
                setWidthOptions([]);
            });
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
            setNoteInput(itemData.note || "");
            setPriceForm({
                fabricWidth: itemData.fabricWidth || "",
                conversionInfo: itemData.conversionInfo || "",
                supplier: itemData.supplier || "",
                costPrice: itemData.costPrice || "",
                wholesalePrice: itemData.wholesalePrice || "",
                price: itemData.price || "",
            });

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

    async function savePriceInfo() {
        setSavingPrice(true);
        setError("");
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fabricWidth: priceForm.fabricWidth,
                    conversionInfo: priceForm.conversionInfo,
                    supplier: priceForm.supplier,
                    costPrice: priceForm.costPrice ? Number(priceForm.costPrice) : null,
                    wholesalePrice: priceForm.wholesalePrice ? Number(priceForm.wholesalePrice) : null,
                    price: priceForm.price ? Number(priceForm.price) : null,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Lưu thất bại.");
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingPrice(false);
        }
    }

    async function togglePublish() {
        const nextState = !item.isPublished;
        if (nextState && (!item.price || item.price <= 0)) {
            setError("Vui lòng nhập Giá lẻ ở khối phía trên trước khi đăng bán.");
            return;
        }
        setPublishLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/items/${id}/publish`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: nextState, price: item.price }),
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
            const newPreview = resizeToDataURL(img, 800, 0.85);
            const feature = computeHashAndColor(img);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dataUrl: newPreview }),
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || "Tải ảnh lên thất bại.");

            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: uploadData.url, hash: feature.hash, avgColor: feature.avgColor }),
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
        priceForm, setPriceForm, savePriceInfo, savingPrice,
        togglePublish, publishLoading,
        deleteItem,
        isEditingNote, noteInput, setNoteInput, startEditNote, cancelEditNote, saveNote, savingNote,
        role,
        allItems, showCreateContainer, setShowCreateContainer,
        changingPhoto, changePhoto,
        colorOptions, widthOptions,
    };
}