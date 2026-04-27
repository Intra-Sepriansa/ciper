<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payment\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function show(Request $request, string $order): Response
    {
        $orderModel = Order::query()
            ->with('latestPayment', 'items')
            ->where('order_number', $order)
            ->firstOrFail();

        $intent = $orderModel->isPayable()
            ? $this->paymentService->createIntent($orderModel, $orderModel->payment_method ?? 'manual')
            : null;

        return Inertia::render('checkout/payment', [
            'order' => $orderModel,
            'intent' => $intent,
        ]);
    }
}
