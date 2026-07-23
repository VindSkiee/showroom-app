import { NextRequest, NextResponse } from "next/server";
import { getStrapiUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  try {
    const params = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      params.set(key, value);
    }

    const strapiRes = await fetch(
      `${getStrapiUrl()}/api/vehicles?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!strapiRes.ok) {
      const error = await strapiRes.json().catch(() => null);
      return NextResponse.json(
        { error: error?.error?.message || "Gagal mengambil data" },
        { status: strapiRes.status }
      );
    }

    const data = await strapiRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Gagal terhubung ke server" },
      { status: 500 }
    );
  }
}
