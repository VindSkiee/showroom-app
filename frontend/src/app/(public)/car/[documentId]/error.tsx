"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CarDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Car detail error:", error);
  }, [error]);

  return (
    <main className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            className="h-16 w-16 text-danger"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <h1 className="mt-4 text-xl font-semibold text-ink sm:text-2xl">
            Gagal Memuat Mobil
          </h1>
          <p className="mt-3 max-w-md text-ink-muted">
            Terjadi kesalahan saat memuat detail mobil. Silakan coba lagi.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-ink-muted">
              Error ID: {error.digest}
            </p>
          )}
          <div className="mt-8 flex gap-3">
            <Button onClick={reset}>Coba Lagi</Button>
            <Button variant="secondary" onClick={() => (window.location.href = "/cars")}>
              ke Katalog Mobil
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
