import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServerClient";
import ExcelJS from "exceljs";

export async function GET() {
    const cookieStore = await cookies();
    const role = cookieStore.get("kho_role")?.value;
    if (role !== "admin") {
        return Response.json({ error: "Chỉ quản lý mới được xuất dữ liệu." }, { status: 403 });
    }

    const { data: items, error: itemsError } = await supabaseServer.from("items").select("*");
    if (itemsError) return Response.json({ error: itemsError.message }, { status: 500 });

    const { data: stockData } = await supabaseServer.from("item_stock_totals").select("item_id, total_stock");
    const stockMap = Object.fromEntries((stockData || []).map((s) => [s.item_id, s.total_stock]));

    const { data: links } = await supabaseServer
        .from("container_items")
        .select("item_id, containers(zone, shelf)");
    const locationMap = {};
    for (const link of links || []) {
        const loc = [link.containers?.zone, link.containers?.shelf ? `Kệ ${link.containers.shelf}` : null]
            .filter(Boolean)
            .join(" · ");
        if (!locationMap[link.item_id]) locationMap[link.item_id] = new Set();
        if (loc) locationMap[link.item_id].add(loc);
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Mẫu hàng");

    sheet.columns = [
        { header: "Mã", key: "code", width: 14 },
        { header: "Tên", key: "name", width: 24 },
        { header: "Loại", key: "category", width: 16 },
        { header: "Màu", key: "color", width: 14 },
        { header: "Khổ", key: "width", width: 10 },
        { header: "Giá nhập", key: "costPrice", width: 12 },
        { header: "Giá sỉ", key: "wholesalePrice", width: 12 },
        { header: "Giá lẻ", key: "price", width: 12 },
        { header: "Nhà cung cấp", key: "supplier", width: 18 },
        { header: "Vị trí kho", key: "location", width: 24 },
        { header: "Trạng thái", key: "status", width: 12 },
    ];

    sheet.getRow(1).font = { bold: true };

    for (const item of items) {
        const stock = stockMap[item.id] || 0;
        const locations = locationMap[item.id] ? Array.from(locationMap[item.id]).join(" | ") : "";

        sheet.addRow({
            code: item.item_code,
            name: item.name || "",
            category: item.category,
            color: item.color || "",
            width: item.fabric_width || "",
            costPrice: item.cost_price || "",
            wholesalePrice: item.wholesale_price || "",
            price: item.price || "",
            supplier: item.supplier || "",
            location: locations,
            status: stock > 0 ? "Còn hàng" : "Hết hàng",
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="kho-ren-${new Date().toISOString().slice(0, 10)}.xlsx"`,
        },
    });
}