export async function POST(request) {
    const body = await request.json();
    const { password } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return Response.json({ success: false, error: "Sai mật khẩu." }, { status: 401 });
    }

    const response = Response.json({ success: true });
    response.headers.set(
        "Set-Cookie",
        `kho_role=admin; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`
    );
    return response;
}