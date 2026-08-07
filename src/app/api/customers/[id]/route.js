import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServerClient";
import { triggerCustomerSync } from "@/lib/syncHelper";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabaseServer.from("customers").select("*").eq("id", id).maybeSingle();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!data) return Response.json({ error: "Không tìm thấy khách hàng." }, { status: 404 });

    return Response.json({
        id: data.id,
        name: data.name,
        phone: data.phone,
        address: data.address,
        customerType: data.customer_type,
        occupation: data.occupation,
        note: data.note,
        lastPurchaseAt: data.last_purchase_at,
    });
}

export async function PATCH(request, { params }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được sửa khách hàng." }, { status: 403 });
    }

    const body = await request.json();
    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.customerType !== undefined) updateData.customer_type = body.customerType;
    if (body.occupation !== undefined) updateData.occupation = body.occupation;
    if (body.note !== undefined) updateData.note = body.note;
    if (body.lastPurchaseAt !== undefined) updateData.last_purchase_at = body.lastPurchaseAt;

    const { error } = await supabaseServer.from("customers").update(updateData).eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    await triggerCustomerSync();
    return Response.json({ success: true });
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được xóa khách hàng." }, { status: 403 });
    }

    const { error } = await supabaseServer.from("customers").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    await triggerCustomerSync();
    return Response.json({ success: true });
}