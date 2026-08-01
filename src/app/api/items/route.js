import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabaseServer.from("items").select("*");
    if (search) {
        query = query.or(`item_code.ilike.%${search}%,color.ilike.%${search}%`);
    }

    const { data: itemsData, error: itemsError } = await query.order("created_at", { ascending: false });
    if (itemsError) return Response.json({ error: itemsError.message }, { status: 500 });

    const { data: stockData, error: stockError } = await supabaseServer
        .from("item_stock_totals")
        .select("item_id, total_stock");
    if (stockError) return Response.json({ error: stockError.message }, { status: 500 });

    const stockMap = Object.fromEntries((stockData || []).map((s) => [s.item_id, s.total_stock]));

    const items = itemsData.map((item) => ({
        id: item.id,
        itemCode: item.item_code,
        name: item.name,
        category: item.category,
        color: item.color,
        unit: item.unit,
        note: item.note,
        imageUrl: item.image_url,
        isPublished: item.is_published,
        totalStock: stockMap[item.id] || 0,
    }));

    return Response.json(items);
}

export async function POST(request) {
    const body = await request.json();
    const { itemCode, category, color, unit, note, imageUrl, hash, avgColor } = body;

    if (!itemCode?.trim()) {
        return Response.json({ error: "Thiếu mã mẫu." }, { status: 400 });
    }
    if (!category?.trim()) {
        return Response.json({ error: "Thiếu loại mẫu hàng." }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from("items")
        .insert({
            item_code: itemCode.trim(),
            category,
            color: color?.trim() || null,
            unit: unit || "kg",
            note: note || null,
            image_url: imageUrl || null,
            hash: hash || null,
            avg_color: avgColor || null,
            is_published: false,
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            return Response.json({ error: "Mã mẫu đã tồn tại." }, { status: 409 });
        }
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ id: data.id });
}