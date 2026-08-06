"use client";
import { useState } from "react";
import Link from "next/link";
import { useScanImageLogic } from "./scan-image.logic";
import { useScanQrLogic } from "../quet-ma/scan-qr.logic";
import PhotoCapture from "@/components/photoCapture";
import SpoolMatchBadge from "@/components/spoolMatchBadge";
import QrScannerView from "@/components/qrScannerView";
import LocationPill from "@/components/locationPill";

export default function ScanPage() {
    const [mode, setMode] = useState("photo"); // "photo" | "qr"

    const { previewUrl, matches, loading: photoLoading, error: photoError, handlePhotoCapture } = useScanImageLogic();
    const { container, items, loading: qrLoading, error: qrError, handleScan } = useScanQrLogic();

    return (
        <main className="px-4 py-5">
            <h1 className="text-lg font-semibold mb-3">Quét</h1>

            <div className="flex border border-border rounded-md overflow-hidden mb-4 text-sm">
                <button
                    onClick={() => setMode("photo")}
                    className={`flex-1 py-2 font-medium ${mode === "photo" ? "bg-accent text-white" : "bg-white text-ink-soft"}`}
                >
                    Quét ảnh
                </button>
                <button
                    onClick={() => setMode("qr")}
                    className={`flex-1 py-2 font-medium ${mode === "qr" ? "bg-accent text-white" : "bg-white text-ink-soft"}`}
                >
                    Quét mã QR
                </button>
            </div>

            {mode === "photo" && (
                <>
                    <PhotoCapture previewUrl={previewUrl} onCapture={handlePhotoCapture} placeholder="Chạm để chụp/tải ảnh mẫu cần tìm" />

                    {photoLoading && <p className="text-ink-soft text-sm mt-3 text-center">Đang so khớp...</p>}
                    {photoError && <p className="text-red-500 text-sm mt-3">{photoError}</p>}

                    {!photoLoading && !photoError && previewUrl && matches.length === 0 && (
                        <p className="text-ink-soft text-sm mt-4 text-center">
                            Không tìm thấy mẫu nào để so khớp. Có thể kho chưa có mẫu nào lưu ảnh, hoặc chưa đủ giống.
                        </p>
                    )}

                    {matches.length > 0 && (
                        <div className="mt-4">
                            <p className="text-[12px] text-ink-soft mb-2">Mẫu gần giống nhất</p>
                            <div className="flex flex-col gap-2">
                                {matches.map((m) => (
                                    <Link key={m.id} href={`/kho-hang/${m.id}`} className="flex items-center gap-3 border border-border rounded-lg px-3 py-2">
                                        <div className="w-16 h-16 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
                                            {m.imageUrl && <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium truncate">{m.name}</p>
                                        </div>
                                        <SpoolMatchBadge percent={m.score} size={40} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {mode === "qr" && (
                <>
                    {!container && <QrScannerView onScan={handleScan} />}

                    {qrLoading && <p className="text-ink-soft text-sm mt-3">Đang tra cứu...</p>}
                    {qrError && <p className="text-red-500 text-sm mt-3">{qrError}</p>}

                    {container && (
                        <div className="mt-3">
                            <div className="bg-accent-soft rounded-lg p-3 mb-3">
                                <p className="font-mono text-sm font-semibold text-accent-dark">Bao: {container.id}</p>
                                <div className="mt-1">
                                    <LocationPill zone={container.zone} shelf={container.shelf} isMixed={container.type === "mixed"} />
                                </div>
                            </div>

                            <p className="text-[12px] text-ink-soft mb-2">Mẫu trong bao này</p>
                            <div className="flex flex-col gap-2">
                                {items.map((it) => (
                                    <Link key={it.itemId} href={`/kho-hang/${it.itemId}`} className="flex items-center gap-3 border border-border rounded-lg px-3 py-2">
                                        <div className="w-16 h-16 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
                                            {it.imageUrl && <img src={it.imageUrl} alt={it.itemCode} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{it.itemCode || it.name}</p>
                                            <p className="text-[12px] text-ink-soft">{it.qty} {it.unit}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <Link href={`/vat-chua/${container.id}`} className="block text-center border border-border rounded-md py-2.5 text-sm mt-3">
                                Xem/Chỉnh sửa bao này
                            </Link>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}