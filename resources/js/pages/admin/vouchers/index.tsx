import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import DataPagination from '@/components/admin/data-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatRupiah } from '@/lib/format';

type Voucher = {
    id: number;
    code: string;
    name: string;
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    min_purchase?: number;
    max_discount?: number;
    quota?: number;
    used_count?: number;
    starts_at?: string | null;
    expires_at?: string | null;
    is_active: boolean;
};

type Props = { vouchers: { data: Voucher[]; current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> } };

export default function AdminVouchersIndex({ vouchers }: Props) {
    const [editing, setEditing] = useState<Voucher | null>(null);
    const initial = { code: '', name: '', description: '', type: 'percentage' as Voucher['type'], value: 0, min_purchase: 0, max_discount: 0, quota: 0, per_user_limit: 0, starts_at: '', expires_at: '', is_active: true };
    const { data, setData, post, put, processing, reset } = useForm(initial);

    const startEdit = (v: Voucher) => {
        setEditing(v);
        setData({ code: v.code, name: v.name, description: '', type: v.type, value: v.value, min_purchase: v.min_purchase ?? 0, max_discount: v.max_discount ?? 0, quota: v.quota ?? 0, per_user_limit: 0, starts_at: v.starts_at ?? '', expires_at: v.expires_at ?? '', is_active: v.is_active });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
put(`/admin/vouchers/${editing.id}`, { onSuccess: () => {
 setEditing(null); reset(); 
} });
} else {
post('/admin/vouchers', { onSuccess: () => reset() });
}
    };

    const remove = (v: Voucher) => {
 if (confirm(`Hapus voucher ${v.code}?`)) {
router.delete(`/admin/vouchers/${v.id}`, { preserveScroll: true });
} 
};

    return (
        <>
            <Head title="Voucher" />
            <AdminPageHeader title="Promo & Voucher" description="Kelola kode voucher dan promo." />

            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="text-xs uppercase text-emerald-900/60"><th className="py-2">Kode</th><th>Tipe</th><th>Nilai</th><th>Min</th><th>Kuota</th><th>Periode</th><th></th></tr></thead>
                        <tbody>
                            {vouchers.data.map((v) => (
                                <tr key={v.id} className="border-t border-emerald-100/70">
                                    <td className="py-2"><div className="font-medium">{v.code}</div><div className="text-xs text-emerald-900/60">{v.name}</div></td>
                                    <td>{v.type}</td>
                                    <td>{v.type === 'percentage' ? `${v.value}%` : formatRupiah(v.value)}</td>
                                    <td>{formatRupiah(v.min_purchase ?? 0)}</td>
                                    <td>{v.used_count ?? 0}/{v.quota ?? '∞'}</td>
                                    <td className="text-xs text-emerald-900/70">{v.starts_at ?? '-'} → {v.expires_at ?? '-'}</td>
                                    <td className="space-x-2 py-2">
                                        <button onClick={() => startEdit(v)} className="text-emerald-700 hover:underline">Edit</button>
                                        <button onClick={() => remove(v)} className="text-rose-600 hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {vouchers.data.length === 0 ? <tr><td colSpan={7} className="py-3 text-emerald-900/60">Belum ada voucher.</td></tr> : null}
                        </tbody>
                    </table>
                    <DataPagination paginator={vouchers} />
                </div>

                <form onSubmit={submit} className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-4">
                    <h2 className="text-sm font-semibold text-emerald-900">{editing ? `Edit "${editing.code}"` : 'Tambah Voucher'}</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label>Kode</Label><Input value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} required /></div>
                        <div><Label>Tipe</Label><select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={data.type} onChange={(e) => setData('type', e.target.value as Voucher['type'])}><option value="percentage">Persen</option><option value="fixed">Nominal</option><option value="free_shipping">Gratis Ongkir</option></select></div>
                    </div>
                    <div><Label>Nama</Label><Input value={data.name} onChange={(e) => setData('name', e.target.value)} required /></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label>Nilai</Label><Input type="number" min={0} value={data.value} onChange={(e) => setData('value', Number(e.target.value))} required /></div>
                        <div><Label>Min. Pembelian</Label><Input type="number" min={0} value={data.min_purchase} onChange={(e) => setData('min_purchase', Number(e.target.value))} /></div>
                        <div><Label>Maks. Diskon</Label><Input type="number" min={0} value={data.max_discount} onChange={(e) => setData('max_discount', Number(e.target.value))} /></div>
                        <div><Label>Kuota</Label><Input type="number" min={0} value={data.quota} onChange={(e) => setData('quota', Number(e.target.value))} /></div>
                        <div><Label>Mulai</Label><Input type="date" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} /></div>
                        <div><Label>Berakhir</Label><Input type="date" value={data.expires_at} onChange={(e) => setData('expires_at', e.target.value)} /></div>
                    </div>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-emerald-600" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} /> Aktif</label>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">{editing ? 'Simpan' : 'Tambah'}</Button>
                        {editing ? <Button type="button" variant="outline" onClick={() => {
 setEditing(null); reset(); 
}}>Batal</Button> : null}
                    </div>
                </form>
            </div>
        </>
    );
}
