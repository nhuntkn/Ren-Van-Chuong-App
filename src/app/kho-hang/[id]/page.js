"use client";
import { useItemDetailLogic } from "./item-detail.logic";
import ContainerBreakdownList from "@/components/containerBreakdownList";

export default function ItemDetailPage() {
    const { item, containers, loading, error, priceInput, setPriceInput, togglePublish, publishLoading, deleteItem } =
        useItemDetailLogic();

    if (loading) return <main className="px-4 py-5 text-ink-soft text-sm">Đang tải...</main>;
    if (!item) return <main className="px-4 py-5 text-sm">{error || "Không tìm thấy mẫu."}</main>;

    return (
        <main className="px-4 py-5">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-alt mb-3">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
            </div>

            <h1 className="text-lg font-semibold">{item.name}</h1>
            <p className="text-[13px] text-ink-soft mb-3">
                {item.category}{item.colorName && ` · ${item.colorName} (${item.colorCode})`}
            </p>

            <div className="bg-surface-alt rounded-lg p-3 mb-4 flex justify-between items-center">
                <span className="text-sm">Tổng tồn kho</span>
                <span className="text-lg font-semibold">{item.totalStock} {item.unit}</span>
            </div>

            <h2 className="text-[13px] font-semibold text-ink-soft mb-2">Nằm trong {containers.length} bao</h2>
            <ContainerBreakdownList containers={containers} />

            <div className="bg-surface-alt rounded-lg p-3 mt-5">
                {!item.isPublished && (
                    <input
                        type="number"
                        placeholder="Giá bán (₫)"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2"
                    />
                )}
                <button
                    onClick={togglePublish}
                    disabled={publishLoading}
                    className={`w-full py-2.5 rounded-md font-semibold text-sm ${
                        item.isPublished ? "bg-white border border-red-400 text-red-500" : "bg-accent text-white"
                    }`}
                >
                    {publishLoading ? "Đang xử lý..." : item.isPublished ? "Tạm dừng đăng bán" : "Đăng bán"}
                </button>
                {item.isPublished && (
                    <p className="text-[12px] text-sage mt-1.5">Đang bán với giá {Number(item.price).toLocaleString("vi-VN")}₫</p>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            <button onClick={deleteItem} className="w-full mt-4 text-red-500 text-sm font-medium py-2">
                Xóa mẫu này
            </button>
        </main>
    );
}