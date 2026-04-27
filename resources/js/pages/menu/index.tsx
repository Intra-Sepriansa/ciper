import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import ProductCard from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Category, Product } from '@/types/storefront';

type Paginated<T> = { data: T[]; current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> };

type Props = {
    products: Paginated<Product>;
    categories: Category[];
    filters: { q?: string; category?: string; sort?: string; min_price?: number; max_price?: number };
};

export default function MenuIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.q ?? '');

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/menu', { ...filters, q: search || undefined }, { preserveState: true, preserveScroll: true });
    };
    const setSort = (sort: string) => {
        router.get('/menu', { ...filters, sort }, { preserveState: true, preserveScroll: true });
    };
    const setCategory = (slug?: string) => {
        router.get('/menu', { ...filters, category: slug }, { preserveState: true, preserveScroll: true });
    };

    return (
        <>
            <Head title="Menu" />
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-emerald-950">Menu</h1>
                        <p className="text-sm text-emerald-900/70">Pilih menu favorit Anda. Tambah ke keranjang lalu checkout.</p>
                    </div>
                    <form onSubmit={submitSearch} className="flex w-full max-w-sm gap-2">
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari menu..." className="bg-white" />
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Cari</Button>
                    </form>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    <button
                        onClick={() => setCategory(undefined)}
                        className={`rounded-full px-3 py-1.5 text-sm transition ${!filters.category ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-900 ring-1 ring-emerald-100 hover:bg-emerald-50'}`}
                    >
                        Semua
                    </button>
                    {categories.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setCategory(c.slug)}
                            className={`rounded-full px-3 py-1.5 text-sm transition ${filters.category === c.slug ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-900 ring-1 ring-emerald-100 hover:bg-emerald-50'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-emerald-900/70">Urutkan:</span>
                    {[
                        { v: 'popular', l: 'Terlaris' },
                        { v: 'price_asc', l: 'Termurah' },
                        { v: 'price_desc', l: 'Termahal' },
                        { v: 'newest', l: 'Terbaru' },
                    ].map((s) => (
                        <button
                            key={s.v}
                            onClick={() => setSort(s.v)}
                            className={`rounded-full px-3 py-1 ring-1 transition ${filters.sort === s.v ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-white text-emerald-900 ring-emerald-100 hover:bg-emerald-50'}`}
                        >
                            {s.l}
                        </button>
                    ))}
                </div>

                {products.data.length === 0 ? (
                    <div className="mt-12 rounded-2xl border border-emerald-100 bg-white p-10 text-center text-sm text-emerald-900/70">
                        Menu tidak ditemukan. Coba kata kunci lain.
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((p) => (<ProductCard key={p.id} product={p} />))}
                    </div>
                )}

                {products.last_page > 1 ? (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        {products.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded-md px-3 py-1.5 text-sm ring-1 transition ${link.active ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-emerald-900 ring-emerald-100 hover:bg-emerald-50'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    );
}
