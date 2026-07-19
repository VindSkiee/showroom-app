"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { formatCurrency } from "@/lib/utils";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StatusBadge, TypeBadge } from "@/components/ui/badge";
import { motionTokens } from "@/lib/motion-tokens";
import type { CatalogItem } from "@/lib/types";

interface CatalogCardProps {
  item: CatalogItem;
  basePath: string;
}

function calculatePromoPrice(price: number, discount: number): number {
  return Math.round(price - (price * discount / 100));
}

export function CatalogCard({ item, basePath }: CatalogCardProps) {
  const prefersReduced = useReducedMotion();
  const [imgError, setImgError] = useState(false);

  const imageUrl =
    item.images && item.images.length > 0 && !imgError
      ? getStrapiImageUrl(item.images[0].formats?.small?.url || item.images[0].url)
      : null;

  const hasActivePromo = item.promo?.isActive;
  const promoPrice = hasActivePromo
    ? calculatePromoPrice(item.price, item.promo!.discount)
    : null;

  return (
    <motion.div
      whileHover={prefersReduced ? undefined : { scale: 1.02 }}
      whileTap={prefersReduced ? undefined : { scale: 0.98 }}
      transition={{
        type: "spring",
        ...motionTokens.spring.snappy,
      }}
    >
      <Link
        href={`${basePath}/${item.documentId}`}
        className="group flex flex-col overflow-hidden rounded-xl bg-surface sm:rounded-2xl"
      >
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-stone-100 lg:aspect-[4/3]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-muted">
              <span className="text-xs sm:text-sm">No Image</span>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute left-1.5 top-1.5 flex gap-1 sm:left-2 sm:top-2 sm:gap-1.5 lg:left-3 lg:top-3 lg:gap-2">
            <TypeBadge type={item.type} />
            {hasActivePromo && (
              <span className="rounded-md bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white sm:rounded-lg sm:px-2 sm:py-1 sm:text-xs">
                -{item.promo!.discount}%
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1 p-2 sm:gap-1.5 sm:p-2.5 lg:gap-2 lg:p-4">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-xs font-semibold leading-tight text-ink line-clamp-1 sm:text-sm lg:text-base">
              {item.name}
            </h3>
            <StatusBadge status={item.availabilityStatus} />
          </div>

          <p className="text-[10px] text-ink-muted line-clamp-1 sm:text-xs lg:text-sm">{item.model}</p>

          <div className="mt-auto">
            {hasActivePromo && promoPrice !== null ? (
              <>
                <p className="text-[10px] text-ink-muted line-through sm:text-xs lg:text-sm">
                  {formatCurrency(item.price)}
                </p>
                <p className="text-sm font-bold text-accent sm:text-base lg:text-lg">
                  {formatCurrency(promoPrice)}
                </p>
              </>
            ) : (
              <p className="text-sm font-bold text-accent sm:text-base lg:text-lg">
                {formatCurrency(item.price)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
