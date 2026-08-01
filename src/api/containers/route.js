import { supabase } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServerClient";
import { generateContainerId, generateQrDataUrl } from "@/lib/qr";

export async function GET() {
    const { data, error } = await supabase
        .from("containers")
        .select("*, container_items(item_id)")
        .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const containers = data.map((c) => ({
        id: c.id,
        type: c.type,
        zone: c.zone,
        shelf: c.shelf,
        itemCount: c.container_items?.length || 0,
    }));

    return Response.json(containers);
}

export async function POST(request) {
    const body = await request.json();
    const { type, zone, shelf } = body;

    const id = generateContainerId();

    const { error } = await supabaseServer
        .from("containers")
        .insert({ id, type: type || "single", zone, shelf });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const qrDataUrl = await generateQrDataUrl(id);

    return Response.json({ id, qrDataUrl });
}