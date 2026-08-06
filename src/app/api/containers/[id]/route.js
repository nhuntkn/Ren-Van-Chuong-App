import { supabaseServer } from "@/lib/supabaseServerClient";
import { generateQrDataUrl } from "@/lib/qr";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabaseServer
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

    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được sửa vị trí bao." }, { status: 403 });
    }

    const body = await request.json();

    const { error } = await supabaseServer
        .from("containers")
        .update({ type: body.type, zone: body.zone, shelf: body.shelf })
        .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
}

export async function DELETE(request, { params }) {
    const { id } = await params;

    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được xóa bao." }, { status: 403 });
    }

    const { data: links, error: linksError } = await supabaseServer
        .from("container_items")
        .select("id")
        .eq("container_id", id);

    if (linksError) return Response.json({ error: linksError.message }, { status: 500 });

    if (links && links.length > 0) {
        return Response.json(
            { error: "Bao này vẫn còn mẫu hàng bên trong. Vui lòng lấy hết hàng ra trước khi xóa." },
            { status: 409 }
        );
    }

    const { error } = await supabaseServer.from("containers").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true });
}