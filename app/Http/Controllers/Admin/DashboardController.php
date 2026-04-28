<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly ReportService $reportService) {}

    public function __invoke(): Response
    {
        $recentOrders = Order::query()
            ->latest()
            ->limit(8)
            ->get(['id', 'order_number', 'customer_name', 'order_type', 'status', 'payment_status', 'grand_total', 'created_at']);

        return Inertia::render('admin/dashboard', [
            'metrics' => $this->reportService->dashboard(),
            'recentOrders' => $recentOrders,
        ]);
    }
}
