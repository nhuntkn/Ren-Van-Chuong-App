import { Be_Vietnam_Pro } from "next/font/google";
import BottomNav from "@/components/bottomNav";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Kho Ren & Phụ Liệu",
  description: "Quản lý tồn kho, vị trí và bao hàng.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-ink">
        <div className="flex-1 pb-16 max-w-[480px] mx-auto w-full">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}