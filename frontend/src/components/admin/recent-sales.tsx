"use client";

import { useState, useEffect, useCallback } from "react";
import type { Sale } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

interface SalesFilter {
  dateFrom: string;
  dateTo: string;
}

function computeStats(sales: Sale[]) {
  const terjual = sales.reduce((acc, s) => acc + (s.quantity ?? 1), 0);
  const revenue = sales.reduce((acc, s) => acc + s.salePrice, 0);
  const motorSold = sales
    .filter((s) => s.vehicle)
    .reduce((acc, s) => acc + (s.quantity ?? 1), 0);
  const mobilSold = sales
    .filter((s) => s.car)
    .reduce((acc, s) => acc + (s.quantity ?? 1), 0);
  return { terjual, revenue, motorSold, mobilSold };
}

function formatDynamicHeader(filter: SalesFilter): string {
  const sameDay = filter.dateFrom === filter.dateTo;
  return sameDay
    ? "Penjualan Hari Ini"
    : `Penjualan ${formatDate(filter.dateFrom)} hingga ${formatDate(filter.dateTo)}`;
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

  const handlePrint = async () => {
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);

    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("LAPORAN PENJUALAN", 14, 20);

    // Date range + print date
    doc.setFontSize(10);
    doc.text(formatDynamicHeader({ dateFrom, dateTo }), 14, 28);
    doc.text(`Dicetak: ${formatDate(new Date().toISOString())}`, 14, 34);

    // Summary
    doc.setFontSize(11);
    doc.text(`Revenue: ${formatCurrency(stats.revenue)}`, 14, 46);
    doc.text(`Terjual Motor: ${stats.motorSold} unit`, 14, 52);
    doc.text(`Terjual Mobil: ${stats.mobilSold} unit`, 14, 58);

    // Table
    autoTable(doc, {
      startY: 64,
      head: [["No", "Tanggal", "Nama", "Tipe", "Qty", "Harga Jual"]],
      body: sales.map((s, i) => [
        String(i + 1),
        formatDate(s.saleDate),
        s.vehicle?.name || s.car?.name || "Unknown",
        s.vehicle ? "Motor" : "Mobil",
        String(s.quantity ?? 1),
        formatCurrency(s.salePrice),
      ]),
      foot: [
        [
          "",
          "",
          "",
          "TOTAL",
          String(stats.terjual),
          formatCurrency(stats.revenue),
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      footStyles: { fillColor: [240, 239, 236], textColor: [28, 25, 23], fontStyle: "bold", fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 },
        4: { halign: "center", cellWidth: 12 },
        5: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    doc.save(`laporan-penjualan-${dateFrom}-${dateTo}.pdf`);
  };

  return (
    <section className="mt-8">
      {/* Header + Print button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">
          {formatDynamicHeader({ dateFrom, dateTo })}
        </h2>
        <button
          onClick={handlePrint}
          disabled={loading || sales.length === 0}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black/80 active:bg-black/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cetak Laporan
        </button>
      </div>

      {/* Stats cards */}
      <div className="mb-4 mt-3 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl bg-surface p-4 sm:p-6">
          <p className="text-xs text-ink-muted sm:text-sm">Total Revenue</p>
          <p className="mt-1 text-xl font-bold text-green-500 sm:text-2xl">
            {formatCurrency(stats.revenue)}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 sm:p-6">
          <p className="text-xs text-ink-muted sm:text-sm">Terjual Motor</p>
          <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">{stats.motorSold} unit</p>
        </div>
        <div className="rounded-xl bg-surface p-4 sm:p-6">
          <p className="text-xs text-ink-muted sm:text-sm">Terjual Mobil</p>
          <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">{stats.mobilSold} unit</p>
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
            const itemName = sale.vehicle?.name || sale.car?.name || "Unknown";
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
                  <p className="text-sm font-bold text-green-500 sm:text-base">
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
