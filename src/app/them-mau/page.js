"use client";
import { useAddItemLogic } from "./add-item.logic";
import PhotoCapture from "@/components/photoCapture";
import { CATEGORIES, UNITS } from "@/lib/constants";

export default function AddItemPage() {
    const { colors, form, updateField, previewUrl, handlePhotoCapture, handleSubmit, submitting, error } =
        useAddItemLogic();

    return (
        <main className="px-4 py-5">
            <h1 className="text-lg font-semibold mb-4">Thêm mẫu hàng mới</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <PhotoCapture previewUrl={previewUrl} onCapture={handlePhotoCapture} />

                <div>
                    <label className="text-[12px] text-ink-soft block mb-1">Tên mẫu</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="VD: Ren hoa mẫu đơn"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                    />
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
                        <label className="text-[12px] text-ink-soft block mb-1">Mã màu</label>
                        <select
                            value={form.colorCode}
                            onChange={(e) => updateField("colorCode", e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        >
                            {colors.map((c) => (
                                <option key={c.code} value={c.code}>{c.code} · {c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[12px] text-ink-soft block mb-1">Vị trí bao đầu tiên</label>
                    <div className="grid grid-cols-3 gap-2">
                        <input placeholder="Khu vực" value={form.zone} onChange={(e) => updateField("zone", e.target.value)} className="px-3 py-2 border border-border rounded-md text-sm" />
                        <input placeholder="Kệ số" value={form.shelf} onChange={(e) => updateField("shelf", e.target.value)} className="px-3 py-2 border border-border rounded-md text-sm" />                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[12px] text-ink-soft block mb-1">Số lượng</label>
                        <input type="number" value={form.qty} onChange={(e) => updateField("qty", e.target.value)} placeholder="0" className="w-full px-3 py-2 border border-border rounded-md text-sm" />
                    </div>
                    <div>
                        <label className="text-[12px] text-ink-soft block mb-1">Đơn vị</label>
                        <select value={form.unit} onChange={(e) => updateField("unit", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm">
                            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[12px] text-ink-soft block mb-1">Ghi chú</label>
                    <textarea value={form.note} onChange={(e) => updateField("note", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm min-h-[60px]" />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" disabled={submitting} className="bg-accent text-white font-semibold py-2.5 rounded-md disabled:opacity-60">
                    {submitting ? "Đang lưu..." : "Thêm vào kho"}
                </button>
            </form>
        </main>
    );
}