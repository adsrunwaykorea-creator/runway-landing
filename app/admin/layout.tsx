import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "런웨이 관리자",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-navy">{children}</div>
  );
}
