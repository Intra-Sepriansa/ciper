export function formatRupiah(value: number | string | null | undefined): string {
    const n = Number(value ?? 0);

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number.isFinite(n) ? n : 0);
}

export function storageUrl(path?: string | null, fallback = '/images/placeholder.svg'): string {
    if (!path) {
        return fallback;
    }

    if (/^https?:/i.test(path)) {
        return path;
    }

    return `/storage/${path.replace(/^\/+/, '')}`;
}

export function whatsappLink(number?: string, message?: string): string {
    const cleaned = (number ?? '6281234567890').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(message ?? 'Halo Cidurian Riverside, saya ingin bertanya.');

    return `https://wa.me/${cleaned}?text=${text}`;
}

export function statusLabel(status: string): string {
    const map: Record<string, string> = {
        pending_payment: 'Menunggu Pembayaran',
        paid: 'Dibayar',
        processing: 'Diproses',
        ready_for_pickup: 'Siap Diambil',
        delivering: 'Dalam Pengiriman',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
        expired: 'Kedaluwarsa',
        refunded: 'Dikembalikan',
        unpaid: 'Belum Bayar',
        pending: 'Menunggu Konfirmasi',
        failed: 'Gagal',
    };

    return map[status] ?? status;
}

export function statusTone(status: string): 'warning' | 'info' | 'accent' | 'success' | 'danger' | 'muted' {
    switch (status) {
        case 'pending_payment':
        case 'unpaid':
        case 'pending':
            return 'warning';
        case 'paid':
        case 'processing':
            return 'info';
        case 'ready_for_pickup':
        case 'delivering':
            return 'accent';
        case 'completed':
            return 'success';
        case 'cancelled':
        case 'expired':
        case 'refunded':
        case 'failed':
            return 'danger';
        default:
            return 'muted';
    }
}

export function orderTypeLabel(type: string): string {
    return (
        { dine_in: 'Makan di Tempat', takeaway: 'Bawa Pulang', delivery: 'Pesan Antar' } as Record<string, string>
    )[type] ?? type;
}
