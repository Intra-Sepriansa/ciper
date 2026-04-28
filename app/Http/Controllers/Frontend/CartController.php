<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    public function index(Request $request): Response
    {
        $cart = $this->cartService->getOrCreateCart($request);

        return Inertia::render('cart/index', [
            'cart' => $this->cartService->summary($cart),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:50'],
            'variant_id' => ['nullable', 'integer'],
            'addon_ids' => ['nullable', 'array'],
            'addon_ids.*' => ['integer'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $product = Product::query()
            ->where('is_available', true)
            ->findOrFail($validated['product_id']);

        $cart = $this->cartService->getOrCreateCart($request);
        $this->cartService->addItem($cart, $product, $validated);
        $request->session()->put('cart_count', $this->cartService->summary($cart)['item_count']);

        return back()->with('success', 'Ditambahkan ke keranjang.');
    }

    public function update(Request $request, CartItem $item): RedirectResponse
    {
        $cart = $this->cartService->getOrCreateCart($request);
        abort_unless($item->cart_id === $cart->id, 403);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        $this->cartService->updateQuantity($item, $validated['quantity']);
        $request->session()->put('cart_count', $this->cartService->summary($cart)['item_count']);

        return back();
    }

    public function destroy(Request $request, CartItem $item): RedirectResponse
    {
        $cart = $this->cartService->getOrCreateCart($request);
        abort_unless($item->cart_id === $cart->id, 403);

        $this->cartService->removeItem($item);
        $request->session()->put('cart_count', $this->cartService->summary($cart)['item_count']);

        return back()->with('success', 'Item dihapus dari keranjang.');
    }
}
