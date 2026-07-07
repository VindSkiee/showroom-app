import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StatusBadge, TypeBadge } from "@/components/ui/badge";
import type { Vehicle } from "@/lib/types";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const imageUrl =
    vehicle.images.length > 0
      ? getStrapiImageUrl(vehicle.images[0].formats?.small?.url || vehicle.images[0].url)
      : null;

  return (
    <Link
      href={`/vehicle/${vehicle.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-surface transition-transform"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={vehicle.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted">
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute left-3 top-3 flex gap-2">
          <TypeBadge type={vehicle.type} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight text-ink line-clamp-1">
            {vehicle.name}
          </h3>
          <StatusBadge status={vehicle.status} />
        </div>

        <p className="text-sm text-ink-muted line-clamp-1">{vehicle.model}</p>

        <div className="mt-auto flex items-end justify-between">
          <p className="text-lg font-bold text-accent">
            {formatCurrency(vehicle.price)}
          </p>
          <p className="text-xs text-ink-muted">{vehicle.year}</p>
        </div>
      </div>
    </Link>
  );
}
