<?php

namespace Database\Seeders;

use App\Models\Gallery;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['title' => 'Suasana Pinggir Sungai', 'category' => 'suasana', 'image_path' => 'gallery/riverside-1.jpg'],
            ['title' => 'Lesehan Keluarga', 'category' => 'suasana', 'image_path' => 'gallery/lesehan-1.jpg'],
            ['title' => 'Gurame Asam Manis', 'category' => 'menu', 'image_path' => 'gallery/gurame-1.jpg'],
            ['title' => 'Paket Keluarga', 'category' => 'menu', 'image_path' => 'gallery/paket-keluarga.jpg'],
            ['title' => 'Area Indoor', 'category' => 'suasana', 'image_path' => 'gallery/indoor-1.jpg'],
            ['title' => 'Acara Keluarga', 'category' => 'acara', 'image_path' => 'gallery/event-1.jpg'],
        ];

        foreach ($items as $idx => $row) {
            Gallery::query()->updateOrCreate(
                ['title' => $row['title']],
                $row + ['sort_order' => $idx, 'is_published' => true],
            );
        }
    }
}
