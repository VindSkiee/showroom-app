import { CatalogDetail } from "@/components/catalog/catalog-detail";
import type { Vehicle } from "@/lib/types";

interface VehicleDetailProps {
  vehicle: Vehicle;
}

export function VehicleDetail({ vehicle }: VehicleDetailProps) {
  return <CatalogDetail item={vehicle} />;
}
