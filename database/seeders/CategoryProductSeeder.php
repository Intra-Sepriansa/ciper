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
                'image' => 'menu/paket-nasi-ayam-bakar.jpg',
                'products' => [
                    ['name' => 'Paket Nasi Ayam Bakar', 'price' => 32000, 'short' => 'Ayam bakar bumbu kecap, nasi, lalapan, sambal.', 'popular' => true, 'image' => 'menu/paket-nasi-ayam-bakar.jpg'],
                    ['name' => 'Paket Nasi Ayam Goreng', 'price' => 28000, 'short' => 'Ayam goreng kremes, nasi hangat, lalapan.', 'popular' => false, 'image' => 'menu/paket-nasi-ayam-goreng.jpg'],
                    ['name' => 'Paket Nasi Bebek Goreng', 'price' => 38000, 'short' => 'Bebek goreng renyah, nasi, sambal mangga.', 'popular' => false, 'image' => 'menu/paket-nasi-bebek-goreng.jpg'],
                ],
            ],
            [
                'name' => 'Gurame',
                'icon' => 'fish',
                'image' => 'menu/gurame-asam-manis.jpg',
                'products' => [
                    ['name' => 'Gurame Asam Manis', 'price' => 75000, 'short' => 'Menu andalan. Gurame goreng saus asam manis.', 'popular' => true, 'recommended' => true, 'image' => 'menu/gurame-asam-manis.jpg'],
                    ['name' => 'Gurame Bakar Madu', 'price' => 78000, 'short' => 'Gurame bakar bumbu madu, harum dan empuk.', 'popular' => true, 'image' => 'menu/gurame-bakar-madu.jpg'],
                    ['name' => 'Gurame Pesmol', 'price' => 72000, 'short' => 'Gurame goreng siram bumbu pesmol kuning.', 'popular' => false, 'image' => 'menu/gurame-pesmol.jpg'],
                ],
            ],
            [
                'name' => 'Lele',
                'icon' => 'fish',
                'image' => 'menu/pecak-lele.jpg',
                'products' => [
                    ['name' => 'Pecak Lele', 'price' => 25000, 'short' => 'Lele goreng siram sambal pecak khas Sunda.', 'popular' => true, 'image' => 'menu/pecak-lele.jpg'],
                    ['name' => 'Lele Goreng Sambal Terasi', 'price' => 22000, 'short' => 'Lele goreng kremes, sambal terasi mantap.', 'popular' => false, 'image' => 'menu/lele-goreng-sambal-terasi.jpg'],
                ],
            ],
            [
                'name' => 'Ayam',
                'icon' => 'drumstick',
                'image' => 'menu/ayam-bakar-madu.jpg',
                'products' => [
                    ['name' => 'Ayam Bakar Madu', 'price' => 30000, 'short' => 'Ayam bakar bumbu madu, manis dan gurih.', 'popular' => true, 'image' => 'menu/ayam-bakar-madu.jpg'],
                    ['name' => 'Ayam Penyet Sambal', 'price' => 27000, 'short' => 'Ayam goreng penyet sambal segar.', 'popular' => false, 'image' => 'menu/ayam-penyet-sambal.jpg'],
                ],
            ],
            [
                'name' => 'Steak',
                'icon' => 'beef',
                'image' => 'menu/chicken-steak.jpg',
                'products' => [
                    ['name' => 'Chicken Steak', 'price' => 45000, 'short' => 'Chicken steak saus mushroom, kentang, salad.', 'popular' => true, 'image' => 'menu/chicken-steak.jpg'],
                    ['name' => 'Beef Steak Black Pepper', 'price' => 65000, 'short' => 'Beef steak saus blackpepper, kentang goreng.', 'popular' => false, 'image' => 'menu/beef-steak-black-pepper.jpg'],
                ],
            ],
            [
                'name' => 'Pizza',
                'icon' => 'pizza',
                'image' => 'menu/pizza-civers-supreme.jpg',
                'products' => [
                    ['name' => 'Pizza Civers Supreme', 'price' => 68000, 'short' => 'Topping lengkap khas Cidurian Riverside.', 'popular' => true, 'image' => 'menu/pizza-civers-supreme.jpg'],
                    ['name' => 'Pizza Margherita', 'price' => 55000, 'short' => 'Klasik. Saus tomat, mozzarella, basil.', 'popular' => false, 'image' => 'menu/pizza-margherita.jpg'],
                ],
            ],
            [
                'name' => 'Ramen',
                'icon' => 'soup',
                'image' => 'menu/paket-ramen.jpg',
                'products' => [
                    ['name' => 'Paket Ramen', 'price' => 42000, 'short' => 'Ramen kuah gurih, telur, ayam suwir.', 'popular' => true, 'image' => 'menu/paket-ramen.jpg'],
                    ['name' => 'Ramen Pedas Setan', 'price' => 45000, 'short' => 'Ramen extra pedas, untuk pencinta sambal.', 'popular' => false, 'image' => 'menu/ramen-pedas-setan.jpg'],
                ],
            ],
            [
                'name' => 'Paket Keluarga',
                'icon' => 'users',
                'image' => 'menu/paket-keluarga-hemat.jpg',
                'products' => [
                    ['name' => 'Paket Keluarga Hemat', 'price' => 145000, 'short' => 'Untuk 4 orang. Gurame, ayam, nasi, sayur, sambal.', 'popular' => true, 'recommended' => true, 'image' => 'menu/paket-keluarga-hemat.jpg'],
                    ['name' => 'Paket Keluarga Premium', 'price' => 220000, 'short' => 'Untuk 6 orang. Gurame, ayam, lele, sop iga, lalapan.', 'popular' => true, 'recommended' => true, 'image' => 'menu/paket-keluarga-premium.jpg'],
                ],
            ],
            [
                'name' => 'Sop Durian',
                'icon' => 'ice-cream',
                'image' => 'menu/sop-durian-original.jpg',
                'products' => [
                    ['name' => 'Sop Durian Original', 'price' => 28000, 'short' => 'Sop durian asli, manis, dingin segar.', 'popular' => true, 'image' => 'menu/sop-durian-original.jpg'],
                    ['name' => 'Sop Durian Cokelat', 'price' => 32000, 'short' => 'Sop durian dengan topping cokelat.', 'popular' => false, 'image' => 'menu/sop-durian-cokelat.jpg'],
                ],
            ],
            [
                'name' => 'Minuman',
                'icon' => 'glass-water',
                'image' => 'menu/es-teh-manis-jumbo.jpg',
                'products' => [
                    ['name' => 'Es Cendol Durian Alpukat', 'price' => 22000, 'short' => 'Es cendol klasik dengan durian dan alpukat.', 'popular' => true, 'image' => 'menu/es-cendol-durian-alpukat.jpg'],
                    ['name' => 'Es Teh Manis Jumbo', 'price' => 10000, 'short' => 'Segelas besar es teh manis dingin.', 'popular' => false, 'image' => 'menu/es-teh-manis-jumbo.jpg'],
                    ['name' => 'Es Jeruk Peras', 'price' => 15000, 'short' => 'Jeruk peras asli, segar tanpa pemanis buatan.', 'popular' => false, 'image' => 'menu/es-jeruk-peras.jpg'],
                ],
            ],
            [
                'name' => 'Dessert',
                'icon' => 'cake',
                'image' => 'menu/pisang-bakar-cokelat-keju.jpg',
                'products' => [
                    ['name' => 'Pisang Bakar Cokelat Keju', 'price' => 25000, 'short' => 'Pisang bakar topping cokelat dan keju.', 'popular' => false, 'image' => 'menu/pisang-bakar-cokelat-keju.jpg'],
                    ['name' => 'Roti Bakar Klasik', 'price' => 18000, 'short' => 'Roti bakar klasik dengan selai pilihan.', 'popular' => false, 'image' => 'menu/roti-bakar-klasik.jpg'],
                ],
            ],
        ];

        foreach ($catalog as $sortIdx => $cat) {
            $category = Category::query()->updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'icon' => $cat['icon'],
                    'image_path' => $cat['image'] ?? null,
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
                        'image_path' => $p['image'] ?? null,
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
