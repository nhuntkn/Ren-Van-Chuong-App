import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServerClient";
import { generateContainerId, generateQrDataUrl } from "@/lib/qr";

export async function GET() {
    const { data: containersData, error: containersError } = await supabaseServer
        .from("containers")
        .select("*")
        .order("created_at", { ascending: false });

    if (containersError) return Response.json({ error: containersError.message }, { status: 500 });

    const { data: linksData, error: linksError } = await supabaseServer
        .from("container_items")
        .select("container_id");

    if (linksError) return Response.json({ error: linksError.message }, { status: 500 });

    const countMap = {};
    for (const link of linksData || []) {
        countMap[link.container_id] = (countMap[link.container_id] || 0) + 1;
    }

    const containers = containersData.map((c) => ({
        id: c.id,
        type: c.type,
        zone: c.zone,
        shelf: c.shelf,
        itemCount: countMap[c.id] || 0,
    }));

    return Response.json(containers);
}

export async function POST(request) {
    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được tạo bao mới." }, { status: 403 });
    }

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