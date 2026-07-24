import { NextRequest, NextResponse } from "next/server";
import { getStrapiUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const params = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      params.set(key, value);
    }

    const strapiRes = await fetch(
      `${getStrapiUrl()}/api/sales?${params.toString()}`,
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

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { vehicleId, carId, salePrice, buyerName, quantity } = await request.json();

    // Forward to Laravel SaleController which handles stock lifecycle via SaleService
    const strapiRes = await fetch(`${getStrapiUrl()}/api/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        vehicle_id: vehicleId || null,
        car_id: carId || null,
        sale_price: salePrice,
        buyer_name: buyerName || null,
        quantity: quantity || 1,
      }),
    });

    if (!strapiRes.ok) {
      const error = await strapiRes.json().catch(() => null);
      return NextResponse.json(
        { error: error?.message || error?.errors || "Gagal mencatat penjualan" },
        { status: strapiRes.status }
      );
    }

    const data = await strapiRes.json();
    return NextResponse.json({ ok: true, data: data.data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memproses penjualan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
