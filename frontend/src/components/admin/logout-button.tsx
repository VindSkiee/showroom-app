"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-stone-200 bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:border-danger/30 hover:text-white hover:bg-danger/90 active:bg-danger/80 sm:px-5 sm:py-2 sm:text-base"
    >
      Keluar
    </button>
  );
}
