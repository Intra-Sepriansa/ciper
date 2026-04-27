import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminPageHeader from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatRupiah } from '@/lib/format';

type Daily = Array<{ date: string; total: number; orders: number }>;

export default function AdminReportsIndex({ range, daily }: { range: { start: string; end: string }; daily: Daily }) {
    const [start, setStart] = useState(range.start);
    const [end, setEnd] = useState(range.end);

    const apply = () => router.get('/admin/reports', { start, end }, { preserveState: true });
    const totalSales = daily.reduce((s, d) => s + d.total, 0);
    const totalOrders = daily.reduce((s, d) => s + d.orders, 0);

    return (
        <>
            <Head title="Laporan" />
            <AdminPageHeader
                title="Laporan Penjualan"
                description="Penjualan, pesanan, dan ekspor."
                actions={
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                        <a href={`/admin/reports/export?start=${start}&end=${end}`}>Export CSV</a>
                    </Button>
                }
            />

            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <div className="flex flex-wrap items-end gap-3">
                    <div><Label>Mulai</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
                    <div><Label>Selesai</Label><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
                    <Button onClick={apply} className="bg-emerald-600 hover:bg-emerald-700">Terapkan</Button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-emerald-50/70 p-4"><div className="text-xs text-emerald-900/70">Total Penjualan</div><div className="text-2xl font-semibold text-emerald-900">{formatRupiah(totalSales)}</div></div>
                    <div className="rounded-xl bg-emerald-50/70 p-4"><div className="text-xs text-emerald-900/70">Total Pesanan</div><div className="text-2xl font-semibold text-emerald-900">{totalOrders}</div></div>
                </div>

                <div className="mt-4 h-72">
                    <ResponsiveContainer>
                        <LineChart data={daily} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                            <XAxis dataKey="date" stroke="#065f46" fontSize={11} />
                            <YAxis stroke="#065f46" fontSize={11} />
                            <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                            <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}
