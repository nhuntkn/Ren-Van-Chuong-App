"use client";
import { useState } from "react";
import { fileToImage, resizeToDataURL, computeHashAndColor } from "@/lib/imageHash";

export function useScanImageLogic() {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handlePhotoCapture(file) {
        setError("");
        setMatches([]);
        setLoading(true);
        try {
            const img = await fileToImage(file);
            setPreviewUrl(resizeToDataURL(img, 800, 0.85));
            const feature = computeHashAndColor(img);

            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feature),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "So khớp thất bại.");
            setMatches(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { previewUrl, matches, loading, error, handlePhotoCapture };
}