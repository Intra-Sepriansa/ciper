<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reservation/index');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'reservation_date' => ['required', 'date', 'after_or_equal:today'],
            'reservation_time' => ['required'],
            'guest_count' => ['required', 'integer', 'min:1', 'max:30'],
            'area' => ['required', 'in:indoor,lesehan,riverside'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $reservation = Reservation::create([
            'reservation_number' => 'RSV-'.now()->format('ymd').'-'.strtoupper(Str::random(5)),
            'status' => ReservationStatus::Pending,
            ...$validated,
        ]);

        return redirect()->route('reservation.index')
            ->with('success', "Reservasi berhasil. Kode: {$reservation->reservation_number}. Admin akan mengonfirmasi via WhatsApp.");
    }
}
