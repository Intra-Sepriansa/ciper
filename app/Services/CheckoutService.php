<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentStatus;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Voucher;
use App\Models\VoucherUsage;
use App\Services\Shipping\ShippingService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(private readonly ShippingService $shipping) {}

    /**
     * @param  array{
     *   customer: array{name: string, phone: string, email?: string|null},
     *   order_type: string,
     *   scheduled_at?: string|null,
     *   guest_count?: int|null,
     *   table_note?: string|null,
     *   dine_in_area?: string|null,
     *   shipping_rate_id?: int|null,
     *   delivery_address?: array<string, mixed>|null,
     *   voucher_code?: string|null,
     *   payment_method?: string|null,
     *   customer_note?: string|null
     * }  $payload
     */
    public function place(Cart $cart, array $payload, ?int $userId = null): Order
    {
        $cart->loadMissing('items.product');

        if ($cart->items->isEmpty()) {
            throw ValidationException::withMessages([
                'cart' => 'Keranjang masih kosong.',
            ]);
        }

        $orderType = OrderType::from($payload['order_type']);

        $minOrder = (int) (Setting::get('min_order_amount', 0) ?? 0);
        if ($cart->subtotal < $minOrder) {
            throw ValidationException::withMessages([
                'cart' => 'Minimum order Rp'.number_format($minOrder, 0, ',', '.').'.',
            ]);
        }

        foreach ($cart->items as $item) {
            $product = $item->product;
            if (! $product || ! $product->is_available) {
                throw ValidationException::withMessages([
                    'cart' => 'Menu '.($product?->name ?? 'tidak tersedia').' sedang tidak tersedia.',
                ]);
            }
            if ($product->track_stock && $product->stock < $item->quantity) {
                throw ValidationException::withMessages([
                    'cart' => 'Stok '.$product->name.' tidak mencukupi.',
                ]);
            }
        }

        $shippingCost = 0;
        $shippingMeta = [
            'shipping_courier' => null,
            'shipping_service' => null,
            'shipping_etd' => null,
        ];

        if ($orderType === OrderType::Delivery) {
            $rate = $payload['shipping_rate_id']
                ? $this->shipping->findRate((int) $payload['shipping_rate_id'])
                : null;

            if (! $rate) {
                throw ValidationException::withMessages([
                    'shipping_rate_id' => 'Pilih area pengiriman.',
                ]);
            }
            if ($cart->subtotal < $this->shipping->minimumDeliveryAmount()) {
                throw ValidationException::withMessages([
                    'cart' => 'Pesanan delivery minimum Rp'.number_format($this->shipping->minimumDeliveryAmount(), 0, ',', '.').'.',
                ]);
            }
            $shippingCost = (int) $rate->price;
            $shippingMeta['shipping_courier'] = 'Local';
            $shippingMeta['shipping_service'] = $rate->name;
            $shippingMeta['shipping_etd'] = $rate->etd_minutes ? $rate->etd_minutes.' menit' : null;
        }

        $voucher = null;
        $discount = 0;
        $freeShipping = false;
        if (! empty($payload['voucher_code'])) {
            $voucher = Voucher::query()->where('code', $payload['voucher_code'])->first();
            if (! $voucher || ! $voucher->isUsable($cart->subtotal, $cart->customer_id)) {
                throw ValidationException::withMessages([
                    'voucher_code' => 'Voucher tidak berlaku.',
                ]);
            }

            if ($voucher->type === 'percentage') {
                $discount = (int) round($cart->subtotal * ($voucher->value / 100));
                if ($voucher->max_discount) {
                    $discount = min($discount, (int) $voucher->max_discount);
                }
            } elseif ($voucher->type === 'fixed') {
                $discount = (int) $voucher->value;
            } elseif ($voucher->type === 'free_shipping') {
                $freeShipping = true;
                $discount = min($shippingCost, (int) ($voucher->max_discount ?? $shippingCost));
            }
        }

        $taxPercent = (int) (Setting::get('tax_percent', 0) ?? 0);
        $servicePercent = (int) (Setting::get('service_percent', 0) ?? 0);
        $taxableBase = max(0, $cart->subtotal - ($freeShipping ? 0 : $discount));
        $tax = (int) round($taxableBase * ($taxPercent / 100));
        $service = (int) round($taxableBase * ($servicePercent / 100));

        $effectiveShipping = $freeShipping ? max(0, $shippingCost - $discount) : $shippingCost;
        $effectiveDiscount = $freeShipping ? 0 : $discount;
        $grand = max(0, $cart->subtotal - $effectiveDiscount + $tax + $service + $effectiveShipping);

        $customer = $this->resolveCustomer($cart, $payload, $userId);

        return DB::transaction(function () use (
            $cart, $payload, $orderType, $voucher, $effectiveDiscount, $tax, $service,
            $effectiveShipping, $shippingMeta, $grand, $customer
        ): Order {
            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'tracking_token' => Str::random(48),
                'customer_id' => $customer?->id,
                'customer_name' => $payload['customer']['name'],
                'customer_phone' => $payload['customer']['phone'],
                'customer_email' => $payload['customer']['email'] ?? null,
                'order_type' => $orderType,
                'scheduled_at' => $payload['scheduled_at'] ?? null,
                'guest_count' => $payload['guest_count'] ?? null,
                'table_note' => $payload['table_note'] ?? null,
                'dine_in_area' => $payload['dine_in_area'] ?? null,
                'shipping_courier' => $shippingMeta['shipping_courier'],
                'shipping_service' => $shippingMeta['shipping_service'],
                'shipping_etd' => $shippingMeta['shipping_etd'],
                'shipping_cost' => $effectiveShipping,
                'delivery_address_snapshot' => $payload['delivery_address']['address_line'] ?? null,
                'subtotal' => (int) $cart->subtotal,
                'discount_total' => $effectiveDiscount,
                'tax_total' => $tax,
                'service_total' => $service,
                'grand_total' => $grand,
                'voucher_id' => $voucher?->id,
                'voucher_code' => $voucher?->code,
                'status' => OrderStatus::PendingPayment,
                'payment_status' => PaymentStatus::Unpaid,
                'payment_method' => $payload['payment_method'] ?? 'manual',
                'customer_note' => $payload['customer_note'] ?? null,
                'placed_at' => now(),
                'expires_at' => now()->addMinutes((int) (Setting::get('pending_payment_minutes', 60) ?? 60)),
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name' => $item->product?->name ?? 'Item',
                    'variant_name' => $item->variant?->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                    'addons' => $item->addons,
                    'note' => $item->note,
                ]);

                if ($item->product && $item->product->track_stock) {
                    $item->product->decrement('stock', $item->quantity);
                }
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => null,
                'to_status' => OrderStatus::PendingPayment->value,
                'note' => 'Order ditempatkan.',
            ]);

            if ($voucher) {
                VoucherUsage::create([
                    'voucher_id' => $voucher->id,
                    'customer_id' => $customer?->id,
                    'order_id' => $order->id,
                    'discount_amount' => $effectiveDiscount,
                ]);
                $voucher->increment('used_count');
            }

            Payment::create([
                'order_id' => $order->id,
                'provider' => $payload['payment_method'] ?? 'manual',
                'method' => $payload['payment_method'] ?? 'manual',
                'amount' => $grand,
                'status' => PaymentStatus::Unpaid,
                'expires_at' => $order->expires_at,
            ]);

            $cart->items()->delete();
            $cart->recalculateTotals();

            return $order->fresh(['items', 'latestPayment', 'statusHistories']);
        });
    }

    public function generateOrderNumber(): string
    {
        $prefix = (string) (Setting::get('invoice_prefix', 'CIVERS') ?? 'CIVERS');
        $date = CarbonImmutable::now()->format('ymd');
        $random = strtoupper(Str::random(5));

        return "{$prefix}-{$date}-{$random}";
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function resolveCustomer(Cart $cart, array $payload, ?int $userId): ?Customer
    {
        $email = $payload['customer']['email'] ?? null;
        $phone = $payload['customer']['phone'];
        $name = $payload['customer']['name'];

        if ($cart->customer_id) {
            return Customer::find($cart->customer_id);
        }

        if ($userId) {
            return Customer::query()->updateOrCreate(
                ['user_id' => $userId],
                ['name' => $name, 'email' => $email, 'phone' => $phone],
            );
        }

        if ($email) {
            $existing = Customer::query()->where('email', $email)->first();
            if ($existing) {
                $existing->fill(['name' => $name, 'phone' => $phone])->save();

                return $existing;
            }
        }

        return Customer::create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
        ]);
    }
}
