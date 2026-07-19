import type { CatalogItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface StockTableProps {
  items: CatalogItem[];
  type: "motor" | "mobil";
}

export function StockTable({ items, type }: StockTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-xs text-ink-muted">
            <th className="p-3 font-medium sm:p-4">No</th>
            <th className="p-3 font-medium sm:p-4">Nama</th>
            <th className="p-3 font-medium sm:p-4">Stok</th>
            <th className="p-3 font-medium sm:p-4">Terjual</th>
            <th className="p-3 font-medium sm:p-4">Modal</th>
            <th className="p-3 font-medium sm:p-4">Harga Jual</th>
            <th className="p-3 font-medium sm:p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const profit = item.purchasePrice
              ? item.price - item.purchasePrice
              : 0;
            return (
              <tr
                key={item.id}
                className="border-b border-stone-100 text-ink last:border-none"
              >
                <td className="p-3 text-ink-muted sm:p-4">{i + 1}</td>
                <td className="p-3 font-medium sm:p-4">{item.name}</td>
                <td className="p-3 sm:p-4">{item.stock}</td>
                <td className="p-3 sm:p-4">{item.stockSold}</td>
                <td className="p-3 sm:p-4">
                  {item.purchasePrice
                    ? formatCurrency(item.purchasePrice)
                    : "-"}
                </td>
                <td className="p-3 sm:p-4">{formatCurrency(item.price)}</td>
                <td className="p-3 sm:p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.availabilityStatus === "available"
                        ? "bg-accent/10 text-accent"
                        : "bg-surface text-ink-muted"
                    }`}
                  >
                    {item.availabilityStatus === "available"
                      ? "Tersedia"
                      : "Tidak Tersedia"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
