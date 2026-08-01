import { supabase } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabase
        .from("items")
        .select("*, colors(code, name, hex), item_stock_totals(total_stock)")
        .eq("id", id)
        .maybeSingle();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!data) return Response.json({ error: "Không tìm thấy mẫu hàng." }, { status: 404 });

    return Response.json({
        id: data.id,
        name: data.name,
        category: data.category,
        colorCode: data.colors?.code || null,
        colorName: data.colors?.name || null,
        colorHex: data.colors?.hex || null,
        unit: data.unit,
        note: data.note,
        imageUrl: data.image_url,
        isPublished: data.is_published,
        totalStock: data.item_stock_totals?.[0]?.total_stock || 0,
    });
}

export async function PATCH(request, { params }) {
    const { id } = await params;
    const body = await request.json();

    const { error } = await supabaseServer
        .from("items")
        .update({
            name: body.name,
            category: body.category,
            color_code: body.colorCode,
            unit: body.unit,
            note: body.note,
            is_published: body.isPublished,
            price: body.price,
        })
        .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    const { error } = await supabaseServer.from("items").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
}