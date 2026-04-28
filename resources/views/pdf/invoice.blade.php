@php
    /** @var \App\Models\Order $order */
    $items = $order->items ?? collect();
    $rupiah = fn ($value) => 'Rp '.number_format((int) $value, 0, ',', '.');
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        @page { margin: 16mm 12mm; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #0f172a; }
        h1 { font-size: 16px; color: #047857; margin: 0; }
        .muted { color: #64748b; }
        .section { margin-top: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; background: #ecfdf5; color: #065f46; font-size: 11px; padding: 6px 8px; }
        td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
        .totals td { border: 0; padding: 3px 0; }
        .totals .grand { border-top: 1px solid #94a3b8; padding-top: 6px; font-weight: bold; font-size: 13px; color: #047857; }
        .footer { margin-top: 14px; padding-top: 8px; border-top: 1px dashed #94a3b8; font-size: 10px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; background: #ecfdf5; color: #047857; }
        .right { text-align: right; }
    </style>
</head>
<body>
    <table>
        <tr>
            <td style="width: 70%; border: 0; padding: 0;">
                <h1>{{ $settings['store_name'] ?? 'Cidurian Riverside' }}</h1>
                <div class="muted">{{ $settings['store_address'] ?? '' }}</div>
                <div class="muted">{{ $settings['store_phone'] ?? '' }} • {{ $settings['store_email'] ?? '' }}</div>
            </td>
            <td style="width: 30%; border: 0; padding: 0; text-align: right;">
                <div style="font-size: 14px; font-weight: bold;">INVOICE</div>
                <div>{{ $order->order_number }}</div>
                <div class="muted">{{ $order->created_at?->format('d M Y H:i') }}</div>
                <span class="badge">{{ str_replace('_', ' ', $order->payment_status?->value ?? '') }}</span>
            </td>
        </tr>
    </table>

    <div class="section">
        <table>
            <tr>
                <td style="width: 50%; border: 0; padding: 0;">
                    <strong>Pemesan</strong>
                    <div>{{ $order->customer_name }}</div>
                    <div class="muted">{{ $order->customer_phone }} {{ $order->customer_email ? '• '.$order->customer_email : '' }}</div>
                </td>
                <td style="width: 50%; border: 0; padding: 0;">
                    <strong>Tipe Pesanan</strong>
                    <div>{{ str_replace('_', ' ', $order->order_type?->value ?? '') }}</div>
                    @if ($order->delivery_address_snapshot)
                        <div class="muted">{{ $order->delivery_address_snapshot }}</div>
                    @endif
                    @if ($order->scheduled_at)
                        <div class="muted">Jadwal: {{ $order->scheduled_at->format('d M Y H:i') }}</div>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <table>
            <thead>
                <tr><th>Menu</th><th class="right">Qty</th><th class="right">Harga</th><th class="right">Subtotal</th></tr>
            </thead>
            <tbody>
                @foreach ($items as $item)
                    <tr>
                        <td>
                            <div style="font-weight: bold;">{{ $item->product_name }}</div>
                            @if ($item->variant_name)<div class="muted">{{ $item->variant_name }}</div>@endif
                            @if ($item->note)<div class="muted">Catatan: {{ $item->note }}</div>@endif
                        </td>
                        <td class="right">{{ $item->quantity }}</td>
                        <td class="right">{{ $rupiah($item->unit_price) }}</td>
                        <td class="right">{{ $rupiah($item->subtotal) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <table class="section">
        <tr>
            <td style="width: 55%; border: 0; padding: 0; vertical-align: top;">
                <img src="{{ $qrDataUri }}" alt="QR" style="width: 100px; height: 100px;">
                <div class="muted" style="font-size: 9px;">Scan QR untuk lacak status pesanan.</div>
                <div class="muted" style="font-size: 9px;">{{ $trackingUrl }}</div>
            </td>
            <td style="width: 45%; border: 0; padding: 0;">
                <table class="totals">
                    <tr><td>Subtotal</td><td class="right">{{ $rupiah($order->subtotal) }}</td></tr>
                    <tr><td>Diskon</td><td class="right">- {{ $rupiah($order->discount_total) }}</td></tr>
                    <tr><td>Ongkir</td><td class="right">{{ $rupiah($order->shipping_cost) }}</td></tr>
                    <tr><td>Pajak</td><td class="right">{{ $rupiah($order->tax_total) }}</td></tr>
                    <tr><td>Service</td><td class="right">{{ $rupiah($order->service_total) }}</td></tr>
                    <tr class="grand"><td>Total</td><td class="right">{{ $rupiah($order->grand_total) }}</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="footer">
        Terima kasih sudah memesan di {{ $settings['store_name'] ?? 'Cidurian Riverside' }}.
        @if (!empty($settings['store_whatsapp']))
            Hubungi WhatsApp {{ $settings['store_whatsapp'] }} untuk pertanyaan terkait pesanan ini.
        @endif
    </div>
</body>
</html>
