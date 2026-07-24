export function getStrapiUrl(): string {
  return process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";
}
