<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'order_number', 'customer_id', 'customer_name', 'customer_phone', 'customer_email',
    'order_type', 'scheduled_at', 'guest_count', 'table_note', 'dine_in_area',
    'shipping_address_id', 'shipping_courier', 'shipping_service', 'shipping_etd',
    'shipping_cost', 'delivery_address_snapshot',
    'subtotal', 'discount_total', 'tax_total', 'service_total', 'grand_total',
    'voucher_id', 'voucher_code', 'status', 'payment_status', 'payment_method',
    'customer_note', 'admin_note', 'cancel_reason', 'tracking_token',
    'placed_at', 'paid_at', 'completed_at', 'cancelled_at', 'expires_at', 'meta',
])]
class Order extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'order_type' => OrderType::class,
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'scheduled_at' => 'datetime',
            'placed_at' => 'datetime',
            'paid_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'expires_at' => 'datetime',
            'subtotal' => 'integer',
            'discount_total' => 'integer',
            'tax_total' => 'integer',
            'service_total' => 'integer',
            'grand_total' => 'integer',
            'shipping_cost' => 'integer',
            'meta' => 'array',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment(): HasOne
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }

    public function shippingAddress(): BelongsTo
    {
        return $this->belongsTo(ShippingAddress::class);
    }

    public function isPayable(): bool
    {
        return in_array($this->payment_status, [
            PaymentStatus::Unpaid,
            PaymentStatus::Pending,
            PaymentStatus::Failed,
        ], true);
    }
}
