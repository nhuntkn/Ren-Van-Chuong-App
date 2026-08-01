"use client";
import Link from "next/link";
import { useScanImageLogic } from "./scan-image.logic";
import PhotoCapture from "@/components/photoCapture";
import SpoolMatchBadge from "@/components/spoolMatchBadge";

export default function ScanImagePage() {
    const { previewUrl, matches, loading, error, handlePhotoCapture } = useScanImageLogic();

    return (
        <main className="px-4 py-5">
            <h1 className="text-lg font-semibold mb-3">Quét ảnh</h1>

            <PhotoCapture previewUrl={previewUrl} onCapture={handlePhotoCapture} placeholder="Chạm để chụp/tải ảnh mẫu cần tìm" />

            {loading && <p className="text-ink-soft text-sm mt-3 text-center">Đang so khớp...</p>}
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            {matches.length > 0 && (
                <div className="mt-4">
                    <p className="text-[12px] text-ink-soft mb-2">Mẫu gần giống nhất</p>
                    <div className="flex flex-col gap-2">
                        {matches.map((m) => (
                            <Link key={m.id} href={`/kho-hang/${m.id}`} className="flex items-center gap-3 border border-border rounded-lg px-3 py-2">
                                <div className="w-11 h-11 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
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
        </main>
    );
}