import type { StrapiResponse, StrapiSingleResponse, Vehicle, VehicleFilters, Promo } from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchStrapi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(
      error?.error?.message || `Strapi error: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

// ============================================
// Vehicles
// ============================================

export async function getVehicles(
  filters?: VehicleFilters
): Promise<StrapiResponse<Vehicle>> {
  const params = buildVehicleParams(filters);
  return fetchStrapi<StrapiResponse<Vehicle>>(`/vehicles${params}`);
}

export async function getVehicle(
  documentId: string
): Promise<StrapiSingleResponse<Vehicle>> {
  return fetchStrapi<StrapiSingleResponse<Vehicle>>(`/vehicles/${documentId}?populate=*`);
}

// ============================================
// Promos
// ============================================

export async function getActivePromos(): Promise<StrapiResponse<Promo>> {
  return fetchStrapi<StrapiResponse<Promo>>(
    "/promos?filters[isActive][$eq]=true&populate=*"
  );
}

// ============================================
// Helpers
// ============================================

function buildVehicleParams(filters?: VehicleFilters): string {
  if (!filters) return "?populate=*";

  const params = new URLSearchParams();

  // Population
  params.set("populate", "*");

  // Filters
  if (filters.type) params.set("filters[type][$eq]", filters.type);
  if (filters.availabilityStatus) params.set("filters[availabilityStatus][$eq]", filters.availabilityStatus);
  if (filters.documentStatus)
    params.set("filters[documentStatus][$eq]", filters.documentStatus);
  if (filters.taxStatus)
    params.set("filters[taxStatus][$eq]", filters.taxStatus);
  if (filters.defectStatus)
    params.set("filters[defectStatus][$eq]", filters.defectStatus);
  if (filters.name) params.set("filters[name][$containsi]", filters.name);
  if (filters.priceMin)
    params.set("filters[price][$gte]", String(filters.priceMin));
  if (filters.priceMax)
    params.set("filters[price][$lte]", String(filters.priceMax));
  if (filters.yearMin)
    params.set("filters[year][$gte]", String(filters.yearMin));
  if (filters.yearMax)
    params.set("filters[year][$lte]", String(filters.yearMax));

  // Sort
  if (filters.sort) params.set("sort", filters.sort);

  // Pagination
  if (filters.page) params.set("pagination[page]", String(filters.page));
  if (filters.pageSize)
    params.set("pagination[pageSize]", String(filters.pageSize));

  return `?${params.toString()}`;
}

// ============================================
// Image URL Helper
// ============================================

export function getStrapiImageUrl(
  url: string,
  baseUrl?: string
): string {
  if (url.startsWith("http")) return url;
  const base = baseUrl || STRAPI_URL;
  return `${base}${url}`;
}
