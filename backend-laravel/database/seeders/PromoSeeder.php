<?php

namespace Database\Seeders;

use App\Models\Promo;
use Illuminate\Database\Seeder;

class PromoSeeder extends Seeder
{
    public function run(): void
    {
        Promo::create([
            'title' => 'Promo Lebaran 2026',
            'description' => 'Diskon spesial untuk pembelian tunai. Berlaku untuk semua unit motor dan mobil.',
            'discount' => 10,
            'is_active' => true,
        ]);

        Promo::create([
            'title' => 'Cashback Rp 500.000',
            'description' => 'Cashback langsung untuk pembelian dengan kredit. Syarat dan ketentuan berlaku.',
            'discount' => 5,
            'is_active' => true,
        ]);
    }
}
