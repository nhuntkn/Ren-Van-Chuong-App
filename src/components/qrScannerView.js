"use client";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function QrScannerView({ onScan }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [error, setError] = useState("");
    const [manualCode, setManualCode] = useState("");

    useEffect(() => {
        let stream;
        let rafId;
        let stopped = false;

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    tick();
                }
            } catch (err) {
                setError("Không thể truy cập camera. Kiểm tra quyền camera của trình duyệt.");
            }
        }

        function tick() {
            if (stopped) return;
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code?.data) {
                    const match = code.data.match(/\/vat-chua\/([\w-]+)/);
                    onScan(match ? match[1] : code.data);
                    return; // dừng quét sau khi tìm thấy
                }
            }
            rafId = requestAnimationFrame(tick);
        }

        startCamera();
        return () => {
            stopped = true;
            if (rafId) cancelAnimationFrame(rafId);
            if (stream) stream.getTracks().forEach((track) => track.stop());
        };
    }, [onScan]);

    function handleManualSubmit(e) {
        e.preventDefault();
        if (manualCode.trim()) onScan(manualCode.trim());
    }

    return (
        <div>
            <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
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