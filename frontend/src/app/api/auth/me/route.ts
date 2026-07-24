import { NextRequest, NextResponse } from "next/server";
import { getStrapiUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const strapiRes = await fetch(`${getStrapiUrl()}/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!strapiRes.ok) {
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.cookies.delete("token");
      return response;
    }

    const data = await strapiRes.json();
    return NextResponse.json({ authenticated: true, user: data.user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
