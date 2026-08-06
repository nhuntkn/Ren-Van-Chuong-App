"use client";
import { useState } from "react";
import { useContainerDetailLogic } from "./container-detail.logic";
import LocationPill from "@/components/LocationPill";

export default function ContainerDetailPage() {
    const {
        container, items, allItems, loading, error,
        addItemToContainer, removeItemFromContainer, deleteContainer, role,
        isEditingLocation, locationForm, setLocationForm, startEditLocation, cancelEditLocation, saveLocation, savingLocation,
    } = useContainerDetailLogic();

    const [selectedItemId, setSelectedItemId] = useState("");
    const [addQty, setAddQty] = useState("");
    const [removeQtyMap, setRemoveQtyMap] = useState({});

    if (loading) return <main className="px-4 py-5 text-ink-soft text-sm">Đang tải...</main>;
    if (!container) return <main className="px-4 py-5 text-sm">Không tìm thấy bao hàng.</main>;

    async function handleAdd() {
        if (!selectedItemId || !addQty) return;
        await addItemToContainer(selectedItemId, Number(addQty));
        setSelectedItemId("");
        setAddQty("");
    }

    async function handleRemove(itemId, maxQty) {
        const inputVal = removeQtyMap[itemId];
        const qtyToRemove = inputVal ? Number(inputVal) : maxQty;
        if (qtyToRemove <= 0 || qtyToRemove > maxQty) {
            alert(`Số lượng lấy ra phải từ 1 đến ${maxQty}.`);
            return;
        }
        await removeItemFromContainer(itemId, qtyToRemove);
        setRemoveQtyMap((prev) => ({ ...prev, [itemId]: "" }));
    }

    function handleDelete() {
        if (items.length > 0) {
            alert("Bao này vẫn còn hàng bên trong. Vui lòng bấm 'Lấy ra' cho từng mẫu trước khi xóa bao.");
            return;
        }
        if (confirm("Xóa bao này? Hành động không thể hoàn tác.")) {
            deleteContainer();
        }
    }

    function handlePrintQr() {
        const printWindow = window.open("", "_blank", "width=500,height=650");
        printWindow.document.write(`
            <html>
            <head>
                <title>In mã QR - ${container.id}</title>
                <style>
                    body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: monospace; }
                    img { width: 480px; height: 480px; }
                    p { font-size: 20px; margin-top: 14px; }
                </style>
            </head>
            <body>
                <img src="${container.qrDataUrl}" />
                <p>${container.id}</p>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    }

    return (
        <main className="px-4 py-5">
            <p className="font-mono text-lg font-semibold">{container.id}</p>

            <div className="mb-4 mt-1">
                {isEditingLocation ? (
                    <div className="bg-surface-alt rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input
                                placeholder="Khu vực"
                                value={locationForm.zone}
                                onChange={(e) => setLocationForm({ ...locationForm, zone: e.target.value })}
                                className="px-3 py-2 border border-border rounded-md text-sm"
                            />
                            <input
                                placeholder="Kệ"
                                value={locationForm.shelf}
                                onChange={(e) => setLocationForm({ ...locationForm, shelf: e.target.value })}
                                className="px-3 py-2 border border-border rounded-md text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={saveLocation}
                                disabled={savingLocation}
                                className="flex-1 bg-accent text-white text-sm font-semibold py-2 rounded-md disabled:opacity-60"
                            >
                                {savingLocation ? "Đang lưu..." : "Lưu"}
                            </button>
                            <button onClick={cancelEditLocation} className="flex-1 border border-border text-sm py-2 rounded-md">
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <LocationPill zone={container.zone} shelf={container.shelf} isMixed={container.type === "mixed"} />
                        {role === "admin" && (
                            <button onClick={startEditLocation} className="text-[11px] text-accent-dark font-medium">
                                Sửa
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white border border-border rounded-lg p-4 mb-4 text-center">
                {container.qrDataUrl ? (
                    <img src={container.qrDataUrl} alt={`Mã QR ${container.id}`} className="w-40 h-40 mx-auto" />
                ) : (
                    <p className="text-ink-soft text-sm">Đang tạo mã QR...</p>
                )}
                <p className="font-mono text-sm mt-2">{container.id}</p>
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex flex-col gap-2 mb-4">
                {items.length === 0 && <p className="text-ink-soft text-sm">Bao này đang trống.</p>}
                {items.map((it) => (
                    <div key={it.itemId} className="border border-border rounded-lg px-3 py-2.5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{it.itemCode || it.name}</span>
                            <span className="text-[13px] text-ink-soft">Hiện có: {it.qty} {it.unit}</span>
                        </div>
                        {role === "admin" && (
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max={it.qty}
                                    placeholder={`Số lượng (tối đa ${it.qty})`}
                                    value={removeQtyMap[it.itemId] || ""}
                                    onChange={(e) => setRemoveQtyMap((prev) => ({ ...prev, [it.itemId]: e.target.value }))}
                                    className="flex-1 px-3 py-1.5 border border-border rounded-md text-sm"
                                />
                                <button onClick={() => handleRemove(it.itemId, it.qty)} className="text-[12px] text-white bg-red-500 font-medium px-3 rounded-md">
                                    Lấy ra
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-surface-alt rounded-lg p-3">
                <p className="text-[12px] text-ink-soft mb-2">Thêm mẫu vào bao này</p>
                <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2">
                    <option value="">Chọn mẫu hàng...</option>
                    {allItems.map((it) => <option key={it.id} value={it.id}>{it.itemCode || it.name}</option>)}
                </select>
                <div className="flex gap-2">
                    <input type="number" placeholder="Số lượng" value={addQty} onChange={(e) => setAddQty(e.target.value)} className="flex-1 px-3 py-2 border border-border rounded-md text-sm" />
                    <button onClick={handleAdd} className="bg-accent text-white px-4 rounded-md text-sm font-semibold">Thêm</button>
                </div>
            </div>

            <button onClick={handlePrintQr} className="w-full mt-3 border border-border rounded-md py-2.5 text-sm">
                In lại mã QR
            </button>

            {role === "admin" && (
                <button onClick={handleDelete} className="w-full mt-3 text-red-500 text-sm font-medium py-2">
                    Xóa bao này
                </button>
            )}
        </main>
    );
}