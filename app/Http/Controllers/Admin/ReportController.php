<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\ReportService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reportService) {}

    public function index(Request $request): Response
    {
        $start = CarbonImmutable::parse($request->input('start', now()->startOfMonth()->toDateString()));
        $end = CarbonImmutable::parse($request->input('end', now()->endOfDay()));

        return Inertia::render('admin/reports/index', [
            'range' => ['start' => $start->toDateString(), 'end' => $end->toDateString()],
            'daily' => $this->reportService->dailySales($start, $end),
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $start = CarbonImmutable::parse($request->input('start', now()->startOfMonth()->toDateString()));
        $end = CarbonImmutable::parse($request->input('end', now()->endOfDay()));

        $orders = Order::query()
            ->where('payment_status', PaymentStatus::Paid->value)
            ->whereBetween('paid_at', [$start, $end])
            ->orderBy('paid_at')
            ->get();

        $filename = "laporan-penjualan-{$start->toDateString()}_to_{$end->toDateString()}.csv";

        return response()->streamDownload(function () use ($orders): void {
            $out = fopen('php://output', 'wb');
            fputcsv($out, ['Order Number', 'Tanggal', 'Customer', 'Tipe', 'Subtotal', 'Diskon', 'Ongkir', 'Pajak', 'Service', 'Grand Total']);
            foreach ($orders as $order) {
                fputcsv($out, [
                    $order->order_number,
                    optional($order->paid_at)->toDateTimeString(),
                    $order->customer_name,
                    $order->order_type?->value,
                    $order->subtotal,
                    $order->discount_total,
                    $order->shipping_cost,
                    $order->tax_total,
                    $order->service_total,
                    $order->grand_total,
                ]);
            }
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
