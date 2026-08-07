"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAddItemLogic } from "./add-item.logic";
import PhotoCapture from "@/components/photoCapture";
import { CATEGORIES, UNITS } from "@/lib/constants";

export default function AddItemPage() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        fetch("/api/me")
            .then((r) => r.json())
            .then((d) => setRole(d.role))
            .catch(() => setRole(null));
    }, []);

    const {
        form, updateField, previewUrl, handlePhotoCapture, handleSubmit, submitting, error,
        duplicateWarning, colorOptions, widthOptions,
    } = useAddItemLogic();

    if (role === null) {
        return <main className="px-4 py-5 text-ink-soft text-sm">Đang tải...</main>;
    }

    if (role !== "admin") {
        return (
            <main className="px-4 py-10 text-center">
                <p className="text-ink-soft text-sm mb-3">Chỉ quản lý mới có quyền thêm mẫu hàng mới.</p>
                <Link href="/kho-hang" className="text-accent-dark text-sm underline">Quay lại Kho hàng</Link>
            </main>
        );
    }

    return (
        <main className="px-4 py-5">
            <h1 className="text-lg font-semibold mb-4">Thêm mẫu hàng mới</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <PhotoCapture previewUrl={previewUrl} onCapture={handlePhotoCapture} />

                {duplicateWarning && (
                    <div className="bg-[#FBEFD9] border border-[#E8C97A] rounded-md p-3 text-[12.5px]">
                        <p className="text-[#9A6A1E] font-medium mb-1">
                            Có thể mẫu này đã tồn tại ({duplicateWarning.score}% giống)
                        </p>
                        <p className="text-[#9A6A1E]">
                            Mẫu <b>{duplicateWarning.name}</b> trong kho khá giống ảnh vừa chụp.{" "}
                            <Link href={`/kho-hang/${duplicateWarning.id}`} className="underline">Xem mẫu này</Link>
                            {" "}hoặc vào{" "}
                            <Link href="/quet-anh" className="underline">Quét ảnh</Link> để kiểm tra kỹ hơn trước khi tạo mới.
                        </p>
                    </div>
                )}

                <div>
                    <label className="text-[12px] text-ink-soft block mb-1">Mã mẫu</label>
                    <input
                        type="text"
                        value={form.itemCode}
                        onChange={(e) => updateField("itemCode", e.target.value)}
                        placeholder="VD: CHX-07"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm font-mono"
                    />
                    <p className="text-[11px] text-ink-faint mt-1">Tự động gợi ý theo loại, có thể sửa lại.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[12px] text-ink-soft block mb-1">Loại</label>
                        <select
                            value={form.category}
                            onChange={(e) => updateField("category", e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        >
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[12px] text-ink-soft block mb-1">Màu sắc</label>
                        <input
                            type="text"
                            list="color-options"
                            value={form.color}
                            onChange={(e) => updateField("color", e.target.value)}
                            placeholder="VD: Trắng, be..."
                            className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        />
                        <datalist id="color-options">
                            {colorOptions.map((c) => <option key={c} value={c} />)}
                        </datalist>
                    </div>
                </div>

                <div>
                    <label className="text-[12px] text-ink-soft block mb-1">Khổ</label>
                    <input
                        type="text"
                        list="width-options"
                        value={form.fabricWidth}
                        onChange={(e) => updateField("fabricWidth", e.target.value)}
                        placeholder="VD: 1.5cm"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                    />
                    <datalist id="width-options">
                        {widthOptions.map((w) => <option key={w} value={w} />)}
                    </datalist>
                </div>

                <div>
                    <label className="text-[12px] text-ink-soft block mb-1">Vị trí bao đầu tiên</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            placeholder="Khu vực"
                            value={form.zone}
                            onChange={(e) => updateField("zone", e.target.value)}
                            className="px-3 py-2 border border-border rounded-md text-sm"
                        />
                        <input
                            placeholder="Kệ số"
                            value={form.shelf}
                            onChange={(e) => updateField("shelf", e.target.value)}
                            className="px-3 py-2 border border-border rounded-md text-sm"
                        />
                    </div>
                    <p className="text-[11px] text-ink-faint mt-1">
                        Để trống nếu chưa muốn tạo bao ngay — có thể gán bao sau ở trang chi tiết mẫu.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[12px] text-ink-soft block mb-1">Số lượng</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            value={form.qty}
                            onChange={(e) => updateField("qty", e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-[12px] text-ink-soft block mb-1">Đơn vị</label>
                        <select
                            value={form.unit}
                            onChange={(e) => updateField("unit", e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        >
                            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[12px] text-ink-soft block mb-1">Ghi chú</label>
                    <textarea
                        value={form.note}
                        onChange={(e) => updateField("note", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm min-h-[60px]"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-accent text-white font-semibold py-2.5 rounded-md disabled:opacity-60"
                >
                    {submitting ? "Đang lưu..." : "Thêm vào kho"}
                </button>
            </form>
        </main>
    );
}