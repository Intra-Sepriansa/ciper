import { Head, Link, usePage } from '@inertiajs/react';
import StatusBadge from '@/components/storefront/status-badge';
import { Button } from '@/components/ui/button';
import { formatRupiah, whatsappLink } from '@/lib/format';
import type { OrderRecord, StorefrontPageProps } from '@/types/storefront';

type Intent = {
    provider: string;
    snap_token?: string;
    redirect_url?: string;
    bank_name?: string;
    bank_account?: string;
    bank_holder?: string;
    amount?: number;
    expires_at?: string;
    instructions?: string;
};

export default function CheckoutPayment({ order, intent }: { order: OrderRecord; intent: Intent | null }) {
    const { props } = usePage<StorefrontPageProps>();
    const wa = whatsappLink(
        props.storefront?.store_whatsapp,
        `Halo Cidurian Riverside, saya ingin konfirmasi pembayaran order ${order.order_number}.`,
    );

    return (
        <>
            <Head title={`Pembayaran ${order.order_number}`} />
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                    <h1 className="text-2xl font-semibold text-emerald-950">Pembayaran</h1>
                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-xs text-emerald-900/70">Nomor Pesanan</div>
                                <div className="font-semibold text-emerald-900">{order.order_number}</div>
                            </div>
                            <StatusBadge status={order.payment_status} />
                        </div>
                        <div className="mt-4 space-y-1 text-sm text-emerald-900/80">
                            <div>Atas nama <span className="font-medium text-emerald-900">{order.customer_name}</span></div>
                            <div>WhatsApp <span className="font-medium text-emerald-900">{order.customer_phone}</span></div>
                            <div>Total bayar <span className="font-semibold text-emerald-700">{formatRupiah(order.grand_total)}</span></div>
                        </div>
                    </div>

                    {intent ? (
                        <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                            <h2 className="font-semibold text-emerald-900">Instruksi Pembayaran</h2>
                            <p className="mt-2 text-sm text-emerald-900/80">{intent.instructions}</p>
                            {intent.provider === 'manual' ? (
                                <div className="mt-3 space-y-1 rounded-xl bg-emerald-50/70 p-4 text-sm">
                                    <div>Bank <span className="font-medium">{intent.bank_name}</span></div>
                                    <div>Rekening <span className="font-mono font-medium">{intent.bank_account}</span></div>
                                    <div>Atas nama <span className="font-medium">{intent.bank_holder}</span></div>
                                    <div>Jumlah <span className="font-semibold text-emerald-700">{formatRupiah(intent.amount ?? order.grand_total)}</span></div>
                                </div>
                            ) : null}
                            {intent.redirect_url ? (
                                <Button asChild className="mt-3 bg-emerald-600 hover:bg-emerald-700">
                                    <a href={intent.redirect_url} target="_blank" rel="noreferrer">Bayar via {intent.provider}</a>
                                </Button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-emerald-100 bg-white p-5 text-sm text-emerald-900/80">
                            Pesanan ini sudah tidak menerima pembayaran tambahan. Cek halaman tracking untuk status terbaru.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                            <Link href={`/tracking/${order.order_number}`}>Lacak Pesanan</Link>
                        </Button>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                            <a href={wa} target="_blank" rel="noreferrer">Konfirmasi via WhatsApp</a>
                        </Button>
                    </div>
                </div>

                <aside className="space-y-3 lg:sticky lg:top-20 h-fit">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="font-semibold text-emerald-900">Detail Item</h2>
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
                            <div className="flex justify-between"><span>Pajak / Service</span><span>{formatRupiah(order.tax_total + order.service_total)}</span></div>
                            <div className="flex justify-between border-t border-emerald-100 pt-2 text-base font-semibold text-emerald-900"><span>Total</span><span>{formatRupiah(order.grand_total)}</span></div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
