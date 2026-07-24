<?php

namespace Database\Seeders;

use App\Models\{DefectItem, Promo, Vehicle};
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $promo1 = Promo::where('title', 'Promo Lebaran 2026')->first();
        $promo2 = Promo::where('title', 'Cashback Rp 500.000')->first();

        // Honda Beat
        $v1 = Vehicle::create([
            'name' => 'Honda Beat',
            'model' => 'CBS',
            'license_plate' => 'D 1234 AB',
            'type' => 'matic',
            'price' => 18000000,
            'year' => 2023,
            'document_status' => 'complete',
            'tax_status' => 'active',
            'tax_expiry_year' => 2028,
            'defect_status' => 'none',
            'availability_status' => 'available',
            'stock' => 5,
            'stock_sold' => 2,
            'purchase_price' => 14000000,
            'promo_id' => $promo1->id,
        ]);

        DefectItem::create([
            'vehicle_id' => $v1->id,
            'part' => 'Spion Kiri',
            'description' => 'Lecet kecil pada spion kiri',
        ]);

        // Yamaha Mio
        Vehicle::create([
            'name' => 'Yamaha Mio',
            'model' => 'Mio Sporty',
            'license_plate' => 'D 5678 CD',
            'type' => 'matic',
            'price' => 15000000,
            'year' => 2022,
            'document_status' => 'complete',
            'tax_status' => 'active',
            'tax_expiry_year' => 2027,
            'defect_status' => 'minor',
            'availability_status' => 'available',
            'stock' => 3,
            'stock_sold' => 1,
            'purchase_price' => 12000000,
            'promo_id' => $promo2->id,
        ]);

        // Honda CB150R
        Vehicle::create([
            'name' => 'Honda CB150R',
            'model' => 'Streetfire',
            'license_plate' => 'D 9012 EF',
            'type' => 'sport',
            'price' => 32000000,
            'year' => 2024,
            'document_status' => 'complete',
            'tax_status' => 'active',
            'tax_expiry_year' => 2029,
            'defect_status' => 'none',
            'availability_status' => 'available',
            'stock' => 2,
            'stock_sold' => 0,
            'purchase_price' => 27000000,
        ]);

        // Kawasaki W175
        Vehicle::create([
            'name' => 'Kawasaki W175',
            'model' => 'SE',
            'license_plate' => 'D 3456 GH',
            'type' => 'cruiser',
            'price' => 38000000,
            'year' => 2023,
            'document_status' => 'incomplete',
            'document_note' => 'STNK dalam proses perpanjangan',
            'tax_status' => 'expired',
            'tax_expired_from' => 2025,
            'defect_status' => 'none',
            'availability_status' => 'available',
            'stock' => 1,
            'stock_sold' => 0,
            'purchase_price' => 33000000,
        ]);

        // Honda Scoopy
        Vehicle::create([
            'name' => 'Honda Scoopy',
            'model' => 'Prestige',
            'license_plate' => 'D 7890 IJ',
            'type' => 'scoopy',
            'price' => 21000000,
            'year' => 2024,
            'document_status' => 'complete',
            'tax_status' => 'active',
            'tax_expiry_year' => 2029,
            'defect_status' => 'none',
            'availability_status' => 'sold_out',
            'stock' => 0,
            'stock_sold' => 3,
            'purchase_price' => 17000000,
            'promo_id' => $promo1->id,
        ]);
    }
}
