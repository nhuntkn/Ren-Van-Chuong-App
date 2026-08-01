import { supabaseServer } from "@/lib/supabaseServerClient";

export async function PATCH(request, { params }) {
    const { id } = await params;
    const body = await request.json();
    const { isPublished, price } = body;

    if (isPublished && (!price || price <= 0)) {
        return Response.json(
            { error: "Cần nhập giá bán hợp lệ trước khi đăng bán." },
            { status: 400 }
        );
    }

    const { error } = await supabaseServer
        .from("items")
        .update({ is_published: isPublished, price: price ?? undefined })
        .eq("id", id);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
}