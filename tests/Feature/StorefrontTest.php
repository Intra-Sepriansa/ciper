<?php

use App\Models\Category;
use App\Models\Product;
use Database\Seeders\SettingSeeder;

use function Pest\Laravel\get;

beforeEach(function (): void {
    $this->seed(SettingSeeder::class);
});

test('home page renders', function (): void {
    get(route('home'))->assertOk();
});

test('menu page renders products', function (): void {
    $category = Category::factory()->create();
    Product::factory()->for($category)->create(['name' => 'Sambal Khusus']);

    get(route('menu.index'))->assertOk();
});

test('about, contact, gallery, reservation pages render', function (): void {
    get(route('about'))->assertOk();
    get(route('contact'))->assertOk();
    get(route('gallery'))->assertOk();
    get(route('reservation.index'))->assertOk();
});

test('tracking lookup page renders', function (): void {
    get(route('tracking.index'))->assertOk();
});
