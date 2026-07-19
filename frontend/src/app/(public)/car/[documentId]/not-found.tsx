import Link from "next/link";

export default function CarNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-ink-muted">404</p>
      <h1 className="mt-4 text-xl font-bold text-ink">Mobil Tidak Ditemukan</h1>
      <p className="mt-2 text-ink-muted">
        Mobil yang Anda cari tidak tersedia atau telah dihapus.
      </p>
      <Link
        href="/cars"
        className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
      >
        Lihat Katalog Mobil
      </Link>
    </div>
  );
}
