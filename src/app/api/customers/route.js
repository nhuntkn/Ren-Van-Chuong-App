import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServerClient";
import { triggerCustomerSync } from "@/lib/syncHelper";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabaseServer.from("customers").select("*").order("created_at", { ascending: false });

    if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json(data.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        address: c.address,
        customerType: c.customer_type,
        occupation: c.occupation,
        note: c.note,
        lastPurchaseAt: c.last_purchase_at,
    })));
}

export async function POST(request) {
    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được thêm khách hàng." }, { status: 403 });
    }

    const body = await request.json();
    const { name, phone, address, customerType, occupation, note } = body;

    if (!name?.trim()) {
        return Response.json({ error: "Thiếu tên khách hàng." }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from("customers")
        .insert({
            name: name.trim(),
            phone: phone?.trim() || null,
            address: address?.trim() || null,
            customer_type: customerType?.trim() || null,
            occupation: occupation?.trim() || null,
            note: note?.trim() || null,
        })
        .select()
        .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    await triggerCustomerSync();
    return Response.json({ id: data.id });
}