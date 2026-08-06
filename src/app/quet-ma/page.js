"use client";
import Link from "next/link";
import { useScanQrLogic } from "./scan-qr.logic";
import QrScannerView from "@/components/qrScannerView";
import LocationPill from "@/components/locationPill";

export default function ScanQrPage() {
    const { container, items, loading, error, handleScan } = useScanQrLogic();

    return (
        <main className="px-4 py-5">
            <h1 className="text-lg font-semibold mb-3">Quét mã QR</h1>

            {!container && <QrScannerView onScan={handleScan} />}

            {loading && <p className="text-ink-soft text-sm mt-3">Đang tra cứu...</p>}
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

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
                                <div className="w-11 h-11 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
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
        </main>
    );
}