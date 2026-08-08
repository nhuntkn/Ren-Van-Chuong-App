import { buildItemRows } from "@/lib/buildItemRows";
import { buildCustomerRows } from "@/lib/buildCustomerRows";
import { syncItemsToSheet, syncCustomersToSheet, appendMovementToSheet } from "@/lib/googleSheets";

export async function triggerSheetSync() {
    try {
        const rows = await buildItemRows();
        await syncItemsToSheet(rows);
    } catch (err) {
        console.error("Lỗi khi build dữ liệu mẫu hàng để đồng bộ:", err.message);
    }
}

export async function triggerCustomerSync() {
    try {
        const rows = await buildCustomerRows();
        await syncCustomersToSheet(rows);
    } catch (err) {
        console.error("Lỗi khi build dữ liệu khách hàng để đồng bộ:", err.message);
    }
}

export async function triggerMovementSync({ itemCode, movementType, qty, note }) {
    try {
        const row = [
            new Date().toLocaleString("vi-VN"),
            itemCode,
            movementType === "in" ? "Nhập" : "Xuất",
            qty,
            note || "",
        ];
        await appendMovementToSheet(row);
    } catch (err) {
        console.error("Lỗi khi ghi log Nhập/Xuất lên sheet:", err.message);
    }
}