"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm text-ink-muted transition-colors hover:border-danger/30 hover:text-danger"
    >
      Keluar
    </button>
  );
}
