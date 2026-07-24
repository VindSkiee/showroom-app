"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { CatalogItem } from "@/lib/types";

interface StockUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CatalogItem;
  type: "motor" | "mobil";
  onSuccess: () => void;
}

type Tab = "stock" | "sold";

export function StockUpdateModal({
  isOpen,
  onClose,
  item,
  type,
  onSuccess,
}: StockUpdateModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("stock");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(item.price);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("stock");
      setQuantity(1);
      setSalePrice(item.price);
      setError(null);
    }
  }, [isOpen, item.price]);

  const handleClose = useCallback(() => {
    if (!loading) onClose();
  }, [loading, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  const adjustQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      if (activeTab === "stock") {
        const newStock = item.stock + quantity;
        const endpoint =
          type === "motor"
            ? `/api/vehicles/${item.documentId}`
            : `/api/cars/${item.documentId}`;

        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: newStock }),
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) {
          throw new Error(data.error || "Gagal memperbarui stok");
        }
      } else {
        if (quantity > item.stock) {
          throw new Error("Stok tidak mencukupi");
        }

        const payload: Record<string, unknown> = {
          salePrice,
          quantity,
        };

        if (type === "motor") {
          payload.vehicleId = Number(item.documentId);
        } else {
          payload.carId = Number(item.documentId);
        }

        const res = await fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) {
          throw new Error(data.error || "Gagal mencatat penjualan");
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-stone-200 px-6 py-4">
          <h3 className="text-lg font-bold text-ink">{item.name}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            Stok saat ini: <span className="font-medium text-ink">{item.stock}</span>
            {activeTab === "sold" && (
              <span className="ml-2">
                | Terjual: <span className="font-medium text-ink">{item.stockSold}</span>
              </span>
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => {
              setActiveTab("stock");
              setError(null);
            }}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "stock"
                ? "border-b-2 border-accent text-accent"
                : "text-ink-muted hover:text-ink"
            )}
          >
            Pengaturan Stok
          </button>
          <button
            onClick={() => {
              setActiveTab("sold");
              setError(null);
            }}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "sold"
                ? "border-b-2 border-accent text-accent"
                : "text-ink-muted hover:text-ink"
            )}
          >
            Stok Terjual
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {activeTab === "stock" ? (
            <div>
              <p className="mb-3 text-sm text-ink-muted">
                Atur jumlah stok tanpa mempengaruhi revenue atau profit.
              </p>
              <QuantityInput quantity={quantity} onAdjust={adjustQuantity} />
              <p className="mt-2 text-xs text-ink-muted">
                Stok setelah perubahan:{" "}
                <span className="font-medium text-ink">
                  {item.stock + quantity}
                </span>
              </p>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm text-ink-muted">
                Catat penjualan. Stok akan berkurang dan tercatat sebagai revenue.
              </p>
              <QuantityInput quantity={quantity} onAdjust={adjustQuantity} />
              {quantity > item.stock && (
                <p className="mt-1 text-xs text-red-500">
                  Melebihi stok yang tersedia
                </p>
              )}
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-ink">
                  Harga Jual Aktual
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-muted">Rp</span>
                  <input
                    type="text"
                    value={salePrice.toLocaleString("id-ID")}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      setSalePrice(Number(raw) || 0);
                    }}
                    className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-stone-200 px-6 py-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface active:bg-stone-200 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (activeTab === "sold" && quantity > item.stock)}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all",
              "bg-accent hover:bg-accent-hover active:bg-accent-hover",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {loading ? "Memproses..." : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuantityInput({
  quantity,
  onAdjust,
}: {
  quantity: number;
  onAdjust: (delta: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onAdjust(-1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-lg font-medium text-ink transition-colors hover:bg-surface active:bg-stone-200"
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val) && val >= 1) onAdjust(val - quantity);
        }}
        className="h-10 w-20 rounded-xl border border-stone-200 text-center text-sm font-medium text-ink focus:border-accent focus:outline-none"
      />
      <button
        onClick={() => onAdjust(1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-lg font-medium text-ink transition-colors hover:bg-surface active:bg-stone-200"
      >
        +
      </button>
    </div>
  );
}
