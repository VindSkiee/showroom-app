import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-6xl font-bold text-ink">404</p>
          <h1 className="mt-4 text-xl font-semibold text-ink sm:text-2xl">
            Halaman Tidak Ditemukan
          </h1>
          <p className="mt-3 max-w-md text-ink-muted">
            Sepertinya halaman yang kamu cari sudah tidak ada atau dipindahkan.
          </p>
          <Link href="/" className="mt-8">
            <Button>Kembali ke Katalog</Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}
