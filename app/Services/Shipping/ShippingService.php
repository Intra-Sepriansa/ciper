<?php

namespace App\Services\Shipping;

use App\Models\Setting;
use App\Models\ShippingRate;

class ShippingService
{
    /**
     * @return array<int, array{id: int, name: string, area: string, price: int, etd_minutes: ?int, min_order: int}>
     */
    public function localRates(): array
    {
        return ShippingRate::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (ShippingRate $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'area' => $r->area,
                'price' => (int) $r->price,
                'etd_minutes' => $r->etd_minutes,
                'min_order' => (int) $r->min_order,
            ])->values()->all();
    }

    public function findRate(int $id): ?ShippingRate
    {
        return ShippingRate::query()->where('is_active', true)->find($id);
    }

    /**
     * Placeholder for RajaOngkir API integration. Configure key via settings,
     * then call the API and normalize the response.
     *
     * @return array<int, array{courier: string, service: string, price: int, etd: string}>
     */
    public function rajaOngkirRates(string $destinationCityId, int $weightGrams = 1000): array
    {
        if (! Setting::get('rajaongkir_api_key')) {
            return [];
        }

        // TODO: implement HTTP::post('https://api.rajaongkir.com/...', [...])
        // Returns courier rates. Kept as a stub so downstream code does not break.
        return [];
    }

    public function minimumDeliveryAmount(): int
    {
        return (int) (Setting::get('min_delivery_amount', 30000) ?? 0);
    }
}
