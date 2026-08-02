import { cookies } from "next/headers";
import { ROLE_COOKIE } from "@/lib/roleCookie";

export async function GET() {
    const cookieStore = await cookies();
    const role = cookieStore.get(ROLE_COOKIE)?.value || null;
    return Response.json({ role });
}