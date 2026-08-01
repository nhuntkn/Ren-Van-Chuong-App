import { supabase } from "@/lib/supabaseClient";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabase
        .from("container_items")
        .select("qty, containers(id, type, zone, shelf, bin)")
        .eq("item_id", id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const breakdown = data.map((row) => ({
        containerId: row.containers.id,
        type: row.containers.type,
        zone: row.containers.zone,
        shelf: row.containers.shelf,
        qty: row.qty,
    }));

    return Response.json(breakdown);
}