import { Container } from "@/components/ui/container";
import { PageContent } from "@/components/motion/page-content";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { StockTable } from "@/components/admin/stock-table";
import { RecentSales } from "@/components/admin/recent-sales";
import { getVehicles, getCars, getSales } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let vehicles: import("@/lib/types").Vehicle[] = [];
  let cars: import("@/lib/types").Car[] = [];
  let sales: import("@/lib/types").Sale[] = [];

  try { vehicles = (await getVehicles({ pageSize: 100 })).data; }
  catch (e) { console.error("Dashboard: getVehicles failed", e); }

  try { cars = (await getCars({ pageSize: 100 })).data; }
  catch (e) { console.error("Dashboard: getCars failed", e); }

  try { sales = (await getSales({ pageSize: 10, sort: "createdAt:desc" })).data; }
  catch (e) { console.error("Dashboard: getSales failed", e); }

  const allItems = [...vehicles, ...cars];

  const totalStock = allItems.reduce((sum, item) => sum + (item.stock ?? 0), 0);
  const totalSold = allItems.reduce((sum, item) => sum + (item.stockSold ?? 0), 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice, 0);

  const totalModal = allItems.reduce(
    (sum, item) => sum + (item.purchasePrice ?? 0) * (item.stockSold ?? 0),
    0
  );
  const totalProfit = totalRevenue - totalModal;

  return (
    <PageContent>
      <main className="py-6 sm:py-8">
        <Container>
          <h1 className="mb-1 text-2xl font-bold text-ink sm:text-3xl">
            Dashboard
          </h1>
          <p className="mb-6 text-sm text-ink-muted">
            Ringkasan stok dan keuangan
          </p>

          <DashboardStats
            totalStock={totalStock}
            totalSold={totalSold}
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
          />

          {/* Tables */}
          <div className="mt-8 space-y-8">
            <section>
              <h2 className="mb-3 text-lg font-bold text-ink">
                Stok Motor
              </h2>
              <StockTable items={vehicles} type="motor" />
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-ink">
                Stok Mobil
              </h2>
              <StockTable items={cars} type="mobil" />
            </section>
          </div>

          {/* Recent Sales */}
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-ink">
              Penjualan Terbaru
            </h2>
            <RecentSales sales={sales} />
          </section>
        </Container>
      </main>
    </PageContent>
  );
}
