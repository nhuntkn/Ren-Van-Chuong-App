"use client";
import { useEffect, useRef, useState } from "react";

export default function QrScannerView({ onScan }) {
    const videoRef = useRef(null);
    const [error, setError] = useState("");
    const [manualCode, setManualCode] = useState("");

    useEffect(() => {
        let stream;
        let animationId;

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
                // Lưu ý: việc giải mã QR thực tế cần thư viện chuyên dụng
                // (ví dụ jsQR hoặc html5-qrcode) chạy trên từng khung hình video.
                // Phần đó sẽ thêm khi viết scan-qr.logic.js ở Bước 6.
            } catch (err) {
                setError("Không thể truy cập camera. Kiểm tra quyền camera của trình duyệt.");
            }
        }

        startCamera();

        return () => {
            if (stream) stream.getTracks().forEach((track) => track.stop());
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, []);

    function handleManualSubmit(e) {
        e.preventDefault();
        if (manualCode.trim()) onScan(manualCode.trim());
    }

    return (
        <div>
            <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[13px] text-center px-4">
                        {error}
                    </div>
                )}
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2 mt-3">
                <input
                    type="text"
                    placeholder="Hoặc nhập mã bao thủ công (bag-0201)"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md text-[13px]"
                />
                <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md text-[13px] font-semibold">
                    Tra cứu
                </button>
            </form>
        </div>
    );
}