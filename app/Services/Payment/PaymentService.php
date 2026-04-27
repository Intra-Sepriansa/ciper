<?php

namespace App\Services\Payment;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\PaymentLog;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Build a payment intent (gateway redirect / snap token / instructions).
     *
     * @return array<string, mixed>
     */
    public function createIntent(Order $order, string $provider): array
    {
        $payment = $order->latestPayment ?? Payment::create([
            'order_id' => $order->id,
            'provider' => $provider,
            'method' => $provider,
            'amount' => $order->grand_total,
            'status' => PaymentStatus::Unpaid,
            'expires_at' => $order->expires_at,
        ]);

        $payment->update([
            'provider' => $provider,
            'status' => PaymentStatus::Pending,
        ]);

        $order->update(['payment_status' => PaymentStatus::Pending]);

        return match ($provider) {
            'midtrans' => $this->createMidtransSnap($order, $payment),
            'xendit' => $this->createXenditInvoice($order, $payment),
            'manual' => $this->manualInstructions($order, $payment),
            'pay_at_store' => $this->payAtStore($order, $payment),
            default => $this->manualInstructions($order, $payment),
        };
    }

    public function markPaid(Payment $payment, ?array $payload = null, ?string $reference = null): void
    {
        DB::transaction(function () use ($payment, $payload, $reference): void {
            $payment->update([
                'status' => PaymentStatus::Paid,
                'paid_at' => now(),
                'provider_reference' => $reference ?? $payment->provider_reference,
                'payload' => $payload ?? $payment->payload,
            ]);

            $order = $payment->order;
            if (! $order) {
                return;
            }

            $oldStatus = $order->status?->value;

            $order->update([
                'payment_status' => PaymentStatus::Paid,
                'status' => OrderStatus::Paid,
                'paid_at' => now(),
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => $oldStatus,
                'to_status' => OrderStatus::Paid->value,
                'note' => 'Pembayaran diterima.',
            ]);
        });
    }

    public function markFailed(Payment $payment, ?array $payload = null): void
    {
        $payment->update([
            'status' => PaymentStatus::Failed,
            'payload' => $payload ?? $payment->payload,
        ]);
        $payment->order?->update(['payment_status' => PaymentStatus::Failed]);
    }

    public function markExpired(Payment $payment): void
    {
        $payment->update(['status' => PaymentStatus::Expired]);
        $order = $payment->order;
        if ($order) {
            $order->update([
                'payment_status' => PaymentStatus::Expired,
                'status' => OrderStatus::Expired,
            ]);
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => $order->status?->value,
                'to_status' => OrderStatus::Expired->value,
                'note' => 'Pembayaran kedaluwarsa.',
            ]);
        }
    }

    public function logEvent(Payment $payment, string $event, ?array $payload = null, string $source = 'system'): void
    {
        PaymentLog::create([
            'payment_id' => $payment->id,
            'order_id' => $payment->order_id,
            'event' => $event,
            'source' => $source,
            'payload' => $payload,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function createMidtransSnap(Order $order, Payment $payment): array
    {
        $serverKey = config('services.midtrans.server_key', env('MIDTRANS_SERVER_KEY'));

        if (! $serverKey) {
            Log::warning('Midtrans server key is not configured. Falling back to manual instructions.');

            return $this->manualInstructions($order, $payment);
        }

        // The Midtrans SDK structure is fully scaffolded but kept inert until
        // credentials are provided. Override here to return real Snap tokens.
        // \Midtrans\Config::$serverKey = $serverKey;
        // \Midtrans\Config::$isProduction = (bool) config('services.midtrans.is_production');
        // $snap = \Midtrans\Snap::createTransaction([...]);
        // $payment->update(['snap_token' => $snap->token, 'payment_url' => $snap->redirect_url]);

        return [
            'provider' => 'midtrans',
            'snap_token' => $payment->snap_token,
            'redirect_url' => $payment->payment_url,
            'instructions' => 'Selesaikan pembayaran melalui Snap Midtrans.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function createXenditInvoice(Order $order, Payment $payment): array
    {
        $secret = config('services.xendit.secret_key', env('XENDIT_SECRET_KEY'));

        if (! $secret) {
            Log::warning('Xendit secret key is not configured. Falling back to manual instructions.');

            return $this->manualInstructions($order, $payment);
        }

        // TODO: Implement Xendit Invoice creation via HTTP::withBasicAuth(...)
        // and store provider_reference + payment_url back on the Payment record.

        return [
            'provider' => 'xendit',
            'redirect_url' => $payment->payment_url,
            'instructions' => 'Selesaikan pembayaran melalui Xendit checkout.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function manualInstructions(Order $order, Payment $payment): array
    {
        return [
            'provider' => 'manual',
            'bank_name' => Setting::get('manual_bank_name'),
            'bank_account' => Setting::get('manual_bank_account'),
            'bank_holder' => Setting::get('manual_bank_holder'),
            'amount' => $order->grand_total,
            'expires_at' => optional($payment->expires_at)?->toIso8601String(),
            'instructions' => 'Transfer ke rekening berikut, lalu unggah bukti via halaman tracking atau hubungi admin via WhatsApp.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function payAtStore(Order $order, Payment $payment): array
    {
        return [
            'provider' => 'pay_at_store',
            'amount' => $order->grand_total,
            'instructions' => 'Bayar langsung di kasir saat dine-in atau saat menjemput pesanan takeaway.',
        ];
    }
}
