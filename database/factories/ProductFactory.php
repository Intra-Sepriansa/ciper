<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        $price = $this->faker->numberBetween(15, 80) * 1000;

        return [
            'category_id' => Category::factory(),
            'name' => Str::title($name),
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(4)),
            'sku' => Str::upper(Str::random(8)),
            'short_description' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'price' => $price,
            'discount_price' => null,
            'stock' => 50,
            'track_stock' => false,
            'is_available' => true,
            'is_popular' => false,
            'is_recommended' => false,
            'sort_order' => 0,
        ];
    }
}
