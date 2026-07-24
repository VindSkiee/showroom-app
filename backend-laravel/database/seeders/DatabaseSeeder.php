<?php

namespace Database\Seeders;

use App\Models\{Car, DefectItem, Promo, Sale, Vehicle};
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            PromoSeeder::class,
            VehicleSeeder::class,
            CarSeeder::class,
        ]);
    }
}
