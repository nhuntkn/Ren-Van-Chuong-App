import { supabaseServer } from "@/lib/supabaseServerClient";

export async function buildItemRows() {
    const { data: items, error: itemsError } = await supabaseServer.from("items").select("*");
    if (itemsError) throw new Error(itemsError.message);

    const { data: stockData } = await supabaseServer.from("item_stock_totals").select("item_id, total_stock");
    const stockMap = Object.fromEntries((stockData || []).map((s) => [s.item_id, s.total_stock]));

    const { data: links } = await supabaseServer
        .from("container_items")
        .select("item_id, containers(zone, shelf)");
    const locationMap = {};
    for (const link of links || []) {
        const loc = [link.containers?.zone, link.containers?.shelf ? `Kệ ${link.containers.shelf}` : null]
            .filter(Boolean)
            .join(" · ");
        if (!locationMap[link.item_id]) locationMap[link.item_id] = new Set();
        if (loc) locationMap[link.item_id].add(loc);
    }

    return items.map((item) => {
        const stock = stockMap[item.id] || 0;
        return {
            code: item.item_code,
            name: item.name || "",
            category: item.category,
            color: item.color || "",
            width: item.fabric_width || "",
            costPrice: item.cost_price || "",
            wholesalePrice: item.wholesale_price || "",
            price: item.price || "",
            supplier: item.supplier || "",
            location: locationMap[item.id] ? Array.from(locationMap[item.id]).join(" | ") : "",
            status: stock > 0 ? "Còn hàng" : "Hết hàng",
        };
    });
}