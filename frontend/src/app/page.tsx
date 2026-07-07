import { formatCurrency } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Showroom Motor</h1>
        <p className="mt-2 text-ink-muted">Katalog sedang dimuat...</p>
        <p className="mt-4 text-sm">{formatCurrency(18500000)}</p>
      </div>
    </main>
  );
}
