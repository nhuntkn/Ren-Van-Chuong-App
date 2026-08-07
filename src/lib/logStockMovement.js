// src/lib/logStockMovement.js
import { supabaseServer } from "@/lib/supabaseServerClient";
import { triggerMovementSync } from "@/lib/syncHelper";

export async function logStockMovement({ itemId, itemCode, containerId, movementType, qty, note }) {
    try {
        await supabaseServer.from("stock_movements").insert({
            item_id: itemId,
            item_code: itemCode,
            container_id: containerId,
            movement_type: movementType,
            qty,
            note: note || null,
        });
    } catch (err) {
        console.error("Lỗi ghi log tồn kho:", err.message);
    }

    // Đồng bộ lên Google Sheets song song, không chặn nếu lỗi
    triggerMovementSync({ itemCode, movementType, qty, note });
}