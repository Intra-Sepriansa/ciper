<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingRate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShippingRateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/shipping/index', [
            'rates' => ShippingRate::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateRate($request);
        ShippingRate::create($validated);

        return back()->with('success', 'Tarif ditambahkan.');
    }

    public function update(Request $request, ShippingRate $rate): RedirectResponse
    {
        $rate->update($this->validateRate($request));

        return back()->with('success', 'Tarif diperbarui.');
    }

    public function destroy(ShippingRate $rate): RedirectResponse
    {
        $rate->delete();

        return back()->with('success', 'Tarif dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateRate(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'area' => ['required', 'string', 'max:60'],
            'subdistrict' => ['nullable', 'string', 'max:60'],
            'price' => ['required', 'integer', 'min:0'],
            'etd_minutes' => ['nullable', 'integer', 'min:0'],
            'min_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
