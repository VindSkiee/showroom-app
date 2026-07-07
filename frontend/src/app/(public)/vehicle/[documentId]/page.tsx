import { notFound } from "next/navigation";
import { getVehicle } from "@/lib/strapi";
import { VehicleDetail } from "@/components/vehicle/vehicle-detail";
import { PageContent } from "@/components/motion/page-content";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ documentId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { documentId } = await params;
  try {
    const { data } = await getVehicle(documentId);
    return {
      title: `${data.name} - ${data.model}`,
      description: `${data.name} ${data.model} tahun ${data.year} harga ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(data.price)}`,
      openGraph: {
        title: `${data.name} - ${data.model}`,
        description: `Motor ${data.name} tahun ${data.year}`,
      },
    };
  } catch {
    return { title: "Motor Tidak Ditemukan" };
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { documentId } = await params;

  let vehicle;
  try {
    const response = await getVehicle(documentId);
    vehicle = response.data;
  } catch {
    notFound();
  }

  if (!vehicle) {
    notFound();
  }

  return (
    <PageContent>
      <VehicleDetail vehicle={vehicle} />
    </PageContent>
  );
}
