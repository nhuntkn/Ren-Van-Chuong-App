"use client";
import { useItemDetailLogic } from "./item-detail.logic";
import ContainerBreakdownList from "@/components/containerBreakdownList";
import CreateContainerForm from "@/components/createContainerForm";

export default function ItemDetailPage() {
    const {
        item, containers, loading, error, load,
        priceInput, setPriceInput, togglePublish, publishLoading,
        deleteItem,
        isEditingNote, noteInput, setNoteInput, startEditNote, cancelEditNote, saveNote, savingNote,
        role,
        allItems, showCreateContainer, setShowCreateContainer,
    } = useItemDetailLogic();

    if (loading) return <main className="px-4 py-5 text-ink-soft text-sm">Đang tải...</main>;
    if (!item) return <main className="px-4 py-5 text-sm">{error || "Không tìm thấy mẫu."}</main>;

    return (
        <main className="px-4 py-5">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-alt mb-3">
                {item.imageUrl && <img src={item.imageUrl} alt={item.itemCode} className="w-full h-full object-cover" />}
            </div>

            <p className="font-mono text-lg font-semibold">{item.itemCode}</p>
            {item.name && <p className="text-[14px] text-ink-soft">{item.name}</p>}

            <div className="flex flex-wrap gap-2 mt-2 mb-4">
                <span className="text-[12px] bg-sage-soft text-sage px-2.5 py-1 rounded-full">{item.category}</span>
                {item.color && (
                    <span className="text-[12px] bg-surface-alt text-ink-soft px-2.5 py-1 rounded-full">{item.color}</span>
                )}
            </div>

            <div className="bg-surface-alt rounded-lg p-3 mb-4 flex justify-between items-center">
                <span className="text-sm">Tổng tồn kho</span>
                <span className="text-lg font-semibold">{item.totalStock} {item.unit}</span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[12px] text-ink-soft">Ghi chú</p>
                    {!isEditingNote && (
                        <button onClick={startEditNote} className="text-[11px] text-accent-dark font-medium">
                            {item.note ? "Sửa" : "+ Thêm ghi chú"}
                        </button>
                    )}
                </div>

                {isEditingNote ? (
                    <div>
                        <textarea
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm min-h-[80px]"
                            placeholder="Ghi chú về mẫu này..."
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={saveNote}
                                disabled={savingNote}
                                className="flex-1 bg-accent text-white text-sm font-semibold py-2 rounded-md disabled:opacity-60"
                            >
                                {savingNote ? "Đang lưu..." : "Lưu"}
                            </button>
                            <button
                                onClick={cancelEditNote}
                                className="flex-1 border border-border text-sm py-2 rounded-md"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    item.note && <p className="text-[13.5px] whitespace-pre-line">{item.note}</p>
                )}
            </div>

            <div className="flex justify-between items-center mb-2">
                <h2 className="text-[13px] font-semibold text-ink-soft">Nằm trong {containers.length} bao</h2>
                {role === "admin" && (
                    <button onClick={() => setShowCreateContainer((v) => !v)} className="text-[11px] text-accent-dark font-medium">
                        + Tạo bao mới
                    </button>
                )}
            </div>

            {role === "admin" && showCreateContainer && (
                <CreateContainerForm
                    allItems={allItems}
                    presetItem={{ id: item.id, itemCode: item.itemCode }}
                    onCreated={load}
                />
            )}

            <ContainerBreakdownList containers={containers} />

            {role === "admin" && (
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
            )}

            {role === "staff" && item.isPublished && (
                <p className="text-[12px] text-sage mt-3">
                    Đang bán với giá {Number(item.price).toLocaleString("vi-VN")}₫
                </p>
            )}

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            {role === "admin" && (
                <button onClick={deleteItem} className="w-full mt-4 text-red-500 text-sm font-medium py-2">
                    Xóa mẫu này
                </button>
            )}
        </main>
    );
}