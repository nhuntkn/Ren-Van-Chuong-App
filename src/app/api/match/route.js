import { supabaseServer } from "@/lib/supabaseServerClient";
import { similarityPercent } from "@/lib/similarity";

export async function POST(request) {
    const body = await request.json();
    const { hash, avgColor } = body;

    if (!hash || !avgColor) {
        return Response.json({ error: "Thiếu dữ liệu ảnh để so khớp." }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from("items")
        .select("id, item_code, name, unit, image_url, hash, avg_color")
        .not("hash", "is", null);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const scored = data
        .map((item) => ({
            id: item.id,
            name: item.item_code || item.name,
            unit: item.unit,
            imageUrl: item.image_url,
            score: similarityPercent({ hash, avgColor }, { hash: item.hash, avgColor: item.avg_color }),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);

    return Response.json(scored);
}