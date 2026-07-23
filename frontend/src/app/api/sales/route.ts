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

    const { vehicleDocumentId, carDocumentId, salePrice, quantity } =
      await request.json();

    const isVehicle = !!vehicleDocumentId;
    const collection = isVehicle ? "vehicles" : "cars";
    const documentId = isVehicle ? vehicleDocumentId : carDocumentId;

    if (!documentId) {
      return NextResponse.json(
        { error: "ID kendaraan tidak valid" },
        { status: 400 }
      );
    }

    // Step 1: Get current stock from Strapi
    const getRes = await fetch(
      `${getStrapiUrl()}/api/${collection}/${documentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!getRes.ok) {
      return NextResponse.json(
        { error: "Gagal mengambil data item" },
        { status: getRes.status }
      );
    }

    const currentItem = await getRes.json();
    const currentStock = currentItem.data?.stock ?? 0;
    const currentStockSold = currentItem.data?.stockSold ?? 0;

    if (quantity > currentStock) {
      return NextResponse.json(
        { error: "Stok tidak mencukupi" },
        { status: 400 }
      );
    }

    // Step 2: Create Sale record
    const salePayload: Record<string, unknown> = {
      saleDate: new Date().toISOString(),
      salePrice,
      quantity,
    };

    if (isVehicle) {
      salePayload.vehicle = vehicleDocumentId;
    } else {
      salePayload.car = carDocumentId;
    }

    const saleRes = await fetch(`${getStrapiUrl()}/api/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: salePayload }),
    });

    if (!saleRes.ok) {
      const saleError = await saleRes.json().catch(() => null);
      return NextResponse.json(
        { error: saleError?.error?.message || "Gagal mencatat penjualan" },
        { status: saleRes.status }
      );
    }

    const saleData = await saleRes.json();
    const saleDocumentId = saleData.data?.documentId;

    // Step 3: Update stock (reduce stock, increase stockSold)
    const newStock = currentStock - quantity;
    const newStockSold = currentStockSold + quantity;

    const updateRes = await fetch(
      `${getStrapiUrl()}/api/${collection}/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            stock: newStock,
            stockSold: newStockSold,
            availabilityStatus: newStock <= 0 ? "sold_out" : "available",
          },
        }),
      }
    );

    // Step 4: Rollback if stock update fails
    if (!updateRes.ok) {
      if (saleDocumentId) {
        await fetch(`${getStrapiUrl()}/api/sales/${saleDocumentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return NextResponse.json(
        { error: "Gagal memperbarui stok" },
        { status: updateRes.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal memproses penjualan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
