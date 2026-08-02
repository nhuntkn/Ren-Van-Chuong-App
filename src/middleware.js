import { NextResponse } from "next/server";
import { ROLE_COOKIE } from "@/lib/roleCookie";

export function middleware(request) {
    const role = request.cookies.get(ROLE_COOKIE)?.value;
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");

    if (!role && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role && isLoginPage) {
        return NextResponse.redirect(new URL("/kho-hang", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};