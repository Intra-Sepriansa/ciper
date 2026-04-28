<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        Voucher::query()->updateOrCreate(
            ['code' => 'CIVERS10'],
            [
                'name' => 'Diskon 10% Pelanggan Baru',
                'description' => 'Diskon 10% maks Rp10.000 untuk pesanan minimal Rp50.000.',
                'type' => 'percentage',
                'value' => 10,
                'min_purchase' => 50000,
                'max_discount' => 10000,
                'quota' => 200,
                'per_user_limit' => 1,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(3),
                'is_active' => true,
            ],
        );

        Voucher::query()->updateOrCreate(
            ['code' => 'GRATISONGKIR'],
            [
                'name' => 'Gratis Ongkir Jasinga',
                'description' => 'Gratis ongkir untuk pesanan delivery minimal Rp75.000 di area Jasinga.',
                'type' => 'free_shipping',
                'value' => 0,
                'min_purchase' => 75000,
                'max_discount' => 25000,
                'quota' => 100,
                'per_user_limit' => 2,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(2),
                'is_active' => true,
            ],
        );
    }
}
