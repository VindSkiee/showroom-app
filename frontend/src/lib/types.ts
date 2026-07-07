// ============================================
// Strapi Response Types
// ============================================

export interface StrapiResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
}

export interface StrapiMeta {
  pagination?: StrapiPagination;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// ============================================
// Strapi Media Types
// ============================================

export interface StrapiMedia {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: Record<string, StrapiMediaFormat> | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string;
  url: string;
}

// ============================================
// Component Types
// ============================================

export interface DefectItem {
  id: number;
  part: string;
  description: string;
  images: StrapiMedia[];
}

// ============================================
// Content Types
// ============================================

export type VehicleType = "matic" | "manual" | "sport" | "cruiser" | "scoopy";
export type VehicleStatus = "available" | "sold_out";
export type DocumentStatus = "complete" | "incomplete";
export type TaxStatus = "active" | "expired" | "unknown";
export type DefectStatus = "none" | "minor" | "major";

export interface Vehicle {
  id: number;
  name: string;
  model: string;
  licensePlate: string;
  type: VehicleType;
  price: number;
  year: number;
  documentStatus: DocumentStatus;
  documentNote: string | null;
  taxStatus: TaxStatus;
  taxExpiryYear: number | null;
  taxExpiredFrom: number | null;
  defectStatus: DefectStatus;
  status: VehicleStatus;
  defects: DefectItem[];
  images: StrapiMedia[];
  video: StrapiMedia | null;
  promo: Promo | null;
  createdAt: string;
  updatedAt: string;
}

export interface Promo {
  id: number;
  title: string;
  description: string | null;
  discount: number;
  isActive: boolean;
  banner: StrapiMedia | null;
  vehicles: Vehicle[];
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: number;
  saleDate: string;
  salePrice: number;
  buyerName: string | null;
  vehicle: Vehicle;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Query Types
// ============================================

export interface VehicleFilters {
  type?: VehicleType;
  status?: VehicleStatus;
  documentStatus?: DocumentStatus;
  taxStatus?: TaxStatus;
  defectStatus?: DefectStatus;
  name?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
}
