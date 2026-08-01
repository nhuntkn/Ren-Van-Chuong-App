import { supabase } from "@/lib/supabaseClient";

export async function GET() {
    const { data, error } = await supabase
        .from("colors")
        .select("code, name, hex")
        .order("name", { ascending: true });

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data);
}