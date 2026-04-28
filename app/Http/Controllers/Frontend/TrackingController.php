<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\InvoiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class TrackingController extends Controller
{
    public function __construct(private readonly InvoiceService $invoiceService) {}

    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('tracking/index', [
            'order' => null,
            'lookup' => $request->string('number')->toString(),
        ]);
    }

    public function lookup(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'number' => ['required', 'string', 'max:64'],
        ]);

        return redirect()->route('tracking.show', ['number' => $validated['number']]);
    }

    public function show(string $number): InertiaResponse
    {
        $order = Order::query()
            ->with('items', 'statusHistories.changedBy:id,name', 'latestPayment')
            ->where('order_number', $number)
            ->firstOrFail();

        return Inertia::render('tracking/show', [
            'order' => $order,
            'qr_data_uri' => $this->invoiceService->generateQrDataUri(route('tracking.show', ['number' => $order->order_number])),
        ]);
    }

    public function invoice(string $number): SymfonyResponse
    {
        $order = Order::query()
            ->with('items', 'voucher', 'latestPayment')
            ->where('order_number', $number)
            ->firstOrFail();

        return $this->invoiceService->streamPdf($order);
    }
}
