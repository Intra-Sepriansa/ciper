<?php

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Services\InvoiceService;

use function Pest\Laravel\get;

test('tracking page renders qr data uri without errors', function (): void {
    $order = Order::query()->create([
        'order_number' => 'CIVERS-TEST-0001',
        'customer_name' => 'Test Customer',
        'customer_phone' => '081234567890',
        'order_type' => OrderType::Takeaway,
        'subtotal' => 75000,
        'discount_total' => 0,
        'tax_total' => 0,
        'service_total' => 0,
        'shipping_cost' => 0,
        'grand_total' => 75000,
        'status' => OrderStatus::PendingPayment,
        'payment_status' => PaymentStatus::Unpaid,
        'placed_at' => now(),
        'tracking_token' => 'token-test-0001',
    ]);

    get(route('tracking.show', ['number' => $order->order_number]))->assertOk();
});

test('invoice service generates qr code data uri', function (): void {
    $uri = app(InvoiceService::class)->generateQrDataUri('https://example.com/tracking');

    expect($uri)->toStartWith('data:image/png;base64,');
});
