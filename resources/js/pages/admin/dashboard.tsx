import { Head, Link } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatusBadge from '@/components/storefront/status-badge';
import { formatRupiah } from '@/lib/format';

type Metrics = {
    today_sales: number;
    today_orders: number;
    pending_orders: number;
    processing_orders: number;
    sales_chart: Array<{ date: string; total: number; orders: number }>;
    best_sellers: Array<{ id: number; name: string; total_sold: number }>;
    low_stock: Array<{ id: number; name: string; stock: number }>;
};

type RecentOrder = {
    id: number;
    order_number: string;
    customer_name: string;
    grand_total: number;
    status: string;
    payment_status: string;
    order_type: string;
    created_at: string;
};

export default function AdminDashboard({ metrics, recentOrders }: { metrics: Metrics; recentOrders: RecentOrder[] }) {
    const cards = [
        { label: 'Penjualan Hari Ini', value: formatRupiah(metrics.today_sales) },
        { label: 'Pesanan Hari Ini', value: metrics.today_orders.toString() },
        { label: 'Pending Pembayaran', value: metrics.pending_orders.toString() },
        { label: 'Sedang Diproses', value: metrics.processing_orders.toString() },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-emerald-950">Dashboard</h1>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((c) => (
                        <div key={c.label} className="rounded-2xl border border-emerald-100 bg-white p-4">
                            <div className="text-xs text-emerald-900/70">{c.label}</div>
                            <div className="mt-1 text-2xl font-semibold text-emerald-900">{c.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-4 lg:col-span-2">
                        <h2 className="text-sm font-semibold text-emerald-900">Penjualan 7 Hari</h2>
                        <div className="h-64">
                            <ResponsiveContainer>
                                <BarChart data={metrics.sales_chart} margin={{ top: 16, right: 8, left: 8, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                                    <XAxis dataKey="date" stroke="#065f46" fontSize={11} />
                                    <YAxis stroke="#065f46" fontSize={11} />
                                    <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                                    <Bar dataKey="total" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                        <h2 className="text-sm font-semibold text-emerald-900">Menu Terlaris</h2>
                        <ul className="mt-3 space-y-2 text-sm">
                            {metrics.best_sellers.map((b) => (
                                <li key={b.id} className="flex items-center justify-between gap-2">
                                    <span className="line-clamp-1">{b.name}</span>
                                    <span className="font-semibold text-emerald-700">{b.total_sold}</span>
                                </li>
                            ))}
                            {metrics.best_sellers.length === 0 ? <li className="text-emerald-900/60">Belum ada data.</li> : null}
                        </ul>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-emerald-900">Pesanan Terbaru</h2>
                            <Link href="/admin/orders" className="text-xs text-emerald-700 hover:underline">Lihat semua</Link>
                        </div>
                        <div className="mt-3 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-xs uppercase text-emerald-900/60">
                                        <th className="py-2">Order</th>
                                        <th className="py-2">Pelanggan</th>
                                        <th className="py-2">Total</th>
                                        <th className="py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((o) => (
                                        <tr key={o.id} className="border-t border-emerald-100/70">
                                            <td className="py-2"><Link href={`/admin/orders/${o.id}`} className="font-medium text-emerald-700 hover:underline">{o.order_number}</Link></td>
                                            <td className="py-2">{o.customer_name}</td>
                                            <td className="py-2">{formatRupiah(o.grand_total)}</td>
                                            <td className="py-2"><StatusBadge status={o.status} /></td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 ? (
                                        <tr><td className="py-3 text-emerald-900/60" colSpan={4}>Belum ada pesanan.</td></tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                        <h2 className="text-sm font-semibold text-emerald-900">Stok Hampir Habis</h2>
                        <ul className="mt-3 space-y-2 text-sm">
                            {metrics.low_stock.map((p) => (
                                <li key={p.id} className="flex items-center justify-between gap-2">
                                    <span className="line-clamp-1">{p.name}</span>
                                    <span className="font-semibold text-rose-600">{p.stock}</span>
                                </li>
                            ))}
                            {metrics.low_stock.length === 0 ? <li className="text-emerald-900/60">Stok aman.</li> : null}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
