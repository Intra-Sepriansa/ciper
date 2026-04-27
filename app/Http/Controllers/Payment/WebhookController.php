<?php

namespace App\Http\Controllers\Payment;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentLog;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function midtrans(Request $request): JsonResponse
    {
        $payload = $request->all();
        $serverKey = config('services.midtrans.server_key', env('MIDTRANS_SERVER_KEY'));
        $orderId = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? '';
        $grossAmount = $payload['gross_amount'] ?? '';
        $signatureKey = $payload['signature_key'] ?? '';

        $expectedSignature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);
        if ($serverKey && $signatureKey && ! hash_equals($expectedSignature, $signatureKey)) {
            PaymentLog::create([
                'event' => 'midtrans.signature_mismatch',
                'source' => 'webhook',
                'payload' => $payload,
            ]);

            return response()->json(['ok' => false], 401);
        }

        $order = Order::query()->where('order_number', $orderId)->first();
        if (! $order) {
            return response()->json(['ok' => false, 'message' => 'order_not_found'], 404);
        }

        /** @var Payment $payment */
        $payment = $order->latestPayment ?? Payment::create([
            'order_id' => $order->id,
            'provider' => 'midtrans',
            'amount' => $order->grand_total,
            'status' => PaymentStatus::Pending,
        ]);

        $this->paymentService->logEvent($payment, 'midtrans.notification', $payload, 'webhook');

        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;

        match ($transactionStatus) {
            'capture' => $fraudStatus === 'accept'
                ? $this->paymentService->markPaid($payment, $payload, $payload['transaction_id'] ?? null)
                : $this->paymentService->markFailed($payment, $payload),
            'settlement' => $this->paymentService->markPaid($payment, $payload, $payload['transaction_id'] ?? null),
            'pending' => null,
            'expire' => $this->paymentService->markExpired($payment),
            default => $this->paymentService->markFailed($payment, $payload),
        };

        return response()->json(['ok' => true]);
    }

    public function xendit(Request $request): JsonResponse
    {
        $callbackToken = config('services.xendit.callback_token', env('XENDIT_CALLBACK_TOKEN'));
        $headerToken = $request->header('x-callback-token');
        if ($callbackToken && $headerToken !== $callbackToken) {
            return response()->json(['ok' => false], 401);
        }

        $payload = $request->all();
        $externalId = $payload['external_id'] ?? null;
        $order = Order::query()->where('order_number', $externalId)->first();
        if (! $order) {
            return response()->json(['ok' => false, 'message' => 'order_not_found'], 404);
        }

        /** @var Payment $payment */
        $payment = $order->latestPayment ?? Payment::create([
            'order_id' => $order->id,
            'provider' => 'xendit',
            'amount' => $order->grand_total,
            'status' => PaymentStatus::Pending,
        ]);

        $this->paymentService->logEvent($payment, 'xendit.callback', $payload, 'webhook');

        match ($payload['status'] ?? '') {
            'PAID', 'SETTLED' => $this->paymentService->markPaid($payment, $payload, $payload['id'] ?? null),
            'EXPIRED' => $this->paymentService->markExpired($payment),
            default => $this->paymentService->markFailed($payment, $payload),
        };

        return response()->json(['ok' => true]);
    }
}
