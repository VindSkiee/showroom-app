import { notFound } from "next/navigation";
import { getCar } from "@/lib/strapi";
import { CatalogDetail } from "@/components/catalog/catalog-detail";
import { PageContent } from "@/components/motion/page-content";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ documentId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { documentId } = await params;
  try {
    const { data } = await getCar(documentId);
    return {
      title: `${data.name} - ${data.model}`,
      description: `${data.name} ${data.model} tahun ${data.year} harga ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(data.price)}`,
      openGraph: {
        title: `${data.name} - ${data.model}`,
        description: `Mobil ${data.name} tahun ${data.year}`,
      },
    };
  } catch {
    return { title: "Mobil Tidak Ditemukan" };
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { documentId } = await params;

  let car;
  try {
    const response = await getCar(documentId);
    car = response.data;
  } catch {
    notFound();
  }

  if (!car) {
    notFound();
  }

  return (
    <PageContent>
      <CatalogDetail item={car} />
    </PageContent>
  );
}
