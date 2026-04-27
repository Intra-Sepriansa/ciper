<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Services\InvoiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class OrderController extends Controller
{
    public function __construct(private readonly InvoiceService $invoiceService) {}

    public function index(Request $request): Response
    {
        $query = Order::query()->latest();

        if ($search = $request->string('q')->toString()) {
            $query->where(function ($q) use ($search): void {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }
        if ($paymentStatus = $request->string('payment_status')->toString()) {
            $query->where('payment_status', $paymentStatus);
        }
        if ($type = $request->string('order_type')->toString()) {
            $query->where('order_type', $type);
        }

        $orders = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['q', 'status', 'payment_status', 'order_type']),
            'statusOptions' => OrderStatus::options(),
        ]);
    }

    public function show(Order $order): Response
    {
        return Inertia::render('admin/orders/show', [
            'order' => $order->load('items', 'statusHistories.changedBy:id,name', 'latestPayment', 'voucher'),
            'statusOptions' => OrderStatus::options(),
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:'.implode(',', array_column(OrderStatus::cases(), 'value'))],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $oldStatus = $order->status?->value;

        $order->update([
            'status' => $validated['status'],
            'completed_at' => $validated['status'] === OrderStatus::Completed->value ? now() : $order->completed_at,
            'cancelled_at' => $validated['status'] === OrderStatus::Cancelled->value ? now() : $order->cancelled_at,
            'cancel_reason' => $validated['status'] === OrderStatus::Cancelled->value ? ($validated['note'] ?? $order->cancel_reason) : $order->cancel_reason,
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'from_status' => $oldStatus,
            'to_status' => $validated['status'],
            'changed_by' => $request->user()?->id,
            'note' => $validated['note'] ?? null,
        ]);

        return back()->with('success', 'Status pesanan diperbarui.');
    }

    public function confirmPayment(Request $request, Order $order): RedirectResponse
    {
        $payment = $order->latestPayment;
        if ($payment) {
            $payment->update([
                'status' => PaymentStatus::Paid,
                'paid_at' => now(),
                'note' => $request->input('note'),
            ]);
        }

        $order->update([
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Paid,
            'paid_at' => now(),
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'from_status' => OrderStatus::PendingPayment->value,
            'to_status' => OrderStatus::Paid->value,
            'changed_by' => $request->user()?->id,
            'note' => 'Pembayaran dikonfirmasi manual.',
        ]);

        return back()->with('success', 'Pembayaran dikonfirmasi.');
    }

    public function invoice(Order $order): SymfonyResponse
    {
        return $this->invoiceService->streamPdf($order);
    }
}
