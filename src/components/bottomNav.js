"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/kho-hang", label: "Kho hàng", icon: "list" },
    { href: "/quet-anh", label: "Quét ảnh", icon: "scan" },
    { href: "/vat-chua", label: "Vật chứa", icon: "box" },
    { href: "/them-mau", label: "Thêm mẫu", icon: "plus" },
];

const ICONS = {
    list: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[20px] h-[20px]">
            <rect x="3" y="4" width="18" height="4" rx="1" />
            <rect x="3" y="10" width="18" height="4" rx="1" />
            <rect x="3" y="16" width="18" height="4" rx="1" />
        </svg>
    ),
    scan: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[20px] h-[20px]">
            <path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M20 8V6a2 2 0 0 0-2-2h-2M20 16v2a2 2 0 0 1-2 2h-2" />
            <circle cx="12" cy="12" r="3.4" />
        </svg>
    ),
    box: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[20px] h-[20px]">
            <path d="M3 7l9-4 9 4-9 4-9-4Z" />
            <path d="M3 7v10l9 4 9-4V7" />
            <path d="M12 11v10" />
        </svg>
    ),
    plus: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[20px] h-[20px]">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" />
        </svg>
    ),
};

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex max-w-[480px] mx-auto z-10">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] ${
                            isActive ? "text-accent font-semibold" : "text-ink-soft"
                        }`}
                    >
                        {ICONS[item.icon]}
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}