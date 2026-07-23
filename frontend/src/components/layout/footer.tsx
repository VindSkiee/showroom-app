import { Container } from "@/components/ui/container";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";

// Komponen ikon media sosial kustom
const SocialIcon = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-accent hover:text-white"
  >
    {children}
  </Link>
);

// Ikon-ikon media sosial (SVG kustom sederhana)
const InstagramSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const MessageBubbleSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-black text-white">
      <Container>
        {/* Konten Utama: 4 Kolom */}
        <div className="grid grid-cols-1 gap-12 py-10 md:grid-cols-3 md:py-16">
          {/* Kolom 1: Profil Bisnis & Media Sosial */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.jpg"
                alt="Toko Showroom Aneka Motor"
                width={120}
                height={40}
                className="h-9 w-auto sm:h-16"
                priority
              />
            </Link>
            <h2 className="mb-6 font-bold text-white text-base md:text-sm">
              ANEKA MOTOR PURWAKARTA
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed max-w-xs md:max-w-none">
              Showroom kendaraan terpercaya di Purwakarta. Melayani
              pembelian mobil dan motor dengan proses mudah dan cepat.
            </p>
            <div className="flex gap-4 pt-1">
              <SocialIcon href="https://www.instagram.com/showroom_purwakarta/">
                <InstagramSvg />
              </SocialIcon>
              <SocialIcon href="https://wa.me/6289677921009">
                <MessageBubbleSvg />
              </SocialIcon>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div className="text-zinc-300">
            <h3 className="mb-6 font-bold text-white text-base md:text-sm">
              TAUTAN CEPAT
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/katalog-mobil"
                  className="transition-colors hover:text-accent"
                >
                  Katalog Mobil
                </Link>
              </li>
              <li>
                <Link
                  href="/katalog-motor"
                  className="transition-colors hover:text-accent"
                >
                  Katalog Motor
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="transition-colors hover:text-accent"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak Kami */}
          <div className="text-zinc-300">
            <h3 className="mb-6 font-bold text-white text-base md:text-sm">
              KONTAK KAMI
            </h3>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-x-3.5">
                <MapPin className="h-5 w-5 flex-shrink-0 text-accent pt-1" />
                <p>
                  Jl. Taman Pahlawan No.59, Purwamekar, Kec. Purwakarta, Kab.
                  Purwakrta, Jawa Barat, 41119
                </p>
              </div>
              <div className="flex items-center gap-x-3.5">
                <Phone className="h-5 w-5 flex-shrink-0 text-accent" />
                <a
                  href="tel:+6289677921009"
                  className="transition-colors hover:text-accent"
                >
                  +62 896-7792-1009
                </a>
              </div>
              <div className="flex items-center gap-x-3.5">
                <MessageCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                <a
                  href="https://wa.me/6289677921009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  WhatsApp: 0896-7792-1009
                </a>
              </div>
            </div>
            <div className="pt-8 md:pt-5 w-50">
              <a
                href="https://wa.me/6289677921009"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm justify-center gap-x-3 rounded-lg bg-accent px-6 py-4 text-center font-bold text-white shadow-lg transition-colors hover:bg-accent/90"
              >
                <MessageCircle className="h-5 w-5" />
                CHAT WHATSAPP
              </a>
            </div>
          </div>

          {/* Kolom 4: Tombol Panggilan Aksi */}
        </div>

        {/* Baris Bawah: Hak Cipta & Waktu Buka Showroom */}
        <div className="border-t border-zinc-800">
          <div className="flex flex-col gap-4 py-6 text-zinc-400 text-sm md:flex-row md:items-center md:justify-between md:py-8">
            <p>&copy; {currentYear} Aneka Motor. Hak Cipta Dilindungi.</p>
            <p className="font-medium text-white/90">
              Showroom buka: Senin—Sabtu 08:00—17:00 WIB
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
