import { cookies } from "next/headers";
import { ROLE_COOKIE } from "@/lib/roleCookie";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabaseServer
        .from("items")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!data) return Response.json({ error: "Không tìm thấy mẫu hàng." }, { status: 404 });

    const { data: stockRow } = await supabaseServer
        .from("item_stock_totals")
        .select("total_stock")
        .eq("item_id", id)
        .maybeSingle();

    return Response.json({
        id: data.id,
        itemCode: data.item_code,
        name: data.name,
        category: data.category,
        color: data.color,
        unit: data.unit,
        note: data.note,
        imageUrl: data.image_url,
        isPublished: data.is_published,
        price: data.price,
        totalStock: stockRow?.total_stock || 0,
    });
}

export async function PATCH(request, { params }) {
    const { id } = await params;
    const body = await request.json();

    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.note !== undefined) updateData.note = body.note;
    if (body.isPublished !== undefined) updateData.is_published = body.isPublished;
    if (body.price !== undefined) updateData.price = body.price;

    const { error } = await supabaseServer
        .from("items")
        .update(updateData)
        .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
}

export async function DELETE(request, { params }) {
    const { id } = await params;

    const cookieStore = await cookies();
    const role = cookieStore.get(ROLE_COOKIE)?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được xóa mẫu." }, { status: 403 });
    }

    const { error } = await supabaseServer.from("items").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
}