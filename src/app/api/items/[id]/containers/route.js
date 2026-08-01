// src/app/api/items/[id]/containers/route.js
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data: links, error: linksError } = await supabaseServer
        .from("container_items")
        .select("container_id, qty")
        .eq("item_id", id);

    if (linksError) return Response.json({ error: linksError.message }, { status: 500 });
    if (!links || links.length === 0) return Response.json([]);

    const containerIds = links.map((l) => l.container_id);

    const { data: containersData, error: containersError } = await supabaseServer
        .from("containers")
        .select("id, type, zone, shelf")
        .in("id", containerIds);

    if (containersError) return Response.json({ error: containersError.message }, { status: 500 });

    const containerMap = Object.fromEntries(containersData.map((c) => [c.id, c]));

    const breakdown = links.map((link) => {
        const c = containerMap[link.container_id] || {};
        return {
            containerId: link.container_id,
            type: c.type,
            zone: c.zone,
            shelf: c.shelf,
            qty: link.qty,
        };
    });

    return Response.json(breakdown);
}