import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let query = supabaseServer.from("stock_movements").select("*").order("created_at", { ascending: false }).limit(limit);

    if (itemId) query = query.eq("item_id", itemId);

    const { data, error } = await query;
    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json(data.map((m) => ({
        id: m.id,
        itemCode: m.item_code,
        containerId: m.container_id,
        type: m.movement_type,
        qty: m.qty,
        note: m.note,
        createdAt: m.created_at,
    })));
}