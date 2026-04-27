<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'code', 'name', 'description', 'type', 'value', 'min_purchase', 'max_discount',
    'quota', 'used_count', 'per_user_limit', 'starts_at', 'expires_at', 'is_active',
])]
class Voucher extends Model
{
    use SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'integer',
            'min_purchase' => 'integer',
            'max_discount' => 'integer',
            'quota' => 'integer',
            'used_count' => 'integer',
            'per_user_limit' => 'integer',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function usages(): HasMany
    {
        return $this->hasMany(VoucherUsage::class);
    }

    public function isUsable(int $subtotal, ?int $customerId = null): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($this->starts_at && now()->lt($this->starts_at)) {
            return false;
        }
        if ($this->expires_at && now()->gt($this->expires_at)) {
            return false;
        }
        if ($subtotal < $this->min_purchase) {
            return false;
        }
        if ($this->quota !== null && $this->used_count >= $this->quota) {
            return false;
        }
        if ($customerId && $this->per_user_limit !== null) {
            $count = $this->usages()->where('customer_id', $customerId)->count();
            if ($count >= $this->per_user_limit) {
                return false;
            }
        }

        return true;
    }
}
