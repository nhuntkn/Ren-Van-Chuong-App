"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fileToImage, resizeToDataURL, computeHashAndColor } from "@/lib/imageHash";
import { CATEGORIES, UNITS } from "@/lib/constants";

export function useAddItemLogic() {
    const router = useRouter();
    const [colors, setColors] = useState([]);
    const [photoFile, setPhotoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [feature, setFeature] = useState(null);

    const [form, setForm] = useState({
        name: "",
        category: CATEGORIES[0],
        colorCode: "",
        unit: UNITS[0],
        note: "",
        zone: "",
        shelf: "",
        qty: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/colors")
            .then((res) => res.json())
            .then((data) => {
                setColors(Array.isArray(data) ? data : []);
                if (data?.[0]) updateField("colorCode", data[0].code);
            })
            .catch(() => setColors([]));
    }, []);

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handlePhotoCapture(file) {
        setPhotoFile(file);
        const img = await fileToImage(file);
        setPreviewUrl(resizeToDataURL(img, 320, 0.65));
        setFeature(computeHashAndColor(img));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.name.trim()) {
            setError("Vui lòng nhập tên mẫu.");
            return;
        }
        if (!photoFile) {
            setError("Vui lòng chụp ảnh mẫu.");
            return;
        }
        if (!form.qty || Number(form.qty) <= 0) {
            setError("Vui lòng nhập số lượng hợp lệ cho bao đầu tiên.");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Tạo mẫu hàng
            const itemRes = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    category: form.category,
                    colorCode: form.colorCode || null,
                    unit: form.unit,
                    note: form.note.trim(),
                    imageUrl: previewUrl, // MVP: lưu thẳng base64, nâng cấp lên Supabase Storage sau
                    hash: feature.hash,
                    avgColor: feature.avgColor,
                }),
            });
            const itemData = await itemRes.json();
            if (!itemRes.ok) throw new Error(itemData.error || "Tạo mẫu hàng thất bại.");

            // 2. Tạo bao đầu tiên
            const containerRes = await fetch("/api/containers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "single", zone: form.zone, shelf: form.shelf }),
            });
            const containerData = await containerRes.json();
            if (!containerRes.ok) throw new Error(containerData.error || "Tạo bao hàng thất bại.");

            // 3. Gán mẫu vào bao vừa tạo
            const linkRes = await fetch(`/api/containers/${containerData.id}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId: itemData.id, qty: Number(form.qty) }),
            });
            const linkData = await linkRes.json();
            if (!linkRes.ok) throw new Error(linkData.error || "Gán mẫu vào bao thất bại.");

            router.push(`/kho-hang/${itemData.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return { colors, form, updateField, previewUrl, handlePhotoCapture, handleSubmit, submitting, error };
}