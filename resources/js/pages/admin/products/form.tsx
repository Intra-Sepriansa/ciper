import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Product = {
    id: number;
    name: string;
    slug?: string;
    sku?: string | null;
    short_description?: string | null;
    description?: string | null;
    price: number;
    discount_price?: number | null;
    stock?: number;
    track_stock?: boolean;
    is_available?: boolean;
    is_popular?: boolean;
    is_recommended?: boolean;
    category_id: number | null;
    image_path?: string | null;
};

type Props = { product?: Product | null; categories: Array<{ id: number; name: string }>; mode: 'create' | 'edit' };

export default function AdminProductForm({ product, categories, mode }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        category_id: string;
        sku: string;
        price: string;
        discount_price: string;
        stock: string;
        track_stock: boolean;
        is_available: boolean;
        is_popular: boolean;
        is_recommended: boolean;
        short_description: string;
        description: string;
        image: File | null;
        _method?: string;
    }>({
        name: product?.name ?? '',
        category_id: product?.category_id ? String(product.category_id) : (categories[0]?.id ? String(categories[0].id) : ''),
        sku: product?.sku ?? '',
        price: product?.price ? String(product.price) : '',
        discount_price: product?.discount_price ? String(product.discount_price) : '',
        stock: product?.stock != null ? String(product.stock) : '0',
        track_stock: product?.track_stock ?? false,
        is_available: product?.is_available ?? true,
        is_popular: product?.is_popular ?? false,
        is_recommended: product?.is_recommended ?? false,
        short_description: product?.short_description ?? '',
        description: product?.description ?? '',
        image: null,
        _method: mode === 'edit' ? 'PUT' : undefined,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const url = mode === 'edit' ? `/admin/products/${product?.id}` : '/admin/products';
        post(url, { forceFormData: true });
    };

    return (
        <>
            <Head title={mode === 'edit' ? `Edit ${product?.name}` : 'Tambah Menu'} />
            <AdminPageHeader title={mode === 'edit' ? `Edit Menu` : 'Tambah Menu'} description="Lengkapi data menu di bawah ini." />

            <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-emerald-100 bg-white p-5 lg:grid-cols-3">
                <div className="space-y-3 lg:col-span-2">
                    <div>
                        <Label>Nama menu</Label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <Label>Kategori</Label>
                            <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} required>
                                {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label>SKU (opsional)</Label>
                            <Input value={data.sku} onChange={(e) => setData('sku', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                            <Label>Harga</Label>
                            <Input type="number" min={0} value={data.price} onChange={(e) => setData('price', e.target.value)} required />
                        </div>
                        <div>
                            <Label>Harga diskon</Label>
                            <Input type="number" min={0} value={data.discount_price} onChange={(e) => setData('discount_price', e.target.value)} />
                        </div>
                        <div>
                            <Label>Stok</Label>
                            <Input type="number" min={0} value={data.stock} onChange={(e) => setData('stock', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>Deskripsi singkat</Label>
                        <Input value={data.short_description} onChange={(e) => setData('short_description', e.target.value)} />
                    </div>
                    <div>
                        <Label>Deskripsi lengkap</Label>
                        <textarea
                            className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <Label>Foto</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} />
                        {product?.image_path ? <p className="mt-1 text-xs text-emerald-900/60">Saat ini: {product.image_path}</p> : null}
                    </div>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-emerald-600" checked={data.track_stock} onChange={(e) => setData('track_stock', e.target.checked)} /> Lacak stok</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-emerald-600" checked={data.is_available} onChange={(e) => setData('is_available', e.target.checked)} /> Tersedia</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-emerald-600" checked={data.is_popular} onChange={(e) => setData('is_popular', e.target.checked)} /> Populer</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-emerald-600" checked={data.is_recommended} onChange={(e) => setData('is_recommended', e.target.checked)} /> Rekomendasi</label>
                    <Button type="submit" disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700">Simpan</Button>
                </div>
            </form>
        </>
    );
}
