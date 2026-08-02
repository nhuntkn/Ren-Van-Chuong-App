import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data: links, error: linksError } = await supabaseServer
        .from("container_items")
        .select("item_id, qty")
        .eq("container_id", id);

    if (linksError) return Response.json({ error: linksError.message }, { status: 500 });
    if (!links || links.length === 0) return Response.json([]);

    const itemIds = links.map((l) => l.item_id);
    const { data: itemsData, error: itemsError } = await supabaseServer
        .from("items")
        .select("id, item_code, name, unit, image_url")
        .in("id", itemIds);

    if (itemsError) return Response.json({ error: itemsError.message }, { status: 500 });

    const itemMap = Object.fromEntries(itemsData.map((it) => [it.id, it]));

    const result = links.map((link) => {
        const it = itemMap[link.item_id] || {};
        return {
            itemId: link.item_id,
            itemCode: it.item_code,
            name: it.name,
            unit: it.unit,
            imageUrl: it.image_url,
            qty: link.qty,
        };
    });

    return Response.json(result);
}

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

export async function PATCH(request, { params }) {
    const { id: containerId } = await params;

    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được lấy hàng ra khỏi bao." }, { status: 403 });
    }

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