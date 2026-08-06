"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fileToImage, resizeToDataURL, computeHashAndColor } from "@/lib/imageHash";
import { CATEGORIES, UNITS, CATEGORY_CODE_PREFIXES } from "@/lib/constants";

export function useAddItemLogic() {
    const router = useRouter();
    const [photoFile, setPhotoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [feature, setFeature] = useState(null);
    const [codeTouched, setCodeTouched] = useState(false);

    const [form, setForm] = useState({
        itemCode: "",
        category: CATEGORIES[0],
        color: "",
        unit: UNITS[0],
        note: "",
        zone: "",
        shelf: "",
        qty: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (codeTouched) return;
        const prefix = CATEGORY_CODE_PREFIXES[form.category] || "";
        if (!prefix) return;

        fetch(`/api/items/next-code?prefix=${encodeURIComponent(prefix)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.suggestedCode) {
                    setForm((prev) => ({ ...prev, itemCode: data.suggestedCode }));
                }
            })
            .catch(() => {});
    }, [form.category, codeTouched]);

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (field === "itemCode") setCodeTouched(true);
    }

    const [duplicateWarning, setDuplicateWarning] = useState(null);

    async function handlePhotoCapture(file) {
        setPhotoFile(file);
        const img = await fileToImage(file);
        setPreviewUrl(resizeToDataURL(img, 320, 0.65));
        const newFeature = computeHashAndColor(img);
        setFeature(newFeature);

        setDuplicateWarning(null);
        try {
            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFeature),
            });
            const matches = await res.json();
            if (Array.isArray(matches) && matches.length > 0 && matches[0].score >= 80) {
                setDuplicateWarning(matches[0]);
            }
        } catch (err) {
            // im lặng bỏ qua nếu kiểm tra trùng thất bại, không chặn việc thêm mẫu
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.itemCode.trim()) { setError("Vui lòng nhập mã mẫu."); return; }
        if (!photoFile) { setError("Vui lòng chụp ảnh mẫu."); return; }

        const hasZone = form.zone.trim() !== "";
        const hasShelf = form.shelf.trim() !== "";
        const hasQty = form.qty !== "" && Number(form.qty) > 0;
        const anyLocationFieldFilled = hasZone || hasShelf || hasQty;

        if (anyLocationFieldFilled && !(hasZone && hasShelf && hasQty)) {
            setError("Nếu muốn tạo bao ngay, vui lòng điền đầy đủ khu vực, kệ và số lượng.");
            return;
        }

        setSubmitting(true);
        try {
            const itemRes = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemCode: form.itemCode.trim(),
                    category: form.category,
                    color: form.color.trim(),
                    unit: form.unit,
                    note: form.note.trim(),
                    imageUrl: previewUrl,
                    hash: feature.hash,
                    avgColor: feature.avgColor,
                }),
            });
            const itemData = await itemRes.json();
            if (!itemRes.ok) throw new Error(itemData.error || "Tạo mẫu hàng thất bại.");

            if (anyLocationFieldFilled) {
                const containerRes = await fetch("/api/containers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "single", zone: form.zone, shelf: form.shelf }),
                });
                const containerData = await containerRes.json();
                if (!containerRes.ok) throw new Error(containerData.error || "Tạo bao hàng thất bại.");

                const linkRes = await fetch(`/api/containers/${containerData.id}/items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: itemData.id, qty: Number(form.qty) }),
                });
                const linkData = await linkRes.json();
                if (!linkRes.ok) throw new Error(linkData.error || "Gán mẫu vào bao thất bại.");
            }

            router.push(`/kho-hang/${itemData.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return { form, updateField, previewUrl, handlePhotoCapture, handleSubmit, submitting, error, duplicateWarning };
}