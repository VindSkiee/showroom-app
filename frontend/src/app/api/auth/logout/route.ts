import { NextRequest, NextResponse } from "next/server";
import { getStrapiUrl } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Try to revoke token on backend (best effort)
  if (token) {
    try {
      await fetch(`${getStrapiUrl()}/api/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore errors — still clear cookie client-side
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("token");
  return response;
}
