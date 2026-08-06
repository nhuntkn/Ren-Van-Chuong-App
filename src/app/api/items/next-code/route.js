import { supabase } from "@/lib/supabaseClient";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const prefix = (searchParams.get("prefix") || "").trim();

    if (!prefix) {
        return Response.json({ error: "Thiếu tiền tố." }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("items")
        .select("item_code")
        .ilike("item_code", `${prefix}-%`);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    let maxSeq = 0;
    for (const row of data) {
        const match = row.item_code?.match(new RegExp(`^${prefix}-(\\d+)$`));
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxSeq) maxSeq = num;
        }
    }

    const nextSeq = String(maxSeq + 1).padStart(2, "0");
    return Response.json({ suggestedCode: `${prefix}-${nextSeq}` });
}