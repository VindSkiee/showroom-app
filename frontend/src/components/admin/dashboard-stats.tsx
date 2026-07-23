"use client";

import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
  motorStock: number;
  mobilStock: number;
  totalSold: number;
  totalRevenue: number;
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl bg-surface p-4 sm:p-6">
      <p className="text-xs text-ink-muted sm:text-sm">{label}</p>
      <p
        className={`mt-1 text-xl font-bold sm:text-2xl ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function DashboardStats({
  motorStock,
  mobilStock,
  totalSold,
  totalRevenue,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <StatCard label="Stok Motor" value={`${motorStock} unit`} />
      <StatCard label="Stok Mobil" value={`${mobilStock} unit`} />
      <StatCard label="Total Terjual" value={`${totalSold} unit`} />
      <StatCard label="Revenue Bulan Ini" value={formatCurrency(totalRevenue)} accent />
    </div>
  );
}
