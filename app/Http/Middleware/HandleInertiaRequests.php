<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user()?->only([
                    'id', 'name', 'email', 'phone', 'avatar_path',
                ]),
                'roles' => $request->user()?->getRoleNames()->all(),
                'is_admin' => $request->user()?->hasAnyRole(['admin', 'staff']) ?? false,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'reservation_number' => fn () => $request->session()->get('reservation_number'),
                'reservation_area' => fn () => $request->session()->get('reservation_area'),
            ],
            'storefront' => fn () => Setting::publicSettings(),
            'cart_count' => fn () => (int) $request->session()->get('cart_count', 0),
        ]);
    }
}
