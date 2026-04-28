<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\ShippingRateController as AdminShippingRateController;
use App\Http\Controllers\Admin\VoucherController as AdminVoucherController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\CheckoutController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\MenuController;
use App\Http\Controllers\Frontend\PageController;
use App\Http\Controllers\Frontend\PaymentController;
use App\Http\Controllers\Frontend\ReservationController;
use App\Http\Controllers\Frontend\TrackingController;
use App\Http\Controllers\Payment\WebhookController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', HomeController::class)->name('home');

Route::get('/menu', [MenuController::class, 'index'])->name('menu.index');
Route::get('/menu/{slug}', [MenuController::class, 'show'])->name('menu.show');

Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/gallery', [PageController::class, 'gallery'])->name('gallery');

Route::prefix('cart')->name('cart.')->group(function (): void {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/', [CartController::class, 'store'])->name('store');
    Route::patch('/{item}', [CartController::class, 'update'])->name('update');
    Route::delete('/{item}', [CartController::class, 'destroy'])->name('destroy');
});

Route::prefix('checkout')->name('checkout.')->group(function (): void {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/', [CheckoutController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('store');
    Route::post('/voucher', [CheckoutController::class, 'previewVoucher'])->name('voucher');
    Route::get('/{order}/payment', [PaymentController::class, 'show'])->name('payment');
});

Route::prefix('tracking')->name('tracking.')->group(function (): void {
    Route::get('/', [TrackingController::class, 'index'])->name('index');
    Route::post('/', [TrackingController::class, 'lookup'])
        ->middleware('throttle:30,1')
        ->name('lookup');
    Route::get('/{number}', [TrackingController::class, 'show'])->name('show');
    Route::get('/{number}/invoice', [TrackingController::class, 'invoice'])->name('invoice');
});

Route::prefix('reservation')->name('reservation.')->group(function (): void {
    Route::get('/', [ReservationController::class, 'index'])->name('index');
    Route::post('/', [ReservationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('store');
});

Route::post('/payments/midtrans/webhook', [WebhookController::class, 'midtrans'])
    ->name('payments.midtrans');
Route::post('/payments/xendit/webhook', [WebhookController::class, 'xendit'])
    ->name('payments.xendit');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', EnsureAdmin::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        Route::resource('products', AdminProductController::class);
        Route::resource('categories', AdminCategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::post('orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
        Route::post('orders/{order}/confirm-payment', [AdminOrderController::class, 'confirmPayment'])->name('orders.confirm');
        Route::get('orders/{order}/invoice', [AdminOrderController::class, 'invoice'])->name('orders.invoice');

        Route::resource('vouchers', AdminVoucherController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::get('reservations', [AdminReservationController::class, 'index'])->name('reservations.index');
        Route::patch('reservations/{reservation}', [AdminReservationController::class, 'update'])->name('reservations.update');

        Route::get('customers', [AdminCustomerController::class, 'index'])->name('customers.index');

        Route::get('reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
        Route::post('reviews/{review}/toggle', [AdminReviewController::class, 'toggle'])->name('reviews.toggle');
        Route::delete('reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

        Route::resource('galleries', AdminGalleryController::class)
            ->only(['index', 'store', 'destroy']);

        Route::resource('shipping', AdminShippingRateController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['shipping' => 'rate']);

        Route::get('settings', [AdminSettingController::class, 'edit'])->name('settings.edit');
        Route::post('settings', [AdminSettingController::class, 'update'])->name('settings.update');

        Route::get('reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::get('reports/export', [AdminReportController::class, 'exportCsv'])->name('reports.export');
    });

if (Features::enabled(Features::registration())) {
    // Fortify routes for registration are auto-registered.
}

require __DIR__.'/settings.php';
