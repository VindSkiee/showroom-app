<?php

namespace App\Services;

use App\Models\{Car, Sale, Vehicle};
use Illuminate\Support\Facades\{DB, Log};

class SaleService
{
    public function createSale(array $data): Sale
    {
        DB::beginTransaction();

        try {
            $item = null;
            $itemType = null;

            if (!empty($data['vehicle_id'])) {
                $item = Vehicle::findOrFail($data['vehicle_id']);
                $itemType = 'vehicle';
            } elseif (!empty($data['car_id'])) {
                $item = Car::findOrFail($data['car_id']);
                $itemType = 'car';
            }

            if (!$item) {
                throw new \Exception('Vehicle or Car must be specified');
            }

            $sale = Sale::create([
                'sale_date' => $data['sale_date'] ?? now()->toDateString(),
                'sale_price' => $data['sale_price'],
                'buyer_name' => $data['buyer_name'] ?? null,
                'quantity' => $data['quantity'] ?? 1,
                'vehicle_id' => $data['vehicle_id'] ?? null,
                'car_id' => $data['car_id'] ?? null,
            ]);

            $quantity = $data['quantity'] ?? 1;
            $item->stock = max(0, $item->stock - $quantity);
            $item->stock_sold = $item->stock_sold + $quantity;

            if ($item->stock <= 0) {
                $item->availability_status = 'sold_out';
            }

            $item->save();

            DB::commit();

            Log::info("Sale created: ID {$sale->id}, {$itemType} ID {$item->id}, stock: {$item->stock}");

            return $sale->load($itemType);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Sale creation failed: " . $e->getMessage());
            throw $e;
        }
    }

    public function deleteSale(Sale $sale): void
    {
        DB::beginTransaction();

        try {
            $item = $sale->vehicle ?? $sale->car;
            $itemType = $sale->vehicle ? 'vehicle' : 'car';

            if ($item) {
                $quantity = $sale->quantity ?? 1;
                $item->stock = $item->stock + $quantity;
                $item->stock_sold = max(0, $item->stock_sold - $quantity);
                $item->availability_status = 'available';
                $item->save();

                Log::info("Stock rollback: {$itemType} ID {$item->id}, new stock: {$item->stock}");
            }

            $sale->delete();

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Sale deletion failed: " . $e->getMessage());
            throw $e;
        }
    }
}
