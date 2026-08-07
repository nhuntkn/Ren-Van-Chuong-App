"use client";
import { useItemDetailLogic } from "./item-detail.logic";
import ContainerBreakdownList from "@/components/containerBreakdownList";
import CreateContainerForm from "@/components/createContainerForm";

export default function ItemDetailPage() {
    const {
        item, containers, loading, error, load,
        priceForm, setPriceForm, savePriceInfo, savingPrice,
        togglePublish, publishLoading,
        deleteItem,
        isEditingNote, noteInput, setNoteInput, startEditNote, cancelEditNote, saveNote, savingNote,
        role,
        allItems, showCreateContainer, setShowCreateContainer,
        changePhoto, changingPhoto,
        colorOptions, widthOptions,
        movements,
    } = useItemDetailLogic();

    if (loading) return <main className="px-4 py-5 text-ink-soft text-sm">Đang tải...</main>;
    if (!item) return <main className="px-4 py-5 text-sm">{error || "Không tìm thấy mẫu."}</main>;

    return (
        <main className="px-4 py-5">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-alt mb-2">
                {item.imageUrl && <img src={item.imageUrl} alt={item.itemCode} className="w-full h-full object-cover" />}
            </div>
            <label className="block text-center text-[12px] text-accent-dark font-medium mb-3 cursor-pointer">
                {changingPhoto ? "Đang cập nhật ảnh..." : "Đổi ảnh khác"}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && changePhoto(e.target.files[0])}
                />
            </label>

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

            {(item.fabricWidth || item.conversionInfo || item.wholesalePrice) && (
                <div className="bg-surface-alt rounded-lg p-3 mb-4">
                    <p className="text-[12px] text-ink-soft mb-2">Thông tin quy cách</p>
                    <div className="flex flex-col gap-1.5 text-[13.5px]">
                        {item.fabricWidth && (
                            <div className="flex justify-between">
                                <span className="text-ink-soft">Khổ</span>
                                <span className="font-medium">{item.fabricWidth}</span>
                            </div>
                        )}
                        {item.conversionInfo && (
                            <div className="flex justify-between">
                                <span className="text-ink-soft">Quy đổi</span>
                                <span className="font-medium">{item.conversionInfo}</span>
                            </div>
                        )}
                        {item.wholesalePrice && (
                            <div className="flex justify-between">
                                <span className="text-ink-soft">Giá sỉ 1kg (₫)</span>
                                <span className="font-medium">{Number(item.wholesalePrice).toLocaleString("vi-VN")}₫</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                            <button onClick={saveNote} disabled={savingNote} className="flex-1 bg-accent text-white text-sm font-semibold py-2 rounded-md disabled:opacity-60">
                                {savingNote ? "Đang lưu..." : "Lưu"}
                            </button>
                            <button onClick={cancelEditNote} className="flex-1 border border-border text-sm py-2 rounded-md">
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

            {movements.length > 0 && (
                <div className="mt-4">
                    <p className="text-[12px] text-ink-soft mb-2">Lịch sử nhập/xuất gần đây</p>
                    <div className="flex flex-col gap-1.5">
                        {movements.map((m) => (
                            <div key={m.id} className="flex justify-between text-[12.5px] border-b border-border pb-1.5">
                                <span className={m.type === "in" ? "text-sage" : "text-red-500"}>
                                    {m.type === "in" ? "+ Nhập" : "− Xuất"} {m.qty}
                                </span>
                                <span className="text-ink-faint">
                                    {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {role === "admin" && (
                <div className="bg-surface-alt rounded-lg p-3 mt-5">
                    <p className="text-[12px] text-ink-soft mb-2">Giá &amp; thông tin nội bộ</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                            <input
                                type="text"
                                list="width-options-detail"
                                placeholder="Khổ (VD: 1.5cm)"
                                value={priceForm.fabricWidth}
                                onChange={(e) => setPriceForm({ ...priceForm, fabricWidth: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm"
                            />
                            <datalist id="width-options-detail">
                                {widthOptions.map((w) => <option key={w} value={w} />)}
                            </datalist>
                        </div>
                        <input
                            type="text"
                            placeholder="Quy đổi (VD: 1kg = 100m)"
                            value={priceForm.conversionInfo}
                            onChange={(e) => setPriceForm({ ...priceForm, conversionInfo: e.target.value })}
                            className="px-3 py-2 border border-border rounded-md text-sm"
                        />
                        </div>

                        <input
                            type="text"
                            placeholder="Nhà cung cấp"
                            value={priceForm.supplier}
                            onChange={(e) => setPriceForm({ ...priceForm, supplier: e.target.value })}
                            className="px-3 py-2 border border-border rounded-md text-sm"
                        />
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div>
                                <label className="text-[11px] text-ink-faint block mb-1">Giá nhập</label>
                                <input
                                    type="number"
                                    value={priceForm.costPrice}
                                    onChange={(e) => setPriceForm({ ...priceForm, costPrice: e.target.value })}
                                    className="w-full px-2 py-2 border border-border rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-ink-faint block mb-1">Giá sỉ 1kg (₫)</label>
                                <input
                                    type="number"
                                    value={priceForm.wholesalePrice}
                                    onChange={(e) => setPriceForm({ ...priceForm, wholesalePrice: e.target.value })}
                                    className="w-full px-2 py-2 border border-border rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-ink-faint block mb-1">Giá lẻ</label>
                                <input
                                    type="number"
                                    value={priceForm.price}
                                    onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
                                    className="w-full px-2 py-2 border border-border rounded-md text-sm"
                                />
                            </div>
                        </div>
                        <button onClick={savePriceInfo} disabled={savingPrice} className="w-full bg-accent text-white text-sm font-semibold py-2 rounded-md disabled:opacity-60">
                            {savingPrice ? "Đang lưu..." : "Lưu thông tin giá"}
                        </button>
                    </div>
                )}

            {role === "admin" && (
                <div className="bg-surface-alt rounded-lg p-3 mt-3">
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