"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setRoleCookie } from "@/lib/roleCookie";

export function useLoginLogic() {
    const router = useRouter();
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function enterAsStaff() {
        setRoleCookie("staff");
        router.push("/kho-hang");
        router.refresh();
    }

    function clickAdmin() {
        setShowPasswordInput(true);
        setError("");
    }

    async function submitAdminPassword(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/verify-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (!data.success) {
                setError("Sai mật khẩu.");
                setPassword("");
                return;
            }
            router.push("/kho-hang");
            router.refresh();
        } catch (err) {
            setError("Có lỗi xảy ra, thử lại.");
        } finally {
            setSubmitting(false);
        }
    }

    function cancelAdmin() {
        setShowPasswordInput(false);
        setPassword("");
        setError("");
    }

    return { showPasswordInput, password, setPassword, error, submitting, enterAsStaff, clickAdmin, submitAdminPassword, cancelAdmin };
}