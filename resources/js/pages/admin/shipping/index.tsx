import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatRupiah } from '@/lib/format';

type Rate = { id: number; name: string; area: string; subdistrict?: string | null; price: number; etd_minutes?: number | null; min_order: number; is_active: boolean; sort_order: number };

export default function AdminShippingIndex({ rates }: { rates: Rate[] }) {
    const [editing, setEditing] = useState<Rate | null>(null);
    const blank = { name: '', area: '', subdistrict: '', price: 0, etd_minutes: 0, min_order: 0, is_active: true, sort_order: 0 };
    const { data, setData, post, put, processing, reset } = useForm(blank);

    const startEdit = (r: Rate) => {
        setEditing(r);
        setData({ name: r.name, area: r.area, subdistrict: r.subdistrict ?? '', price: r.price, etd_minutes: r.etd_minutes ?? 0, min_order: r.min_order, is_active: r.is_active, sort_order: r.sort_order });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
put(`/admin/shipping/${editing.id}`, { onSuccess: () => {
 setEditing(null); reset(); 
} });
} else {
post('/admin/shipping', { onSuccess: () => reset() });
}
    };

    const remove = (r: Rate) => {
 if (confirm(`Hapus tarif ${r.name}?`)) {
router.delete(`/admin/shipping/${r.id}`, { preserveScroll: true });
} 
};

    return (
        <>
            <Head title="Tarif Ongkir" />
            <AdminPageHeader title="Tarif Ongkir" description="Kelola tarif pengiriman lokal Jasinga & sekitarnya." />

            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="text-xs uppercase text-emerald-900/60"><th className="py-2">Nama</th><th>Area</th><th>Harga</th><th>ETD</th><th>Min</th><th></th></tr></thead>
                        <tbody>
                            {rates.map((r) => (
                                <tr key={r.id} className="border-t border-emerald-100/70">
                                    <td className="py-2 font-medium">{r.name}</td>
                                    <td>{r.area}{r.subdistrict ? ` / ${r.subdistrict}` : ''}</td>
                                    <td>{formatRupiah(r.price)}</td>
                                    <td>{r.etd_minutes ?? '-'} m</td>
                                    <td>{formatRupiah(r.min_order)}</td>
                                    <td className="space-x-2 py-2">
                                        <button onClick={() => startEdit(r)} className="text-emerald-700 hover:underline">Edit</button>
                                        <button onClick={() => remove(r)} className="text-rose-600 hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {rates.length === 0 ? <tr><td colSpan={6} className="py-3 text-emerald-900/60">Belum ada tarif.</td></tr> : null}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={submit} className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-4">
                    <h2 className="text-sm font-semibold text-emerald-900">{editing ? `Edit "${editing.name}"` : 'Tambah Tarif'}</h2>
                    <div><Label>Nama</Label><Input value={data.name} onChange={(e) => setData('name', e.target.value)} required /></div>
                    <div><Label>Area</Label><Input value={data.area} onChange={(e) => setData('area', e.target.value)} required placeholder="Jasinga / Bogor Barat" /></div>
                    <div><Label>Sub-area</Label><Input value={data.subdistrict} onChange={(e) => setData('subdistrict', e.target.value)} /></div>
                    <div><Label>Harga</Label><Input type="number" min={0} value={data.price} onChange={(e) => setData('price', Number(e.target.value))} required /></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label>ETD (menit)</Label><Input type="number" min={0} value={data.etd_minutes} onChange={(e) => setData('etd_minutes', Number(e.target.value))} /></div>
                        <div><Label>Min. Order</Label><Input type="number" min={0} value={data.min_order} onChange={(e) => setData('min_order', Number(e.target.value))} /></div>
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
