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
    default: "Toko Showroom Aneka Motor - Katalog Mobil & Motor Bekas Berkualitas",
    template: "%s | Toko Showroom Aneka Motor",
  },
  description:
    "Jual beli mobil dan motor bekas berkualitas di Purwakarta. Cash & credit, surat lengkap, harga transparan.",
  keywords: ["mobil bekas", "motor bekas", "showroom purwakarta", "katalog mobil", "aneka motor purwakarta"],
  authors: [{ name: "Toko Showroom Aneka Motor" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Toko Showroom Aneka Motor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
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
