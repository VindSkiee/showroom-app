import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function VehicleNotFound() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            className="mb-4 h-16 w-16 text-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">
            Motor Tidak Ditemukan
          </h1>
          <p className="mt-3 max-w-md text-ink-muted">
            Motor yang kamu cari mungkin sudah tidak tersedia atau URL tidak valid.
          </p>
          <Link href="/" className="mt-8">
            <Button>Lihat Katalog</Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}
