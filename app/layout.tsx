export const metadata = {
  title: "Open‑Strengths@Work (OSW‑40)",
  description: "Public-domain work strengths assessment (OSW-40) — Next.js demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
