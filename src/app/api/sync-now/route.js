import { cookies } from "next/headers";
import { triggerSheetSync, triggerCustomerSync } from "@/lib/syncHelper";

export async function POST() {
    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được đồng bộ." }, { status: 403 });
    }

    await triggerSheetSync();
    await triggerCustomerSync();

    return Response.json({ success: true });
}