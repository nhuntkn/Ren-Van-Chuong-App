import { createClient } from "@supabase/supabase-js";

if (typeof globalThis.WebSocket === "undefined") {
    const { default: WebSocketImpl } = await import("ws");
    globalThis.WebSocket = WebSocketImpl;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
}

// Client này chỉ được import trong API routes (chạy phía server), KHÔNG BAO GIỜ
// import vào component client ("use client"), vì service_role key có toàn quyền
// đọc/ghi database, bỏ qua mọi rule bảo mật (RLS).
export const supabaseServer = createClient(supabaseUrl, serviceRoleKey);