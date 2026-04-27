<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PendingPayment = 'pending_payment';
    case Paid = 'paid';
    case Processing = 'processing';
    case ReadyForPickup = 'ready_for_pickup';
    case Delivering = 'delivering';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case Expired = 'expired';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::PendingPayment => 'Menunggu Pembayaran',
            self::Paid => 'Dibayar',
            self::Processing => 'Diproses',
            self::ReadyForPickup => 'Siap Diambil',
            self::Delivering => 'Dalam Pengiriman',
            self::Completed => 'Selesai',
            self::Cancelled => 'Dibatalkan',
            self::Expired => 'Kedaluwarsa',
            self::Refunded => 'Dikembalikan',
        };
    }

    public function tone(): string
    {
        return match ($this) {
            self::PendingPayment => 'warning',
            self::Paid, self::Processing => 'info',
            self::ReadyForPickup, self::Delivering => 'accent',
            self::Completed => 'success',
            self::Cancelled, self::Expired, self::Refunded => 'danger',
        };
    }

    /**
     * @return array<int, array{value: string, label: string, tone: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => [
                'value' => $case->value,
                'label' => $case->label(),
                'tone' => $case->tone(),
            ],
            self::cases(),
        );
    }
}
