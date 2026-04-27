<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('pages/about');
    }

    public function contact(): Response
    {
        return Inertia::render('pages/contact');
    }

    public function gallery(): Response
    {
        $items = Gallery::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get(['id', 'title', 'image_path', 'caption', 'category']);

        return Inertia::render('pages/gallery', ['items' => $items]);
    }
}
