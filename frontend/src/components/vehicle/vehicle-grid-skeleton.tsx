import { CatalogGridSkeleton } from "@/components/catalog/catalog-grid-skeleton";

export function VehicleGridSkeleton(props: { count?: number }) {
  return <CatalogGridSkeleton {...props} />;
}
