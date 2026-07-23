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
      // Tambahkan h-full agar semua card dalam satu baris grid memiliki tinggi yang sama
      className="h-full"
      whileHover={prefersReduced ? undefined : { scale: 1.02 }}
      whileTap={prefersReduced ? undefined : { scale: 0.98 }}
      transition={{
        type: "spring",
        ...motionTokens.spring.snappy,
      }}
    >
      <Link
        href={`${basePath}/${item.documentId}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface sm:rounded-2xl shadow-sm border border-stone-100"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              // sizes sudah sangat tepat untuk 2 kolom mobile
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-muted">
              <span className="text-xs sm:text-sm">No Image</span>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute left-1.5 top-1.5 flex flex-wrap gap-1 pr-1.5 sm:left-2 sm:top-2 sm:gap-1.5 lg:left-3 lg:top-3 lg:gap-2 lg:pr-3">
            <TypeBadge type={item.type} />
            {hasActivePromo && (
              <span className="rounded-md bg-danger px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm sm:rounded-lg sm:px-2 sm:py-1 sm:text-xs">
                -{item.promo!.discount}%
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {/* Hapus gap-1 agar ruang bisa dimaksimalkan, gunakan margin spesifik */}
        <div className="flex flex-1 flex-col p-2.5 sm:p-3 lg:p-4">
          
          {/* Judul & Status */}
          {/* Ubah flex-row menjadi flex-col di mobile agar status badge tidak menekan judul */}
          <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:justify-between sm:gap-2">
            <h3 className="text-xs font-bold leading-tight text-ink line-clamp-2 sm:text-sm lg:text-base">
              {item.name}
            </h3>
            {/* Bungkus shrink-0 agar badge tidak gepeng */}
            <div className="shrink-0">
              <StatusBadge status={item.availabilityStatus} />
            </div>
          </div>

          <p className="mt-1 text-[10px] text-ink-muted line-clamp-1 sm:mt-1.5 sm:text-xs lg:text-sm">
            {item.model}
          </p>

          {/* Area Harga (mt-auto akan mendorong harga selalu ke bawah) */}
          <div className="mt-auto pt-2 sm:pt-3">
            {hasActivePromo && promoPrice !== null ? (
              <div className="flex flex-col">
                <p className="text-[10px] text-ink-muted line-through sm:text-xs lg:text-sm">
                  {formatCurrency(item.price)}
                </p>
                <p className="text-sm font-bold text-accent sm:text-base lg:text-lg leading-tight">
                  {formatCurrency(promoPrice)}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold text-ink sm:text-base lg:text-lg leading-tight">
                {formatCurrency(item.price)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}