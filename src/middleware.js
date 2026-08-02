import { NextResponse } from "next/server";
import { ROLE_COOKIE } from "@/lib/roleCookie";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Bỏ qua hoàn toàn mọi request API — middleware chỉ áp dụng cho trang giao diện
    if (pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    const role = request.cookies.get(ROLE_COOKIE)?.value;
    const isLoginPage = pathname.startsWith("/login");

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