import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
  totalStock: number;
  totalSold: number;
  totalRevenue: number;
  totalProfit: number;
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
  totalStock,
  totalSold,
  totalRevenue,
  totalProfit,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <StatCard label="Total Stok" value={`${totalStock} unit`} />
      <StatCard label="Terjual" value={`${totalSold} unit`} />
      <StatCard label="Revenue" value={formatCurrency(totalRevenue)} />
      <StatCard
        label="Profit Kotor"
        value={formatCurrency(totalProfit)}
        accent={totalProfit > 0}
      />
    </div>
  );
}
