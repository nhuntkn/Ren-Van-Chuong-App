import { supabaseServer } from "@/lib/supabaseServerClient";

export async function buildCustomerRows() {
    const { data, error } = await supabaseServer.from("customers").select("*");
    if (error) throw new Error(error.message);

    return data.map((c) => ({
        name: c.name,
        phone: c.phone || "",
        address: c.address || "",
        customerType: c.customer_type || "",
        occupation: c.occupation || "",
        note: c.note || "",
        lastPurchaseAt: c.last_purchase_at,
    }));
}