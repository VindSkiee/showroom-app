import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-surface bg-bg">
      <Container>
        <div className="py-8">
          {/* Brand */}
          <div>
            <p className="text-sm font-semibold text-ink">Showroom Motor</p>
            <p className="mt-1 text-sm text-ink-muted">
              Motor bekas berkualitas, surat lengkap
            </p>
          </div>
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
