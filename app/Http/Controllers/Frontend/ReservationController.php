<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    private const AREAS = [
        [
            'slug' => 'riverside',
            'name' => 'Riverside',
            'tagline' => 'Pinggir sungai, angin sejuk',
            'description' => 'Duduk langsung di tepi Sungai Cidurian. Paling populer untuk santai sore & foto keluarga.',
            'image' => 'gallery/riverside-1.jpg',
            'capacity' => 40,
            'accent' => 'from-sky-600 to-emerald-600',
            'features' => ['Pemandangan sungai', 'Udara sejuk', 'Cocok foto keluarga'],
        ],
        [
            'slug' => 'lesehan',
            'name' => 'Lesehan',
            'tagline' => 'Duduk santai ala saung',
            'description' => 'Saung lesehan dengan tikar empuk. Nyaman untuk keluarga besar & rombongan.',
            'image' => 'gallery/lesehan-1.jpg',
            'capacity' => 60,
            'accent' => 'from-amber-600 to-emerald-700',
            'features' => ['Saung privat', 'Muat 4–12 orang', 'Akses mushola dekat'],
        ],
        [
            'slug' => 'indoor',
            'name' => 'Indoor',
            'tagline' => 'Ruangan ber-AC',
            'description' => 'Area tertutup dengan AC. Cocok untuk acara resmi, meeting kecil, atau hari panas.',
            'image' => 'gallery/indoor-1.jpg',
            'capacity' => 30,
            'accent' => 'from-emerald-700 to-emerald-900',
            'features' => ['Ber-AC', 'Wi-Fi', 'Cocok meeting'],
        ],
    ];

    public function index(): Response
    {
        $slots = [];
        $cursor = Carbon::createFromTime(9, 0);
        $end = Carbon::createFromTime(21, 0);

        while ($cursor->lte($end)) {
            $slots[] = $cursor->format('H:i');
            $cursor->addMinutes(30);
        }

        return Inertia::render('reservation/index', [
            'areas' => self::AREAS,
            'timeSlots' => $slots,
            'operatingHours' => ['open' => '09:00', 'close' => '22:00'],
            'minDate' => Carbon::today()->toDateString(),
            'maxDate' => Carbon::today()->addMonths(2)->toDateString(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'reservation_date' => ['required', 'date', 'after_or_equal:today'],
            'reservation_time' => ['required', 'date_format:H:i'],
            'guest_count' => ['required', 'integer', 'min:1', 'max:30'],
            'area' => ['required', 'in:indoor,lesehan,riverside'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $reservationAt = Carbon::parse($validated['reservation_date'].' '.$validated['reservation_time']);

        if ($reservationAt->lt(now()->addMinutes(30))) {
            throw ValidationException::withMessages([
                'reservation_time' => 'Pilih jam minimal 30 menit dari sekarang.',
            ]);
        }

        $open = Carbon::parse($validated['reservation_date'].' 09:00');
        $close = Carbon::parse($validated['reservation_date'].' 21:00');

        if ($reservationAt->lt($open) || $reservationAt->gt($close)) {
            throw ValidationException::withMessages([
                'reservation_time' => 'Jam operasional 09.00 - 21.00 WIB.',
            ]);
        }

        $reservation = Reservation::create([
            'reservation_number' => 'RSV-'.now()->format('ymd').'-'.strtoupper(Str::random(5)),
            'status' => ReservationStatus::Pending,
            ...$validated,
        ]);

        return redirect()
            ->route('reservation.index')
            ->with('success', "Reservasi berhasil. Kode: {$reservation->reservation_number}. Admin akan mengonfirmasi via WhatsApp.")
            ->with('reservation_number', $reservation->reservation_number)
            ->with('reservation_area', $reservation->area);
    }
}
