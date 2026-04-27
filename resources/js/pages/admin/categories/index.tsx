import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Category = { id: number; name: string; icon?: string | null; description?: string | null; sort_order: number; is_active: boolean; products_count?: number };

export default function AdminCategoriesIndex({ categories }: { categories: Category[] }) {
    const [editing, setEditing] = useState<Category | null>(null);
    const blank = { name: '', icon: '', description: '', sort_order: 0, is_active: true };
    const { data, setData, post, put, processing, reset } = useForm<{ name: string; icon: string; description: string; sort_order: number; is_active: boolean }>(blank);

    const startEdit = (c: Category) => {
        setEditing(c);
        setData({ name: c.name, icon: c.icon ?? '', description: c.description ?? '', sort_order: c.sort_order, is_active: c.is_active });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
            put(`/admin/categories/${editing.id}`, { onSuccess: () => {
 setEditing(null); reset(); 
} });
        } else {
            post('/admin/categories', { onSuccess: () => reset() });
        }
    };

    const remove = (c: Category) => {
        if (!confirm(`Hapus kategori "${c.name}"?`)) {
return;
}

        router.delete(`/admin/categories/${c.id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Kategori" />
            <AdminPageHeader title="Kategori" description="Kelola kategori menu." />

            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="text-xs uppercase text-emerald-900/60"><th className="py-2">Nama</th><th>Urutan</th><th>Status</th><th>Item</th><th></th></tr></thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c.id} className="border-t border-emerald-100/70">
                                    <td className="py-2 font-medium">{c.name}</td>
                                    <td>{c.sort_order}</td>
                                    <td>{c.is_active ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Aktif</span> : <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">Nonaktif</span>}</td>
                                    <td>{c.products_count ?? 0}</td>
                                    <td className="space-x-2 py-2">
                                        <button onClick={() => startEdit(c)} className="text-emerald-700 hover:underline">Edit</button>
                                        <button onClick={() => remove(c)} className="text-rose-600 hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 ? <tr><td colSpan={5} className="py-3 text-emerald-900/60">Belum ada kategori.</td></tr> : null}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={submit} className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-4">
                    <h2 className="text-sm font-semibold text-emerald-900">{editing ? `Edit "${editing.name}"` : 'Tambah Kategori'}</h2>
                    <div><Label>Nama</Label><Input value={data.name} onChange={(e) => setData('name', e.target.value)} required /></div>
                    <div><Label>Icon (emoji / nama)</Label><Input value={data.icon} onChange={(e) => setData('icon', e.target.value)} /></div>
                    <div><Label>Deskripsi</Label><Input value={data.description} onChange={(e) => setData('description', e.target.value)} /></div>
                    <div><Label>Urutan</Label><Input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} /></div>
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
