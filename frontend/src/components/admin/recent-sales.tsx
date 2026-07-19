import type { Sale } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RecentSalesProps {
  sales: Sale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <div className="space-y-3">
      {sales.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">
          Belum ada penjualan
        </p>
      ) : (
        sales.map((sale) => {
          const itemName =
            sale.vehicle?.name || sale.car?.name || "Unknown";
          const itemType = sale.vehicle ? "Motor" : "Mobil";
          return (
            <div
              key={sale.id}
              className="flex items-center justify-between rounded-xl bg-surface p-4"
            >
              <div>
                <p className="text-sm font-medium text-ink">{itemName}</p>
                <p className="text-xs text-ink-muted">
                  {formatDate(sale.saleDate)} &middot; {itemType}
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
        })
      )}
    </div>
  );
}
