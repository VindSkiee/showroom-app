"use client";

import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { VehicleCard } from "./vehicle-card";
import type { Vehicle } from "@/lib/types";

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  return (
    <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {vehicles.map((vehicle) => (
        <StaggerItem key={vehicle.id}>
          <VehicleCard vehicle={vehicle} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
