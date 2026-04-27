import { Head, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import DataPagination from '@/components/admin/data-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah } from '@/lib/format';

type Customer = { id: number; name: string; phone: string; email?: string | null; orders_count: number; total_spent: number; created_at: string };

export default function AdminCustomersIndex({ customers, filters }: { customers: { data: Customer[]; current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> }; filters: { q?: string } }) {
    const [q, setQ] = useState(filters.q ?? '');
    const submit = (e: FormEvent) => {
 e.preventDefault(); router.get('/admin/customers', { q }, { preserveState: true, preserveScroll: true }); 
};

    return (
        <>
            <Head title="Pelanggan" />
            <AdminPageHeader title="Pelanggan" description="Daftar pelanggan dan riwayat transaksi mereka." />

            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <form onSubmit={submit} className="mb-3 flex flex-wrap gap-2">
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama / telp / email" className="max-w-xs" />
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Cari</Button>
                </form>
                <table className="w-full text-left text-sm">
                    <thead><tr className="text-xs uppercase text-emerald-900/60"><th className="py-2">Nama</th><th>Kontak</th><th>Pesanan</th><th>Total Belanja</th><th>Bergabung</th></tr></thead>
                    <tbody>
                        {customers.data.map((c) => (
                            <tr key={c.id} className="border-t border-emerald-100/70">
                                <td className="py-2 font-medium">{c.name}</td>
                                <td><div>{c.phone}</div>{c.email ? <div className="text-xs text-emerald-900/60">{c.email}</div> : null}</td>
                                <td>{c.orders_count}</td>
                                <td className="font-semibold text-emerald-700">{formatRupiah(c.total_spent)}</td>
                                <td className="text-xs text-emerald-900/70">{new Date(c.created_at).toLocaleDateString('id-ID')}</td>
                            </tr>
                        ))}
                        {customers.data.length === 0 ? <tr><td colSpan={5} className="py-3 text-emerald-900/60">Belum ada pelanggan.</td></tr> : null}
                    </tbody>
                </table>
                <DataPagination paginator={customers} />
            </div>
        </>
    );
}
