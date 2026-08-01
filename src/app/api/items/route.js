import { supabase } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabase
        .from("items")
        .select("*, colors(code, name, hex), item_stock_totals(total_stock)");

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    const items = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        colorCode: item.colors?.code || null,
        colorName: item.colors?.name || null,
        colorHex: item.colors?.hex || null,
        unit: item.unit,
        note: item.note,
        imageUrl: item.image_url,
        isPublished: item.is_published,
        totalStock: item.item_stock_totals?.[0]?.total_stock || 0,
    }));

    return Response.json(items);
}

export async function POST(request) {
    const body = await request.json();
    const { name, category, colorCode, unit, note, imageUrl, hash, avgColor } = body;

    if (!name?.trim() || !category?.trim()) {
        return Response.json({ error: "Thiếu tên hoặc loại mẫu hàng." }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from("items")
        .insert({
            name: name.trim(),
            category,
            color_code: colorCode || null,
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
        return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ id: data.id });
}