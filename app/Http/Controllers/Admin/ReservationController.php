<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Reservation::query()->latest('reservation_date');
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return Inertia::render('admin/reservations/index', [
            'reservations' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['status']),
            'statusOptions' => array_map(fn (ReservationStatus $r) => [
                'value' => $r->value, 'label' => $r->label(),
            ], ReservationStatus::cases()),
        ]);
    }

    public function update(Request $request, Reservation $reservation): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,confirmed,arrived,cancelled,no_show'],
            'admin_note' => ['nullable', 'string', 'max:500'],
        ]);

        $reservation->update($validated);

        return back()->with('success', 'Reservasi diperbarui.');
    }
}
