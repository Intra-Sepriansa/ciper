<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', 'string'],
            'sort' => ['nullable', 'in:price_asc,price_desc,popular,newest'],
            'available_only' => ['nullable', 'boolean'],
            'min_price' => ['nullable', 'integer', 'min:0'],
            'max_price' => ['nullable', 'integer', 'min:0'],
        ]);

        $query = Product::query()
            ->with('category:id,name,slug')
            ->where('is_available', true);

        if (! empty($validated['q'])) {
            $term = '%'.$validated['q'].'%';
            $query->where(function ($q) use ($term): void {
                $q->where('name', 'like', $term)
                    ->orWhere('short_description', 'like', $term);
            });
        }

        if (! empty($validated['category'])) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $validated['category']));
        }

        if (isset($validated['min_price'])) {
            $query->where('price', '>=', $validated['min_price']);
        }
        if (isset($validated['max_price'])) {
            $query->where('price', '<=', $validated['max_price']);
        }

        $sort = $validated['sort'] ?? 'popular';
        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest' => $query->latest(),
            default => $query->orderByDesc('is_popular')->orderByDesc('total_sold')->orderBy('sort_order'),
        };

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'icon']);

        return Inertia::render('menu/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $validated,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::query()
            ->with(['category:id,name,slug', 'images:id,product_id,image_path,alt_text', 'variants', 'addons'])
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Product::query()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_available', true)
            ->limit(6)
            ->get(['id', 'name', 'slug', 'image_path', 'price', 'discount_price', 'short_description']);

        return Inertia::render('menu/show', [
            'product' => $product,
            'related' => $related,
        ]);
    }
}
