<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Gallery;
use App\Models\Product;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $popular = Product::query()
            ->available()
            ->with('category:id,name')
            ->popular()
            ->orderByDesc('total_sold')
            ->limit(8)
            ->get(['id', 'name', 'slug', 'image_path', 'price', 'discount_price', 'short_description', 'category_id', 'is_popular', 'is_recommended']);

        $familyPackages = Product::query()
            ->available()
            ->whereHas('category', fn ($q) => $q->where('slug', 'paket-keluarga'))
            ->limit(4)
            ->get(['id', 'name', 'slug', 'image_path', 'price', 'discount_price', 'short_description', 'category_id']);

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->limit(10)
            ->get(['id', 'name', 'slug', 'icon', 'image_path']);

        $gallery = Gallery::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->limit(6)
            ->get(['id', 'title', 'image_path', 'caption', 'category']);

        $testimonials = Review::query()
            ->where('is_published', true)
            ->orderByDesc('created_at')
            ->limit(6)
            ->get(['id', 'reviewer_name', 'rating', 'comment']);

        return Inertia::render('home/index', [
            'popular' => $popular,
            'familyPackages' => $familyPackages,
            'categories' => $categories,
            'gallery' => $gallery,
            'testimonials' => $testimonials,
            'highlights' => [
                'rating' => 4.3,
                'reviews_count' => 845,
                'price_from' => 25000,
            ],
        ]);
    }
}
