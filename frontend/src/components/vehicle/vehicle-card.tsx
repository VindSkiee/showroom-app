import { CatalogCard } from "@/components/catalog/catalog-card";
import type { Vehicle } from "@/lib/types";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return <CatalogCard item={vehicle} basePath="/vehicle" />;
}
