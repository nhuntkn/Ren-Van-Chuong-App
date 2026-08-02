"use client";
import { useLoginLogic } from "./login.logic";

export default function LoginPage() {
    const { showPasswordInput, password, setPassword, error, submitting, enterAsStaff, clickAdmin, submitAdminPassword, cancelAdmin } =
        useLoginLogic();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-6">
            <h1 className="text-xl font-semibold mb-6">Kho Ren &amp; Phụ Liệu</h1>

            {!showPasswordInput ? (
                <div className="flex flex-col gap-3 w-full max-w-[280px]">
                    <button onClick={enterAsStaff} className="bg-sage text-white font-semibold py-3 rounded-md">
                        Nhân viên
                    </button>
                    <button onClick={clickAdmin} className="bg-accent text-white font-semibold py-3 rounded-md">
                        Quản lý
                    </button>
                </div>
            ) : (
                <form onSubmit={submitAdminPassword} className="flex flex-col gap-3 w-full max-w-[280px]">
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu quản lý"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        className="px-3 py-2.5 border border-border rounded-md text-sm text-center"
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={submitting} className="bg-accent text-white font-semibold py-2.5 rounded-md disabled:opacity-60">
                        {submitting ? "Đang kiểm tra..." : "Xác nhận"}
                    </button>
                    <button type="button" onClick={cancelAdmin} className="text-ink-soft text-sm py-1">
                        Quay lại
                    </button>
                </form>
            )}
        </main>
    );
}