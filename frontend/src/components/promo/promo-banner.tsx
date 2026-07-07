"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { Promo } from "@/lib/types";

interface PromoBannerProps {
  promo: Promo;
}

export function PromoBanner({ promo }: PromoBannerProps) {
  const [imgError, setImgError] = useState(false);

  const bannerUrl =
    promo.banner && !imgError
      ? getStrapiImageUrl(promo.banner.formats?.large?.url || promo.banner.url)
      : null;

  return (
    <div className="overflow-hidden rounded-2xl bg-surface">
      {/* Banner image */}
      {bannerUrl && (
        <div className="relative aspect-[2/1] overflow-hidden bg-stone-100 sm:aspect-[3/1]">
          <Image
            src={bannerUrl}
            alt={promo.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-ink sm:text-xl">
                {promo.title}
              </h2>
              {promo.discount > 0 && (
                <Badge variant="danger">-{promo.discount}%</Badge>
              )}
            </div>

            {promo.description && (
              <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                {promo.description}
              </p>
            )}
          </div>
        </div>

        {/* Related vehicles */}
        {promo.vehicles.length > 0 && (
          <div className="mt-4 border-t border-stone-200 pt-4">
            <p className="mb-3 text-xs font-medium text-ink-muted">
              Motor dalam promo ini:
            </p>
            <div className="flex flex-wrap gap-2">
              {promo.vehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicle/${vehicle.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-bg px-3 py-1.5 text-sm text-ink transition-colors hover:bg-stone-200"
                >
                  <span className="line-clamp-1">{vehicle.name}</span>
                  {vehicle.status === "available" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
