import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Showroom Motor - Katalog Motor Bekas Berkualitas",
    template: "%s | Showroom Motor",
  },
  description:
    "Temukan motor bekas berkualitas dengan surat lengkap. Harga terjangkau, transparan, dan terpercaya.",
  keywords: ["motor bekas", "katalog motor", "showroom motor", "motor murah"],
  authors: [{ name: "Showroom Motor" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Showroom Motor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAFAF9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
