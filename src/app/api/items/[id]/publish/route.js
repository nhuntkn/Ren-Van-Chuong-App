import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function PATCH(request, { params }) {
    const { id } = await params;

    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được đăng bán." }, { status: 403 });
    }

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

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
}