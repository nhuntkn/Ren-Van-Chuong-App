"use client";
import { useState, useEffect, useCallback } from "react";

export function useCustomerListLogic() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            const res = await fetch(`/api/customers?${params.toString()}`);
            const data = await res.json();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timeout = setTimeout(fetchCustomers, 300);
        return () => clearTimeout(timeout);
    }, [fetchCustomers]);

    useEffect(() => {
        fetch("/api/me").then((r) => r.json()).then((d) => setRole(d.role)).catch(() => setRole(null));
    }, []);

    return { customers, search, setSearch, loading, role, refetch: fetchCustomers };
}