"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearRoleCookie } from "@/lib/roleCookie";

const ALL_NAV_ITEMS = [
    { href: "/kho-hang", label: "Kho hàng", icon: "list", adminOnly: false },
    { href: "/quet-anh", label: "Quét ảnh", icon: "scan", adminOnly: false },
    { href: "/vat-chua", label: "Vật chứa", icon: "box", adminOnly: false },
    { href: "/them-mau", label: "Thêm mẫu", icon: "plus", adminOnly: true },
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
    const router = useRouter();
    const [role, setRole] = useState(null);

    useEffect(() => {
        fetch("/api/me")
            .then((r) => r.json())
            .then((d) => setRole(d.role))
            .catch(() => setRole(null));
    }, []);

    if (pathname === "/login") return null;

    const navItems = ALL_NAV_ITEMS.filter((item) => !item.adminOnly || role === "admin");

    function handleLogout() {
        clearRoleCookie();
        router.push("/login");
        router.refresh();
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex max-w-[480px] mx-auto z-10">
            {navItems.map((item) => {
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
            <button
                onClick={handleLogout}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] text-ink-soft"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[20px] h-[20px]">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                </svg>
                Đổi vai trò
            </button>
        </nav>
    );
}