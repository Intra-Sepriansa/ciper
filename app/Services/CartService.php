<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductAddon;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartService
{
    public function getOrCreateCart(Request $request): Cart
    {
        $sessionId = $request->session()->get('cart_session_id');
        if (! $sessionId) {
            $sessionId = (string) Str::uuid();
            $request->session()->put('cart_session_id', $sessionId);
        }

        $customerId = null;
        if ($user = $request->user()) {
            $customerId = $user->customer?->id;
        }

        return Cart::query()
            ->where(function ($query) use ($sessionId, $customerId): void {
                $query->where('session_id', $sessionId);
                if ($customerId) {
                    $query->orWhere('customer_id', $customerId);
                }
            })
            ->latest()
            ->firstOr(fn () => Cart::create([
                'session_id' => $sessionId,
                'customer_id' => $customerId,
                'expires_at' => now()->addDays(7),
            ]));
    }

    /**
     * @param  array{quantity?: int, variant_id?: int|null, addon_ids?: array<int, int>, note?: string|null}  $payload
     */
    public function addItem(Cart $cart, Product $product, array $payload): CartItem
    {
        $quantity = max(1, (int) ($payload['quantity'] ?? 1));
        $variant = null;
        if (! empty($payload['variant_id'])) {
            $variant = ProductVariant::query()
                ->where('product_id', $product->id)
                ->find($payload['variant_id']);
        }

        $unitPrice = $product->final_price + ($variant?->price_adjustment ?? 0);

        $addonIds = array_values(array_unique(array_map('intval', $payload['addon_ids'] ?? [])));
        /** @var Collection<int, ProductAddon> $addons */
        $addons = ProductAddon::query()
            ->where('product_id', $product->id)
            ->whereIn('id', $addonIds)
            ->get();

        $addonsPayload = $addons->map(fn (ProductAddon $a) => [
            'id' => $a->id,
            'name' => $a->name,
            'price' => (int) $a->price,
        ])->values()->all();

        $unitPrice += (int) $addons->sum('price');

        return DB::transaction(function () use ($cart, $product, $variant, $quantity, $unitPrice, $addonsPayload, $payload) {
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $unitPrice * $quantity,
                'addons' => $addonsPayload,
                'note' => $payload['note'] ?? null,
            ]);

            $cart->recalculateTotals();

            return $item;
        });
    }

    public function updateQuantity(CartItem $item, int $quantity): CartItem
    {
        $quantity = max(1, $quantity);
        $item->quantity = $quantity;
        $item->subtotal = $item->unit_price * $quantity;
        $item->save();
        $item->cart->recalculateTotals();

        return $item;
    }

    public function removeItem(CartItem $item): void
    {
        $cart = $item->cart;
        $item->delete();
        $cart->recalculateTotals();
    }

    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
        $cart->recalculateTotals();
    }

    /**
     * @return array<string, mixed>
     */
    public function summary(Cart $cart): array
    {
        $cart->loadMissing('items.product:id,name,slug,image_path', 'items.variant:id,name');

        return [
            'id' => $cart->id,
            'subtotal' => (int) $cart->subtotal,
            'item_count' => (int) $cart->items->sum('quantity'),
            'items' => $cart->items->map(fn (CartItem $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product?->name,
                'product_slug' => $item->product?->slug,
                'image_path' => $item->product?->image_path,
                'variant_id' => $item->product_variant_id,
                'variant_name' => $item->variant?->name,
                'quantity' => (int) $item->quantity,
                'unit_price' => (int) $item->unit_price,
                'subtotal' => (int) $item->subtotal,
                'addons' => $item->addons ?? [],
                'note' => $item->note,
            ])->values(),
        ];
    }
}
