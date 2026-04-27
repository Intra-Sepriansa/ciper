<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoryProductSeeder extends Seeder
{
    public function run(): void
    {
        /** @var array<int, array{name: string, icon: string, products: array<int, array<string, mixed>>}> $catalog */
        $catalog = [
            [
                'name' => 'Paket Nasi',
                'icon' => 'utensils',
                'products' => [
                    ['name' => 'Paket Nasi Ayam Bakar', 'price' => 32000, 'short' => 'Ayam bakar bumbu kecap, nasi, lalapan, sambal.', 'popular' => true],
                    ['name' => 'Paket Nasi Ayam Goreng', 'price' => 28000, 'short' => 'Ayam goreng kremes, nasi hangat, lalapan.', 'popular' => false],
                    ['name' => 'Paket Nasi Bebek Goreng', 'price' => 38000, 'short' => 'Bebek goreng renyah, nasi, sambal mangga.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Gurame',
                'icon' => 'fish',
                'products' => [
                    ['name' => 'Gurame Asam Manis', 'price' => 75000, 'short' => 'Menu andalan. Gurame goreng saus asam manis.', 'popular' => true, 'recommended' => true],
                    ['name' => 'Gurame Bakar Madu', 'price' => 78000, 'short' => 'Gurame bakar bumbu madu, harum dan empuk.', 'popular' => true],
                    ['name' => 'Gurame Pesmol', 'price' => 72000, 'short' => 'Gurame goreng siram bumbu pesmol kuning.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Lele',
                'icon' => 'fish',
                'products' => [
                    ['name' => 'Pecak Lele', 'price' => 25000, 'short' => 'Lele goreng siram sambal pecak khas Sunda.', 'popular' => true],
                    ['name' => 'Lele Goreng Sambal Terasi', 'price' => 22000, 'short' => 'Lele goreng kremes, sambal terasi mantap.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Ayam',
                'icon' => 'drumstick',
                'products' => [
                    ['name' => 'Ayam Bakar Madu', 'price' => 30000, 'short' => 'Ayam bakar bumbu madu, manis dan gurih.', 'popular' => true],
                    ['name' => 'Ayam Penyet Sambal', 'price' => 27000, 'short' => 'Ayam goreng penyet sambal segar.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Steak',
                'icon' => 'beef',
                'products' => [
                    ['name' => 'Chicken Steak', 'price' => 45000, 'short' => 'Chicken steak saus mushroom, kentang, salad.', 'popular' => true],
                    ['name' => 'Beef Steak Black Pepper', 'price' => 65000, 'short' => 'Beef steak saus blackpepper, kentang goreng.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Pizza',
                'icon' => 'pizza',
                'products' => [
                    ['name' => 'Pizza Civers Supreme', 'price' => 68000, 'short' => 'Topping lengkap khas Cidurian Riverside.', 'popular' => true],
                    ['name' => 'Pizza Margherita', 'price' => 55000, 'short' => 'Klasik. Saus tomat, mozzarella, basil.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Ramen',
                'icon' => 'soup',
                'products' => [
                    ['name' => 'Paket Ramen', 'price' => 42000, 'short' => 'Ramen kuah gurih, telur, ayam suwir.', 'popular' => true],
                    ['name' => 'Ramen Pedas Setan', 'price' => 45000, 'short' => 'Ramen extra pedas, untuk pencinta sambal.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Paket Keluarga',
                'icon' => 'users',
                'products' => [
                    ['name' => 'Paket Keluarga Hemat', 'price' => 145000, 'short' => 'Untuk 4 orang. Gurame, ayam, nasi, sayur, sambal.', 'popular' => true, 'recommended' => true],
                    ['name' => 'Paket Keluarga Premium', 'price' => 220000, 'short' => 'Untuk 6 orang. Gurame, ayam, lele, sop iga, lalapan.', 'popular' => true, 'recommended' => true],
                ],
            ],
            [
                'name' => 'Sop Durian',
                'icon' => 'ice-cream',
                'products' => [
                    ['name' => 'Sop Durian Original', 'price' => 28000, 'short' => 'Sop durian asli, manis, dingin segar.', 'popular' => true],
                    ['name' => 'Sop Durian Cokelat', 'price' => 32000, 'short' => 'Sop durian dengan topping cokelat.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Minuman',
                'icon' => 'glass-water',
                'products' => [
                    ['name' => 'Es Cendol Durian Alpukat', 'price' => 22000, 'short' => 'Es cendol klasik dengan durian dan alpukat.', 'popular' => true],
                    ['name' => 'Es Teh Manis Jumbo', 'price' => 10000, 'short' => 'Segelas besar es teh manis dingin.', 'popular' => false],
                    ['name' => 'Es Jeruk Peras', 'price' => 15000, 'short' => 'Jeruk peras asli, segar tanpa pemanis buatan.', 'popular' => false],
                ],
            ],
            [
                'name' => 'Dessert',
                'icon' => 'cake',
                'products' => [
                    ['name' => 'Pisang Bakar Cokelat Keju', 'price' => 25000, 'short' => 'Pisang bakar topping cokelat dan keju.', 'popular' => false],
                    ['name' => 'Roti Bakar Klasik', 'price' => 18000, 'short' => 'Roti bakar klasik dengan selai pilihan.', 'popular' => false],
                ],
            ],
        ];

        foreach ($catalog as $sortIdx => $cat) {
            $category = Category::query()->updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'icon' => $cat['icon'],
                    'sort_order' => $sortIdx,
                    'is_active' => true,
                ],
            );

            foreach ($cat['products'] as $idx => $p) {
                Product::query()->updateOrCreate(
                    ['slug' => Str::slug($p['name'])],
                    [
                        'category_id' => $category->id,
                        'name' => $p['name'],
                        'short_description' => $p['short'] ?? null,
                        'description' => $p['short'] ?? null,
                        'price' => $p['price'],
                        'discount_price' => null,
                        'stock' => 50,
                        'track_stock' => false,
                        'is_available' => true,
                        'is_popular' => $p['popular'] ?? false,
                        'is_recommended' => $p['recommended'] ?? false,
                        'sort_order' => $idx,
                    ],
                );
            }
        }
    }
}
