<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Http\Response;

class InvoiceService
{
    public function generateQrDataUri(string $payload): string
    {
        $result = Builder::create()
            ->writer(new PngWriter)
            ->data($payload)
            ->size(220)
            ->margin(8)
            ->build();

        return $result->getDataUri();
    }

    public function streamPdf(Order $order): Response
    {
        $order->loadMissing('items', 'voucher', 'latestPayment');

        $trackingUrl = route('tracking.show', ['number' => $order->order_number]);
        $qrDataUri = $this->generateQrDataUri($trackingUrl);

        $pdf = Pdf::loadView('pdf.invoice', [
            'order' => $order,
            'settings' => $this->settingsBundle(),
            'trackingUrl' => $trackingUrl,
            'qrDataUri' => $qrDataUri,
        ])->setPaper('a5', 'portrait');

        return $pdf->stream("Invoice-{$order->order_number}.pdf");
    }

    /**
     * @return array<string, mixed>
     */
    private function settingsBundle(): array
    {
        return [
            'store_name' => Setting::get('store_name'),
            'store_address' => Setting::get('store_address'),
            'store_phone' => Setting::get('store_phone'),
            'store_whatsapp' => Setting::get('store_whatsapp'),
            'store_email' => Setting::get('store_email'),
        ];
    }
}
