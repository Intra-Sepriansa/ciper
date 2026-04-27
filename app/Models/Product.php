<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'category_id', 'name', 'slug', 'sku', 'image_path', 'short_description', 'description',
    'price', 'discount_price', 'stock', 'track_stock', 'is_available', 'is_popular',
    'is_recommended', 'sort_order', 'total_sold', 'average_rating', 'reviews_count', 'meta',
])]
class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'discount_price' => 'integer',
            'stock' => 'integer',
            'track_stock' => 'boolean',
            'is_available' => 'boolean',
            'is_popular' => 'boolean',
            'is_recommended' => 'boolean',
            'sort_order' => 'integer',
            'total_sold' => 'integer',
            'reviews_count' => 'integer',
            'average_rating' => 'decimal:2',
            'meta' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('sort_order');
    }

    public function addons(): HasMany
    {
        return $this->hasMany(ProductAddon::class)->orderBy('sort_order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getFinalPriceAttribute(): int
    {
        return $this->discount_price && $this->discount_price < $this->price
            ? (int) $this->discount_price
            : (int) $this->price;
    }

    public function getDiscountPercentAttribute(): ?int
    {
        if (! $this->discount_price || $this->discount_price >= $this->price) {
            return null;
        }

        return (int) round((($this->price - $this->discount_price) / $this->price) * 100);
    }

    public function getInStockAttribute(): bool
    {
        if (! $this->track_stock) {
            return $this->is_available;
        }

        return $this->is_available && $this->stock > 0;
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('is_available', true);
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->where('is_popular', true);
    }
}
