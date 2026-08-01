import { supabase } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabase
        .from("container_items")
        .select("qty, items(id, name, unit, image_url)")
        .eq("container_id", id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const items = data.map((row) => ({
        itemId: row.items.id,
        name: row.items.name,
        unit: row.items.unit,
        imageUrl: row.items.image_url,
        qty: row.qty,
    }));

    return Response.json(items);
}

// Thêm mẫu vào bao (cộng dồn nếu mẫu đó đã có sẵn trong bao)
export async function POST(request, { params }) {
    const { id: containerId } = await params;
    const body = await request.json();
    const { itemId, qty } = body;

    if (!itemId || !qty || qty <= 0) {
        return Response.json({ error: "Thiếu mẫu hàng hoặc số lượng không hợp lệ." }, { status: 400 });
    }

    const { data: existing } = await supabaseServer
        .from("container_items")
        .select("id, qty")
        .eq("container_id", containerId)
        .eq("item_id", itemId)
        .maybeSingle();

    if (existing) {
        const { error } = await supabaseServer
            .from("container_items")
            .update({ qty: existing.qty + Number(qty) })
            .eq("id", existing.id);
        if (error) return Response.json({ error: error.message }, { status: 500 });
    } else {
        const { error } = await supabaseServer
            .from("container_items")
            .insert({ container_id: containerId, item_id: itemId, qty: Number(qty) });
        if (error) return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
}

// Lấy bớt/lấy hết mẫu ra khỏi bao
export async function PATCH(request, { params }) {
    const { id: containerId } = await params;
    const body = await request.json();
    const { itemId, qtyToRemove } = body;

    const { data: existing, error: fetchError } = await supabaseServer
        .from("container_items")
        .select("id, qty")
        .eq("container_id", containerId)
        .eq("item_id", itemId)
        .maybeSingle();

    if (fetchError) return Response.json({ error: fetchError.message }, { status: 500 });
    if (!existing) return Response.json({ error: "Mẫu này không có trong bao." }, { status: 404 });

    const remaining = existing.qty - Number(qtyToRemove);

    if (remaining <= 0) {
        const { error } = await supabaseServer.from("container_items").delete().eq("id", existing.id);
        if (error) return Response.json({ error: error.message }, { status: 500 });
    } else {
        const { error } = await supabaseServer
            .from("container_items")
            .update({ qty: remaining })
            .eq("id", existing.id);
        if (error) return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, remaining: Math.max(0, remaining) });
}