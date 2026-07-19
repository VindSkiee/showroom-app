"use client";

import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { CatalogCard } from "./catalog-card";
import type { CatalogItem } from "@/lib/types";

interface CatalogGridProps {
  items: CatalogItem[];
  basePath: string;
}

export function CatalogGrid({ items, basePath }: CatalogGridProps) {
  return (
    <StaggerList className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
      {items.map((item) => (
        <StaggerItem key={item.id}>
          <CatalogCard item={item} basePath={basePath} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
