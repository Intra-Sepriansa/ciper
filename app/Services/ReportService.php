<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * @return array<string, mixed>
     */
    public function dashboard(): array
    {
        $today = CarbonImmutable::now()->startOfDay();

        $todayOrders = Order::query()
            ->whereDate('created_at', $today)
            ->where('payment_status', '!=', PaymentStatus::Failed->value);

        $totalSalesToday = (int) Order::query()
            ->whereDate('paid_at', $today)
            ->where('payment_status', PaymentStatus::Paid->value)
            ->sum('grand_total');

        $pendingCount = Order::query()
            ->where('status', OrderStatus::PendingPayment->value)
            ->count();

        $processingCount = Order::query()
            ->whereIn('status', [
                OrderStatus::Paid->value,
                OrderStatus::Processing->value,
            ])
            ->count();

        $bestSellers = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.payment_status', PaymentStatus::Paid->value)
            ->select('order_items.product_id', 'order_items.product_name', DB::raw('SUM(order_items.quantity) as total_qty'))
            ->groupBy('order_items.product_id', 'order_items.product_name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        $sevenDaySales = collect(range(6, 0))->map(function (int $offset) {
            $day = CarbonImmutable::now()->subDays($offset)->startOfDay();
            $sales = Order::query()
                ->whereDate('paid_at', $day)
                ->where('payment_status', PaymentStatus::Paid->value)
                ->sum('grand_total');

            return [
                'date' => $day->toDateString(),
                'label' => $day->translatedFormat('D'),
                'sales' => (int) $sales,
            ];
        })->values()->all();

        $categorySales = DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.payment_status', PaymentStatus::Paid->value)
            ->select('categories.name as category', DB::raw('SUM(order_items.subtotal) as total'))
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->limit(6)
            ->get();

        $lowStock = Product::query()
            ->where('track_stock', true)
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->limit(8)
            ->get(['id', 'name', 'stock']);

        return [
            'total_sales_today' => $totalSalesToday,
            'orders_today' => (clone $todayOrders)->count(),
            'pending_count' => $pendingCount,
            'processing_count' => $processingCount,
            'best_sellers' => $bestSellers,
            'seven_day_sales' => $sevenDaySales,
            'category_sales' => $categorySales,
            'low_stock' => $lowStock,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function dailySales(CarbonImmutable $start, CarbonImmutable $end): array
    {
        return Order::query()
            ->where('payment_status', PaymentStatus::Paid->value)
            ->whereBetween('paid_at', [$start, $end])
            ->selectRaw('DATE(paid_at) as date, COUNT(*) as orders, SUM(grand_total) as revenue')
            ->groupByRaw('DATE(paid_at)')
            ->orderBy('date')
            ->get()
            ->toArray();
    }
}
