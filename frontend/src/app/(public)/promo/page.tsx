import { Container } from "@/components/ui/container";
import { PromoBanner } from "@/components/promo/promo-banner";
import { PageContent } from "@/components/motion/page-content";
import { ScrollRevealWrapper } from "@/components/motion/scroll-reveal-wrapper";
import { getActivePromos } from "@/lib/strapi";
import type { Promo } from "@/lib/types";

export const metadata = {
  title: "Promo - Showroom Motor",
  description: "Promo menarik untuk motor bekas berkualitas",
};

export default async function PromoPage() {
  let promos: Promo[] = [];

  try {
    const res = await getActivePromos();
    promos = res.data;
  } catch {
    // Strapi not reachable - show empty state
  }

  return (
    <PageContent>
      <main className="py-6 sm:py-8">
        <Container>
          {/* Header */}
          <ScrollRevealWrapper>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">
                Promo Spesial
              </h1>
              <p className="mt-2 text-ink-muted">
                Jangan lewatkan penawaran menarik dari kami
              </p>
            </div>
          </ScrollRevealWrapper>

          {/* Promo list */}
          {promos.length > 0 ? (
            <div className="flex flex-col gap-6">
              {promos.map((promo) => (
                <ScrollRevealWrapper key={promo.id}>
                  <PromoBanner promo={promo} />
                </ScrollRevealWrapper>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="mb-4 h-12 w-12 text-ink-muted"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
              <p className="text-lg text-ink-muted">Belum ada promo saat ini</p>
              <p className="mt-2 text-sm text-ink-muted">
                Silakan cek kembali nanti untuk penawaran menarik
              </p>
            </div>
          )}
        </Container>
      </main>
    </PageContent>
  );
}
