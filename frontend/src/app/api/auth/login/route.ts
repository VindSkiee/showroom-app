import { NextRequest, NextResponse } from "next/server";
import { getStrapiUrl } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const strapiRes = await fetch(`${getStrapiUrl()}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Email atau password salah" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true, user: data.user });
    response.cookies.set("token", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Gagal terhubung ke server" },
      { status: 500 }
    );
  }
}
