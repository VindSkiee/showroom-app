<?php

namespace Database\Seeders;

use App\Models\{Car, DefectItem, Promo};
use Illuminate\Database\Seeder;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        $promo1 = Promo::where('title', 'Promo Lebaran 2026')->first();

        // Toyota Avanza
        $c1 = Car::create([
            'name' => 'Toyota Avanza',
            'model' => '1.5 G CVT',
            'license_plate' => 'D 1111 AA',
            'type' => 'mpv',
            'price' => 265000000,
            'year' => 2023,
            'document_status' => 'complete',
            'tax_status' => 'active',
            'tax_expiry_year' => 2028,
            'defect_status' => 'none',
            'availability_status' => 'available',
            'stock' => 3,
            'stock_sold' => 1,
            'purchase_price' => 230000000,
            'promo_id' => $promo1->id,
        ]);

        DefectItem::create([
            'car_id' => $c1->id,
            'part' => 'Bumper Depan',
            'description' => 'Goresan ringan pada bumper depan sebelah kiri',
        ]);

        // Honda Brio
        Car::create([
            'name' => 'Honda Brio',
            'model' => 'RS CVT',
            'license_plate' => 'D 2222 BB',
            'type' => 'hatchback',
            'price' => 225000000,
            'year' => 2024,
            'document_status' => 'complete',
            'tax_status' => 'active',
            'tax_expiry_year' => 2029,
            'defect_status' => 'none',
            'availability_status' => 'available',
            'stock' => 2,
            'stock_sold' => 0,
            'purchase_price' => 195000000,
        ]);

        // Toyota Rush
        Car::create([
            'name' => 'Toyota Rush',
            'model' => '1.5 S CVT',
            'license_plate' => 'D 3333 CC',
            'type' => 'suv',
            'price' => 285000000,
            'year' => 2023,
            'document_status' => 'complete',
            'tax_status' => 'active',
            'tax_expiry_year' => 2028,
            'defect_status' => 'minor',
            'availability_status' => 'available',
            'stock' => 2,
            'stock_sold' => 1,
            'purchase_price' => 250000000,
        ]);

        // Daihatsu Xenia
        Car::create([
            'name' => 'Daihatsu Xenia',
            'model' => '1.3 R CVT',
            'license_plate' => 'D 4444 DD',
            'type' => 'mpv',
            'price' => 235000000,
            'year' => 2022,
            'document_status' => 'incomplete',
            'document_note' => 'BPKB belum balik nama',
            'tax_status' => 'expired',
            'tax_expired_from' => 2025,
            'defect_status' => 'none',
            'availability_status' => 'available',
            'stock' => 1,
            'stock_sold' => 0,
            'purchase_price' => 205000000,
        ]);

        // Suzuki Ertiga
        Car::create([
            'name' => 'Suzuki Ertiga',
            'model' => 'GX AT',
            'license_plate' => 'D 5555 EE',
            'type' => 'mpv',
            'price' => 255000000,
            'year' => 2024,
            'document_status' => 'complete',
            'tax_status' => 'active',
            'tax_expiry_year' => 2029,
            'defect_status' => 'none',
            'availability_status' => 'sold_out',
            'stock' => 0,
            'stock_sold' => 2,
            'purchase_price' => 220000000,
            'promo_id' => $promo1->id,
        ]);
    }
}
