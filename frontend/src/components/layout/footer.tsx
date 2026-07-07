import Link from "next/link";
import { Container } from "@/components/ui/container";

const footerLinks = [
  { href: "/", label: "Beranda" },
  { href: "/", label: "Katalog" },
  { href: "/promo", label: "Promo" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-surface bg-bg">
      <Container>
        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div>
            <p className="text-sm font-semibold text-ink">Showroom Motor</p>
            <p className="mt-1 text-sm text-ink-muted">
              Motor bekas berkualitas, surat lengkap
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="border-t border-surface py-4 text-center">
          <p className="text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} Showroom Motor. Semua hak
            dilindungi.
          </p>
        </div>
      </Container>
    </footer>
  );
}
