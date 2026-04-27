import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import DataPagination from '@/components/admin/data-pagination';
import StatusBadge from '@/components/storefront/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah, orderTypeLabel } from '@/lib/format';

type Order = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    grand_total: number;
    status: string;
    payment_status: string;
    order_type: string;
    created_at: string;
};

type Paginated<T> = { data: T[] } & { current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> };

const STATUSES = ['pending_payment', 'paid', 'processing', 'ready_for_pickup', 'delivering', 'completed', 'cancelled', 'expired', 'refunded'];

export default function AdminOrdersIndex({ orders, filters }: { orders: Paginated<Order>; filters: { q?: string; status?: string; payment_status?: string; order_type?: string } }) {
    const [q, setQ] = useState(filters.q ?? '');
    const submit = (e: FormEvent) => {
 e.preventDefault(); router.get('/admin/orders', { ...filters, q }, { preserveState: true, preserveScroll: true }); 
};
    const setFilter = (key: string, value?: string) => router.get('/admin/orders', { ...filters, [key]: value || undefined }, { preserveState: true, preserveScroll: true });

    return (
        <>
            <Head title="Kelola Pesanan" />
            <AdminPageHeader title="Pesanan" description="Daftar pesanan yang masuk dari pelanggan." />

            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nomor / nama / hp" className="max-w-xs" />
                    <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={filters.status ?? ''} onChange={(e) => setFilter('status', e.target.value)}>
                        <option value="">Semua Status</option>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={filters.order_type ?? ''} onChange={(e) => setFilter('order_type', e.target.value)}>
                        <option value="">Semua Tipe</option>
                        <option value="dine_in">Dine-in</option>
                        <option value="takeaway">Takeaway</option>
                        <option value="delivery">Delivery</option>
                    </select>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Cari</Button>
                </form>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-xs uppercase text-emerald-900/60">
                                <th className="py-2">Order</th>
                                <th className="py-2">Pelanggan</th>
                                <th className="py-2">Tipe</th>
                                <th className="py-2">Total</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Bayar</th>
                                <th className="py-2">Tanggal</th>
                                <th className="py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((o) => (
                                <tr key={o.id} className="border-t border-emerald-100/70">
                                    <td className="py-2"><Link href={`/admin/orders/${o.id}`} className="font-medium text-emerald-700 hover:underline">{o.order_number}</Link></td>
                                    <td className="py-2"><div>{o.customer_name}</div><div className="text-xs text-emerald-900/60">{o.customer_phone}</div></td>
                                    <td className="py-2">{orderTypeLabel(o.order_type)}</td>
                                    <td className="py-2 font-medium">{formatRupiah(o.grand_total)}</td>
                                    <td className="py-2"><StatusBadge status={o.status} /></td>
                                    <td className="py-2"><StatusBadge status={o.payment_status} /></td>
                                    <td className="py-2 text-xs text-emerald-900/70">{new Date(o.created_at).toLocaleString('id-ID')}</td>
                                    <td className="py-2"><Link href={`/admin/orders/${o.id}`} className="text-emerald-700 hover:underline">Detail</Link></td>
                                </tr>
                            ))}
                            {orders.data.length === 0 ? <tr><td colSpan={8} className="py-4 text-emerald-900/60">Belum ada pesanan.</td></tr> : null}
                        </tbody>
                    </table>
                </div>
                <DataPagination paginator={orders} />
            </div>
        </>
    );
}
