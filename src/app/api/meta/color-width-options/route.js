import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET() {
    const { data, error } = await supabaseServer
        .from("items")
        .select("color, fabric_width");

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const colors = [...new Set(data.map((r) => r.color).filter(Boolean))].sort();
    const widths = [...new Set(data.map((r) => r.fabric_width).filter(Boolean))].sort();

    return Response.json({ colors, widths });
}