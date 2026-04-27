import { Head, useForm } from '@inertiajs/react';
import { confirmPayment, invoice, updateStatus } from '@/actions/App/Http/Controllers/Admin/OrderController';
import AdminPageHeader from '@/components/admin/admin-page-header';
import StatusBadge from '@/components/storefront/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatRupiah, orderTypeLabel, statusLabel } from '@/lib/format';
import type { OrderRecord } from '@/types/storefront';

const STATUSES = ['pending_payment', 'paid', 'processing', 'ready_for_pickup', 'delivering', 'completed', 'cancelled', 'expired', 'refunded'];

export default function AdminOrderShow({ order }: { order: OrderRecord }) {
    const statusForm = useForm({ status: order.status, note: '' });
    const paymentForm = useForm({ method: 'manual', reference: '' });

    return (
        <>
            <Head title={`Pesanan ${order.order_number}`} />
            <AdminPageHeader title={`Pesanan ${order.order_number}`} description={`${orderTypeLabel(order.order_type)} • ${order.customer_name}`} />

            <div className="grid gap-5 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="text-sm font-semibold text-emerald-900">Item Pesanan</h2>
                        <table className="mt-3 w-full text-left text-sm">
                            <thead><tr className="text-xs uppercase text-emerald-900/60"><th className="py-2">Menu</th><th className="py-2">Qty</th><th className="py-2">Harga</th><th className="py-2">Subtotal</th></tr></thead>
                            <tbody>
                                {(order.items ?? []).map((it) => (
                                    <tr key={it.id} className="border-t border-emerald-100/70">
                                        <td className="py-2"><div className="font-medium">{it.product_name}</div>{it.variant_name ? <div className="text-xs text-emerald-900/60">{it.variant_name}</div> : null}{it.note ? <div className="text-xs text-emerald-900/60">Catatan: {it.note}</div> : null}</td>
                                        <td className="py-2">{it.quantity}</td>
                                        <td className="py-2">{formatRupiah(it.unit_price)}</td>
                                        <td className="py-2 font-medium">{formatRupiah(it.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 space-y-1 border-t border-emerald-100 pt-3 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(order.subtotal)}</span></div>
                            <div className="flex justify-between"><span>Diskon</span><span>-{formatRupiah(order.discount_total)}</span></div>
                            <div className="flex justify-between"><span>Ongkir</span><span>{formatRupiah(order.shipping_cost)}</span></div>
                            <div className="flex justify-between"><span>Pajak / Service</span><span>{formatRupiah(order.tax_total + order.service_total)}</span></div>
                            <div className="flex justify-between border-t border-emerald-100 pt-2 text-base font-semibold text-emerald-900"><span>Total</span><span>{formatRupiah(order.grand_total)}</span></div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="text-sm font-semibold text-emerald-900">Timeline</h2>
                        <ol className="mt-3 space-y-3 border-l border-emerald-100 pl-4">
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
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-5 text-sm">
                        <h2 className="font-semibold text-emerald-900">Status</h2>
                        <div className="mt-2 flex flex-col gap-2">
                            <StatusBadge status={order.status} />
                            <StatusBadge status={order.payment_status} />
                        </div>
                        <div className="mt-3 space-y-1 text-emerald-900/80">
                            <div>Pelanggan: <span className="font-medium text-emerald-900">{order.customer_name}</span></div>
                            <div>WA: <span className="font-medium text-emerald-900">{order.customer_phone}</span></div>
                            {order.customer_email ? <div>Email: <span className="font-medium text-emerald-900">{order.customer_email}</span></div> : null}
                            <div>Tipe: <span className="font-medium text-emerald-900">{orderTypeLabel(order.order_type)}</span></div>
                            {order.delivery_address_snapshot ? <div>Alamat: <span className="font-medium text-emerald-900">{order.delivery_address_snapshot}</span></div> : null}
                            {order.scheduled_at ? <div>Jadwal: <span className="font-medium text-emerald-900">{new Date(order.scheduled_at).toLocaleString('id-ID')}</span></div> : null}
                            {order.dine_in_area ? <div>Area: <span className="font-medium text-emerald-900">{order.dine_in_area}</span></div> : null}
                        </div>
                        <a href={invoice({ order: order.id }).url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-emerald-700 hover:underline">Cetak Invoice PDF</a>
                    </div>

                    <form onSubmit={(e) => {
 e.preventDefault(); statusForm.post(updateStatus({ order: order.id }).url, { preserveScroll: true }); 
}} className="space-y-2 rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="text-sm font-semibold text-emerald-900">Update Status</h2>
                        <div>
                            <Label>Status baru</Label>
                            <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={statusForm.data.status} onChange={(e) => statusForm.setData('status', e.target.value)}>
                                {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label>Catatan (opsional)</Label>
                            <Input value={statusForm.data.note} onChange={(e) => statusForm.setData('note', e.target.value)} />
                        </div>
                        <Button type="submit" disabled={statusForm.processing} className="w-full bg-emerald-600 hover:bg-emerald-700">Simpan</Button>
                    </form>

                    {order.payment_status !== 'paid' ? (
                        <form onSubmit={(e) => {
 e.preventDefault(); paymentForm.post(confirmPayment({ order: order.id }).url, { preserveScroll: true }); 
}} className="space-y-2 rounded-2xl border border-emerald-100 bg-white p-5">
                            <h2 className="text-sm font-semibold text-emerald-900">Konfirmasi Pembayaran Manual</h2>
                            <div>
                                <Label>Metode</Label>
                                <Input value={paymentForm.data.method} onChange={(e) => paymentForm.setData('method', e.target.value)} placeholder="manual / cash" />
                            </div>
                            <div>
                                <Label>Referensi</Label>
                                <Input value={paymentForm.data.reference} onChange={(e) => paymentForm.setData('reference', e.target.value)} placeholder="No. transfer / catatan" />
                            </div>
                            <Button type="submit" disabled={paymentForm.processing} className="w-full bg-emerald-600 hover:bg-emerald-700">Tandai Lunas</Button>
                        </form>
                    ) : null}
                </div>
            </div>
        </>
    );
}
