"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StatusBadge, TypeBadge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import type { Vehicle, DefectItem } from "@/lib/types";

interface VehicleDetailProps {
  vehicle: Vehicle;
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-ink-muted">{label}</span>
      <span className={`text-sm font-medium ${accent ? "text-accent" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}

function DefectCard({ defect }: { defect: DefectItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="rounded-xl bg-surface p-4">
      <span className="text-xs font-medium text-ink">{defect.part}</span>
      <p className="mt-1 text-sm text-ink-muted">{defect.description}</p>
      {defect.images && defect.images.length > 0 && !imgError && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {defect.images.map((img) => (
            <div key={img.id} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
              <Image
                src={getStrapiImageUrl(img.formats?.small?.url || img.url)}
                alt={defect.part}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => setImgError(true)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function taxStatusLabel(status: Vehicle["taxStatus"]): string {
  const labels = { active: "Aktif", expired: "Mati", unknown: "Tidak Diketahui" };
  return labels[status];
}

function documentStatusLabel(status: Vehicle["documentStatus"]): string {
  const labels = { complete: "Lengkap", incomplete: "Belum Lengkap" };
  return labels[status];
}

function defectStatusLabel(status: Vehicle["defectStatus"]): string {
  const labels = { none: "Tidak Ada", minor: "Ringan", major: "Berat" };
  return labels[status];
}

export function VehicleDetail({ vehicle }: VehicleDetailProps) {
  const [mainImgError, setMainImgError] = useState(false);

  const mainImage =
    vehicle.images && vehicle.images.length > 0 && !mainImgError
      ? getStrapiImageUrl(vehicle.images[0].formats?.large?.url || vehicle.images[0].url)
      : null;

  const secondaryImages = (vehicle.images || []).slice(1, 5);

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4">
        {/* Main image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={vehicle.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              onError={() => setMainImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-muted">
              <span>Tidak ada gambar</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex gap-2">
            <TypeBadge type={vehicle.type} />
          </div>
          <div className="absolute right-3 top-3">
            <StatusBadge status={vehicle.availabilityStatus} />
          </div>
        </div>

        {/* Thumbnail strip */}
        {secondaryImages.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {secondaryImages.map((img) => (
              <div
                key={img.id}
                className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100"
              >
                <Image
                  src={getStrapiImageUrl(img.formats?.thumbnail?.url || img.url)}
                  alt={`${vehicle.name} ${img.name}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">{vehicle.name}</h1>
            {vehicle.promo?.isActive && (
              <span className="rounded-lg bg-danger px-2 py-1 text-xs font-bold text-white">
                -{vehicle.promo.discount}%
              </span>
            )}
          </div>
          <p className="mt-1 text-base text-ink-muted">{vehicle.model}</p>
          {vehicle.promo?.isActive ? (
            <div className="mt-3">
              <p className="text-lg text-ink-muted line-through">
                {formatCurrency(vehicle.price)}
              </p>
              <p className="text-3xl font-bold text-accent">
                {formatCurrency(Math.round(vehicle.price - (vehicle.price * vehicle.promo.discount / 100)))}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-3xl font-bold text-accent">{formatCurrency(vehicle.price)}</p>
          )}
        </div>

        <div className="my-6 h-px bg-stone-200" />

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Tahun" value={String(vehicle.year)} />
          <InfoRow label="Plat Nomor" value={vehicle.licensePlate} />
          <InfoRow label="Surat" value={documentStatusLabel(vehicle.documentStatus)} />
          <InfoRow
            label="Pajak"
            value={
              vehicle.taxStatus === "active" && vehicle.taxExpiryYear
                ? `Aktif s/d ${vehicle.taxExpiryYear}`
                : vehicle.taxStatus === "expired" && vehicle.taxExpiredFrom
                  ? `Mati dari ${vehicle.taxExpiredFrom}`
                  : taxStatusLabel(vehicle.taxStatus)
            }
            accent={vehicle.taxStatus === "active"}
          />
          <InfoRow label="Kondisi" value={defectStatusLabel(vehicle.defectStatus)} />
          <InfoRow label="Status" value={vehicle.availabilityStatus === "available" ? "Tersedia" : "Terjual"} />
        </div>

        {/* Document note */}
        {vehicle.documentNote && (
          <>
            <div className="my-6 h-px bg-stone-200" />
            <div>
              <h2 className="text-sm font-semibold text-ink">Catatan Surat</h2>
              <p className="mt-2 text-sm text-ink-muted">{vehicle.documentNote}</p>
            </div>
          </>
        )}

        {/* Defects */}
        {vehicle.defectStatus !== "none" && vehicle.defects && vehicle.defects.length > 0 && (
          <>
            <div className="my-6 h-px bg-stone-200" />
            <div>
              <h2 className="text-sm font-semibold text-ink">Kecacatan</h2>
              <div className="mt-3 space-y-3">
                {vehicle.defects.map((defect) => (
                  <DefectCard key={defect.id} defect={defect} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Promo */}
        {vehicle.promo && (
          <>
            <div className="my-6 h-px bg-stone-200" />
            <div className="rounded-xl bg-accent/10 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-accent">Promo: {vehicle.promo.title}</span>
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                  -{vehicle.promo.discount}%
                </span>
              </div>
              {vehicle.promo.description && (
                <p className="mt-2 text-sm text-ink-muted">{vehicle.promo.description}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* WhatsApp CTA */}
      {vehicle.availabilityStatus === "available" && (
        <WhatsAppButton
          vehicleName={vehicle.name}
          price={vehicle.promo?.isActive
            ? Math.round(vehicle.price - (vehicle.price * vehicle.promo.discount / 100))
            : vehicle.price}
        />
      )}
    </>
  );
}
