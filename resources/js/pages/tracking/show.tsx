import { Head, Link, usePage } from '@inertiajs/react';
import StatusBadge from '@/components/storefront/status-badge';
import { Button } from '@/components/ui/button';
import { formatRupiah, orderTypeLabel, statusLabel, whatsappLink } from '@/lib/format';
import type { OrderRecord, StorefrontPageProps } from '@/types/storefront';

type Props = { order: OrderRecord; qr_data_uri: string };

export default function TrackingShow({ order, qr_data_uri }: Props) {
    const { props } = usePage<StorefrontPageProps>();
    const wa = whatsappLink(
        props.storefront?.store_whatsapp,
        `Halo Cidurian Riverside, saya ingin tanya soal order ${order.order_number}.`,
    );

    return (
        <>
            <Head title={`Tracking ${order.order_number}`} />
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-xs text-emerald-900/70">Nomor Pesanan</div>
                                <div className="font-semibold text-emerald-900">{order.order_number}</div>
                                <div className="mt-1 text-sm text-emerald-900/70">{orderTypeLabel(order.order_type)} • {order.customer_name}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <StatusBadge status={order.status} />
                                <StatusBadge status={order.payment_status} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="font-semibold text-emerald-900">Timeline Pesanan</h2>
                        <ol className="mt-4 space-y-3 border-l border-emerald-100 pl-4">
                            {(order.status_histories ?? []).map((h) => (
                                <li key={h.id} className="relative">
                                    <span className="absolute -left-[21px] top-1 size-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                                    <div className="text-sm font-medium text-emerald-900">{statusLabel(h.to_status)}</div>
                                    <div className="text-xs text-emerald-900/60">{new Date(h.created_at).toLocaleString('id-ID')} {h.changed_by ? `• ${h.changed_by.name}` : ''}</div>
                                    {h.note ? <div className="mt-0.5 text-sm text-emerald-900/80">{h.note}</div> : null}
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="font-semibold text-emerald-900">Detail Pesanan</h2>
                        <div className="mt-3 space-y-2 text-sm">
                            {(order.items ?? []).map((item) => (
                                <div key={item.id} className="flex justify-between gap-2">
                                    <span className="min-w-0">
                                        <div className="line-clamp-1 font-medium">{item.product_name}</div>
                                        <div className="text-xs text-emerald-900/60">{item.quantity} × {formatRupiah(item.unit_price)}</div>
                                    </span>
                                    <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 space-y-1 border-t border-emerald-100 pt-3 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(order.subtotal)}</span></div>
                            <div className="flex justify-between"><span>Diskon</span><span>-{formatRupiah(order.discount_total)}</span></div>
                            <div className="flex justify-between"><span>Ongkir</span><span>{formatRupiah(order.shipping_cost)}</span></div>
                            <div className="flex justify-between border-t border-emerald-100 pt-2 text-base font-semibold text-emerald-900"><span>Total</span><span>{formatRupiah(order.grand_total)}</span></div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-3 lg:sticky lg:top-20 h-fit">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-5 text-center">
                        <h2 className="font-semibold text-emerald-900">QR Tracking</h2>
                        <img src={qr_data_uri} alt="QR Code" className="mx-auto mt-3 size-40" />
                        <p className="mt-2 text-xs text-emerald-900/60">Scan untuk membuka halaman ini.</p>
                    </div>

                    <div className="space-y-2">
                        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                            <a href={`/tracking/${order.order_number}/invoice`} target="_blank" rel="noreferrer">Download Invoice PDF</a>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                            <a href={wa} target="_blank" rel="noreferrer">Hubungi Admin via WhatsApp</a>
                        </Button>
                        {order.payment_status !== 'paid' ? (
                            <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                                <Link href={`/checkout/${order.order_number}/payment`}>Buka Halaman Pembayaran</Link>
                            </Button>
                        ) : null}
                    </div>
                </aside>
            </div>
        </>
    );
}
