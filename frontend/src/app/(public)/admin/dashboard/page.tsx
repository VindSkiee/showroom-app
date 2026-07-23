"use client";

import { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/ui/container";
import { PageContent } from "@/components/motion/page-content";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { StockTable } from "@/components/admin/stock-table";
import { RecentSales } from "@/components/admin/recent-sales";
import { LogoutButton } from "@/components/admin/logout-button";
import type { Vehicle, Car, Sale } from "@/lib/types";

function getMonthRange() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: `${first.toISOString().split("T")[0]}T00:00:00.000Z`,
    end: `${last.toISOString().split("T")[0]}T23:59:59.999Z`,
  };
}

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [monthSales, setMonthSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const month = getMonthRange();
      const salesParams = new URLSearchParams();
      salesParams.set("pagination[pageSize]", "500");
      salesParams.set("populate", "vehicle,car");
      salesParams.set("filters[saleDate][$gte]", month.start);
      salesParams.set("filters[saleDate][$lte]", month.end);

      const [vehiclesRes, carsRes, salesRes] = await Promise.all([
        fetch("/api/vehicles?pagination[pageSize]=100").then((r) => r.json()),
        fetch("/api/cars?pagination[pageSize]=100").then((r) => r.json()),
        fetch(`/api/sales?${salesParams.toString()}`).then((r) => r.json()),
      ]);
      setVehicles(vehiclesRes.data || []);
      setCars(carsRes.data || []);
      setMonthSales(salesRes.data || []);
    } catch (e) {
      console.error("Dashboard: fetch data failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allItems = [...vehicles, ...cars];

  const totalSold = allItems.reduce((sum, item) => sum + (item.stockSold ?? 0), 0);
  const totalRevenue = monthSales.reduce((sum, s) => sum + s.salePrice, 0);

  const motorStock = vehicles.reduce((s, i) => s + (i.stock ?? 0), 0);
  const mobilStock = cars.reduce((s, i) => s + (i.stock ?? 0), 0);

  return (
    <PageContent>
      <main className="py-6 sm:py-8">
        <Container>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-ink-muted">
                Ringkasan stok dan keuangan
              </p>
            </div>
            <LogoutButton />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-ink-muted">Memuat data...</p>
            </div>
          ) : (
            <>
              <DashboardStats
                motorStock={motorStock}
                mobilStock={mobilStock}
                totalSold={totalSold}
                totalRevenue={totalRevenue}
              />

              {/* Tables */}
              <div className="mt-8 space-y-8">
                <section>
                  <h2 className="mb-3 text-lg font-bold text-ink">
                    Stok Motor
                  </h2>
                  <StockTable items={vehicles} type="motor" onSuccess={fetchData} />
                </section>

                <section>
                  <h2 className="mb-3 text-lg font-bold text-ink">
                    Stok Mobil
                  </h2>
                  <StockTable items={cars} type="mobil" onSuccess={fetchData} />
                </section>
              </div>

              {/* Sales section — self-contained component */}
              <RecentSales />
            </>
          )}
        </Container>
      </main>
    </PageContent>
  );
}
