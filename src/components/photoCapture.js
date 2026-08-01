"use client";
import { useState } from "react";

export default function PhotoCapture({ previewUrl, onCapture, placeholder = "Chạm để chụp ảnh" }) {
    const [inputKey, setInputKey] = useState(0);

    function handleChange(e) {
        const file = e.target.files?.[0];
        if (file) onCapture(file);
        setInputKey((k) => k + 1); // reset input để chọn lại cùng 1 file vẫn kích hoạt onChange
    }

    return (
        <div>
            <label className="block aspect-square max-h-[220px] border-[1.5px] border-dashed border-ink-faint rounded-lg bg-surface-alt overflow-hidden cursor-pointer">
                {previewUrl ? (
                    <img src={previewUrl} alt="Ảnh mẫu" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center text-ink-faint text-[13px] gap-1.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
                            <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
                            <circle cx="12" cy="13" r="3.5" />
                        </svg>
                        {placeholder}
                    </div>
                )}
                <input
                    key={inputKey}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleChange}
                />
            </label>
        </div>
    );
}