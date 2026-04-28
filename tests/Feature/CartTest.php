<?php

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;

use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

test('guest can add product to cart and update quantity', function (): void {
    $category = Category::factory()->create();
    $product = Product::factory()->for($category)->create([
        'name' => 'Gurame Asam Manis',
        'price' => 75000,
        'is_available' => true,
        'track_stock' => false,
    ]);

    post(route('cart.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ])->assertRedirect();

    get(route('cart.index'))->assertOk();

    $itemId = CartItem::query()->latest('id')->value('id');

    patch(route('cart.update', ['item' => $itemId]), ['quantity' => 3])
        ->assertRedirect();

    expect(CartItem::find($itemId)->quantity)->toBe(3);

    delete(route('cart.destroy', ['item' => $itemId]))
        ->assertRedirect();

    expect(CartItem::find($itemId))->toBeNull();
});

test('product cannot be added when not available', function (): void {
    $category = Category::factory()->create();
    $product = Product::factory()->for($category)->create([
        'is_available' => false,
        'track_stock' => false,
    ]);

    post(route('cart.store'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ])->assertNotFound();
});
