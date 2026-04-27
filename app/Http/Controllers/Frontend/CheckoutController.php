<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Voucher;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\Shipping\ShippingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly CheckoutService $checkoutService,
        private readonly ShippingService $shippingService,
    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $cart = $this->cartService->getOrCreateCart($request);
        if ($cart->items()->count() === 0) {
            return redirect()->route('menu.index')->with('info', 'Keranjang masih kosong.');
        }

        return Inertia::render('checkout/index', [
            'cart' => $this->cartService->summary($cart),
            'shippingRates' => $this->shippingService->localRates(),
            'storefront' => Setting::publicSettings(),
            'paymentMethods' => $this->paymentMethods(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer.name' => ['required', 'string', 'max:120'],
            'customer.phone' => ['required', 'string', 'max:30'],
            'customer.email' => ['nullable', 'email', 'max:120'],
            'order_type' => ['required', 'in:dine_in,takeaway,delivery'],
            'scheduled_at' => ['nullable', 'date'],
            'guest_count' => ['nullable', 'integer', 'min:1', 'max:30'],
            'table_note' => ['nullable', 'string', 'max:255'],
            'dine_in_area' => ['nullable', 'in:indoor,lesehan,riverside'],
            'shipping_rate_id' => ['nullable', 'integer'],
            'delivery_address.address_line' => ['nullable', 'string', 'max:255'],
            'delivery_address.subdistrict' => ['nullable', 'string', 'max:120'],
            'voucher_code' => ['nullable', 'string', 'max:30'],
            'payment_method' => ['required', 'in:midtrans,xendit,manual,pay_at_store'],
            'customer_note' => ['nullable', 'string', 'max:500'],
        ]);

        $cart = $this->cartService->getOrCreateCart($request);
        $order = $this->checkoutService->place($cart, $validated, $request->user()?->id);
        $request->session()->forget('cart_count');

        return redirect()->route('checkout.payment', ['order' => $order->order_number])
            ->with('success', 'Pesanan diterima. Selesaikan pembayaran.');
    }

    public function previewVoucher(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string'],
        ]);
        $cart = $this->cartService->getOrCreateCart($request);
        $voucher = Voucher::query()->where('code', $validated['code'])->first();

        if (! $voucher || ! $voucher->isUsable($cart->subtotal, $cart->customer_id)) {
            return response()->json(['valid' => false, 'message' => 'Voucher tidak berlaku.'], 422);
        }

        return response()->json([
            'valid' => true,
            'voucher' => [
                'code' => $voucher->code,
                'name' => $voucher->name,
                'type' => $voucher->type,
                'value' => (int) $voucher->value,
                'max_discount' => $voucher->max_discount,
                'min_purchase' => (int) $voucher->min_purchase,
            ],
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function paymentMethods(): array
    {
        $methods = [];
        if (Setting::get('enable_payment_midtrans')) {
            $methods[] = ['key' => 'midtrans', 'label' => 'Midtrans (kartu, e-wallet, VA)'];
        }
        if (Setting::get('enable_payment_xendit')) {
            $methods[] = ['key' => 'xendit', 'label' => 'Xendit (kartu, e-wallet, VA)'];
        }
        if (Setting::get('enable_payment_manual')) {
            $methods[] = ['key' => 'manual', 'label' => 'Transfer Bank Manual'];
        }
        if (Setting::get('enable_pay_at_store')) {
            $methods[] = ['key' => 'pay_at_store', 'label' => 'Bayar di Kasir (dine-in/takeaway)'];
        }

        return $methods ?: [['key' => 'manual', 'label' => 'Transfer Bank Manual']];
    }
}
