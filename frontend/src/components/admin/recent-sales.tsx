"use client";

import { useState, useEffect, useCallback } from "react";
import type { Sale } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

interface SalesStats {
  terjual: number;
  revenue: number;
}

interface SalesFilter {
  dateFrom: string;
  dateTo: string;
}

function computeStats(sales: Sale[]): SalesStats {
  return {
    terjual: sales.reduce((acc, s) => acc + (s.quantity ?? 1), 0),
    revenue: sales.reduce((acc, s) => acc + s.salePrice, 0),
  };
}

function DynamicHeader({ filter }: { filter: SalesFilter }) {
  const sameDay = filter.dateFrom === filter.dateTo;
  const text = sameDay
    ? "Penjualan Hari Ini"
    : `Penjualan ${formatDate(filter.dateFrom)} hingga ${formatDate(filter.dateTo)}`;
  return (
    <h2 className="mb-3 text-lg font-bold text-ink">{text}</h2>
  );
}

export function RecentSales() {
  const today = getTodayISO();
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const start = `${from}T00:00:00.000Z`;
      const end = `${to}T23:59:59.999Z`;
      const params = new URLSearchParams();
      params.set("sort", "saleDate:desc");
      params.set("populate", "vehicle,car");
      params.set("pagination[pageSize]", "100");
      params.set("filters[saleDate][$gte]", start);
      params.set("filters[saleDate][$lte]", end);

      const res = await fetch(`/api/sales?${params.toString()}`);
      const data = await res.json();
      setSales(data.data || []);
    } catch (e) {
      console.error("Gagal mengambil data penjualan", e);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales(dateFrom, dateTo);
  }, [dateFrom, dateTo, fetchSales]);

  const stats = computeStats(sales);
  const motorSold = sales.filter((s) => s.vehicle).reduce((acc, s) => acc + (s.quantity ?? 1), 0);
  const mobilSold = sales.filter((s) => s.car).reduce((acc, s) => acc + (s.quantity ?? 1), 0);

  return (
    <section className="mt-8">
      <DynamicHeader filter={{ dateFrom, dateTo }} />

      {/* Sales stats */}
      <div className="mb-4 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl bg-surface p-4 sm:p-6">
          <p className="text-xs text-ink-muted sm:text-sm">Revenue</p>
          <p className="mt-1 text-xl font-bold text-accent sm:text-2xl">
            {formatCurrency(stats.revenue)}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 sm:p-6">
          <p className="text-xs text-ink-muted sm:text-sm">Terjual Motor</p>
          <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">{motorSold} unit</p>
        </div>
        <div className="rounded-xl bg-surface p-4 sm:p-6">
          <p className="text-xs text-ink-muted sm:text-sm">Terjual Mobil</p>
          <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">{mobilSold} unit</p>
        </div>
      </div>

      {/* Date filter */}
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Dari tanggal</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            max={dateTo}
            className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Hingga tanggal</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom}
            className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Sales list */}
      {loading ? (
        <p className="py-8 text-center text-sm text-ink-muted">Memuat data...</p>
      ) : sales.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">
          Belum ada penjualan
        </p>
      ) : (
        <div className="space-y-3">
          {sales.map((sale) => {
            const itemName =
              sale.vehicle?.name || sale.car?.name || "Unknown";
            const itemType = sale.vehicle ? "Motor" : "Mobil";
            const qty = sale.quantity ?? 1;
            return (
              <div
                key={sale.id}
                className="flex items-center justify-between rounded-xl bg-surface p-4"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{itemName}</p>
                  <p className="text-xs text-ink-muted">
                    {formatDate(sale.saleDate)} &middot; {itemType}
                    {qty > 1 && ` \u00b7 ${qty} unit`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent">
                    {formatCurrency(sale.salePrice)}
                  </p>
                  {sale.buyerName && (
                    <p className="text-xs text-ink-muted">{sale.buyerName}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
