"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { CatalogItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { StockUpdateModal } from "./stock-update-modal";

interface StockTableProps {
  items: CatalogItem[];
  type: "motor" | "mobil";
  onSuccess?: () => void;
}

export function StockTable({ items, type, onSuccess }: StockTableProps) {
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  return (
    <>
      <div className="overflow-x-auto rounded-xl bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-xs text-ink-muted">
              <th className="p-3 font-medium sm:p-4 text-center">No</th>
              <th className="p-3 font-medium sm:p-4">Nama</th>
              <th className="p-3 font-medium sm:p-4 text-center">Stok</th>
              <th className="p-3 font-medium sm:p-4 text-center">Terjual</th>
              <th className="p-3 font-medium sm:p-4 text-end">Modal</th>
              <th className="p-3 font-medium sm:p-4 text-end">Harga Jual</th>
              <th className="p-3 font-medium sm:p-4 text-center">Status</th>
              <th className="p-3 font-medium sm:p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.id}
                className="border-b border-stone-100 text-ink last:border-none"
              >
                <td className="p-3 text-ink-muted sm:p-4">{i + 1}</td>
                <td className="p-3 font-medium sm:p-4">{item.name}</td>
                <td className="p-3 sm:p-4 text-center">{item.stock}</td>
                <td className="p-3 sm:p-4 text-center">{item.stockSold}</td>
                <td className="p-3 sm:p-4 text-end">
                  {item.purchasePrice
                    ? formatCurrency(item.purchasePrice)
                    : "-"}
                </td>
                <td className="p-3 sm:p-4 text-end">{formatCurrency(item.price)}</td>
                <td className="p-3 sm:p-4 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.availabilityStatus === "available"
                        ? "bg-black/10 text-ink"
                        : "bg-surface text-ink-muted"
                    }`}
                  >
                    {item.availabilityStatus === "available"
                      ? "Tersedia"
                      : "Tidak Tersedia"}
                  </span>
                </td>
                <td className="p-3 sm:p-4 text-center">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="rounded-lg bg-black/10 border border-ink/20 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-black/20 active:bg-black/30 cursor-pointer"
                  >
                    Perbarui Stok
                    <Pencil className="ml-1.5 inline h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          {items.length > 0 && (
            <tr className="border-t-2 border-stone-200 font-semibold text-ink">
              <td className="p-3 sm:p-4"></td>
              <td className="p-3 text-sm sm:p-4">TOTAL</td>
              <td className="p-3 sm:p-4 text-center">{items.reduce((s, i) => s + (i.stock ?? 0), 0)}</td>
              <td className="p-3 sm:p-4 text-center">{items.reduce((s, i) => s + (i.stockSold ?? 0), 0)}</td>
              <td className="p-3 sm:p-4 text-end">{formatCurrency(items.reduce((s, i) => s + (i.purchasePrice ?? 0), 0))}</td>
              <td className="p-3 sm:p-4 text-end">{formatCurrency(items.reduce((s, i) => s + i.price, 0))}</td>
              <td className="p-3 sm:p-4"></td>
              <td className="p-3 sm:p-4"></td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <StockUpdateModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          type={type}
          onSuccess={onSuccess ?? (() => {})}
        />
      )}
    </>
  );
}
