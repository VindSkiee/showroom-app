import { CatalogGrid } from "@/components/catalog/catalog-grid";
import type { Vehicle } from "@/lib/types";

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  return <CatalogGrid items={vehicles} basePath="/vehicle" />;
}
