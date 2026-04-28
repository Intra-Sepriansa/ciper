<?php

namespace Database\Seeders;

use App\Models\ShippingRate;
use Illuminate\Database\Seeder;

class ShippingRateSeeder extends Seeder
{
    public function run(): void
    {
        $rates = [
            ['name' => 'Antar Lokal Jasinga (0-3 km)', 'area' => 'Jasinga', 'price' => 5000, 'etd_minutes' => 30, 'min_order' => 30000, 'sort_order' => 1],
            ['name' => 'Antar Lokal Jasinga (3-7 km)', 'area' => 'Jasinga', 'price' => 10000, 'etd_minutes' => 45, 'min_order' => 30000, 'sort_order' => 2],
            ['name' => 'Antar Pamagersari', 'area' => 'Pamagersari', 'price' => 7000, 'etd_minutes' => 30, 'min_order' => 30000, 'sort_order' => 3],
            ['name' => 'Antar Cigudeg', 'area' => 'Cigudeg', 'price' => 18000, 'etd_minutes' => 60, 'min_order' => 50000, 'sort_order' => 4],
            ['name' => 'Antar Tenjo / Parung Panjang', 'area' => 'Tenjo', 'price' => 25000, 'etd_minutes' => 75, 'min_order' => 50000, 'sort_order' => 5],
        ];

        foreach ($rates as $rate) {
            ShippingRate::query()->updateOrCreate(
                ['name' => $rate['name']],
                $rate + ['is_active' => true],
            );
        }
    }
}
