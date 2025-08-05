import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "eDuit Raya Splitter | Track & Manage Duit Raya Distribution",
  description:
    "Easily track and manage your duit raya distribution with export features and DuitNow QR support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
