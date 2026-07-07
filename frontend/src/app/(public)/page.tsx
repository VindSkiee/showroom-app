import { Container } from "@/components/ui/container";
import { VehicleGrid } from "@/components/vehicle/vehicle-grid";
import { getVehicles } from "@/lib/strapi";
import type { Vehicle } from "@/lib/types";

export default async function CatalogPage() {
  let vehicles: Vehicle[] = [];
  try {
    const res = await getVehicles({ pageSize: 20 });
    vehicles = res.data;
  } catch {
    // Strapi not reachable - show empty state
  }

  return (
    <main className="py-6 sm:py-8">
      <Container>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            Katalog Motor
          </h1>
          <p className="mt-2 text-ink-muted">
            Temukan motor bekas berkualitas dengan surat lengkap
          </p>
        </div>

        {/* Grid */}
        {vehicles.length > 0 ? (
          <VehicleGrid vehicles={vehicles} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-ink-muted">Belum ada motor tersedia</p>
            <p className="mt-2 text-sm text-ink-muted">
              Silakan cek kembali nanti
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
