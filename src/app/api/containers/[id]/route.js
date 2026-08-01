import { supabase } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServerClient";
import { generateQrDataUrl } from "@/lib/qr";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabase
        .from("containers")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!data) return Response.json({ error: "Không tìm thấy bao hàng." }, { status: 404 });

    const qrDataUrl = await generateQrDataUrl(id);

    return Response.json({ ...data, qrDataUrl });
}

export async function PATCH(request, { params }) {
    const { id } = await params;
    const body = await request.json();

    const { error } = await supabaseServer
        .from("containers")
        .update({ type: body.type, zone: body.zone, shelf: body.shelf })
        .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
}