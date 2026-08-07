import { supabaseServer } from "@/lib/supabaseServerClient";

export async function POST(request) {
    const body = await request.json();
    const { dataUrl } = body;

    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
        return Response.json({ error: "Ảnh không hợp lệ." }, { status: 400 });
    }

    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
        return Response.json({ error: "Không đọc được dữ liệu ảnh." }, { status: 400 });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const ext = contentType.split("/")[1] || "jpg";
    const fileName = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabaseServer.storage
        .from("item-images")
        .upload(fileName, buffer, { contentType, upsert: false });

    if (uploadError) {
        return Response.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseServer.storage
        .from("item-images")
        .getPublicUrl(fileName);

    return Response.json({ url: publicUrlData.publicUrl });
}