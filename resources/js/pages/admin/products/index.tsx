import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import DataPagination from '@/components/admin/data-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah, storageUrl } from '@/lib/format';

type Product = {
    id: number;
    name: string;
    image_path?: string | null;
    price: number;
    discount_price?: number | null;
    stock: number;
    track_stock: boolean;
    is_available: boolean;
    is_popular: boolean;
    category?: { id: number; name: string } | null;
};

type Props = {
    products: { data: Product[]; current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> };
    categories: Array<{ id: number; name: string }>;
    filters: { q?: string; category?: string; status?: string };
};

export default function AdminProductsIndex({ products, categories, filters }: Props) {
    const [q, setQ] = useState(filters.q ?? '');
    const submit = (e: FormEvent) => {
 e.preventDefault(); router.get('/admin/products', { ...filters, q }, { preserveState: true, preserveScroll: true }); 
};
    const setFilter = (key: string, value?: string) => router.get('/admin/products', { ...filters, [key]: value || undefined }, { preserveState: true, preserveScroll: true });

    return (
        <>
            <Head title="Kelola Menu" />
            <AdminPageHeader
                title="Menu"
                description="Kelola menu, harga, stok, dan ketersediaan."
                actions={<Button asChild className="bg-emerald-600 hover:bg-emerald-700"><Link href="/admin/products/create">Tambah Menu</Link></Button>}
            />

            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari menu" className="max-w-xs" />
                    <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={filters.category ?? ''} onChange={(e) => setFilter('category', e.target.value)}>
                        <option value="">Semua kategori</option>
                        {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                    </select>
                    <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={filters.status ?? ''} onChange={(e) => setFilter('status', e.target.value)}>
                        <option value="">Semua status</option>
                        <option value="available">Tersedia</option>
                        <option value="unavailable">Tidak tersedia</option>
                    </select>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Cari</Button>
                </form>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-xs uppercase text-emerald-900/60">
                                <th className="py-2">Menu</th>
                                <th className="py-2">Kategori</th>
                                <th className="py-2">Harga</th>
                                <th className="py-2">Stok</th>
                                <th className="py-2">Status</th>
                                <th className="py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((p) => (
                                <tr key={p.id} className="border-t border-emerald-100/70">
                                    <td className="py-2"><div className="flex items-center gap-2"><img src={storageUrl(p.image_path)} className="size-10 rounded-md object-cover" alt={p.name} /><span className="font-medium">{p.name}</span>{p.is_popular ? <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">Populer</span> : null}</div></td>
                                    <td className="py-2 text-emerald-900/80">{p.category?.name ?? '-'}</td>
                                    <td className="py-2">{formatRupiah(p.discount_price ?? p.price)}</td>
                                    <td className="py-2">{p.track_stock ? p.stock : '∞'}</td>
                                    <td className="py-2">{p.is_available ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Aktif</span> : <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">Nonaktif</span>}</td>
                                    <td className="py-2"><Link href={`/admin/products/${p.id}/edit`} className="text-emerald-700 hover:underline">Edit</Link></td>
                                </tr>
                            ))}
                            {products.data.length === 0 ? <tr><td colSpan={6} className="py-4 text-emerald-900/60">Belum ada menu.</td></tr> : null}
                        </tbody>
                    </table>
                </div>
                <DataPagination paginator={products} />
            </div>
        </>
    );
}
