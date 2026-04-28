import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Plus, Search, SlidersHorizontal, Sparkles, Tag, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AnimatedList from '@/components/reactbits/animated-list';
import CountUp from '@/components/reactbits/count-up';
import GlareHover from '@/components/reactbits/glare-hover';
import Magnet from '@/components/reactbits/magnet';
import ShinyText from '@/components/reactbits/shiny-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah, storageUrl } from '@/lib/format';
import type { Category, Product } from '@/types/storefront';

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Filters = {
    q?: string;
    category?: string;
    sort?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    promo?: boolean;
    popular?: boolean;
};

type Props = {
    products: Paginated<Product>;
    categories: Category[];
    filters: Filters;
    totalCount: number;
    priceRange: { min: number; max: number };
};

const SORT_OPTIONS = [
    { v: 'popular', l: 'Terlaris' },
    { v: 'price_asc', l: 'Harga ↑' },
    { v: 'price_desc', l: 'Harga ↓' },
    { v: 'newest', l: 'Terbaru' },
];

export default function MenuIndex({ products, categories, filters, totalCount, priceRange }: Props) {
    const [search, setSearch] = useState(filters.q ?? '');
    const [showFilters, setShowFilters] = useState(false);
    const [priceMax, setPriceMax] = useState(filters.max_price ?? priceRange.max);
    const debounceRef = useRef<number | null>(null);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;

            return;
        }

        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(() => {
            router.get(
                '/menu',
                { ...filters, q: search || undefined },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 420);

        return () => {
            if (debounceRef.current) {
                window.clearTimeout(debounceRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    function apply(next: Partial<Filters>) {
        router.get(
            '/menu',
            { ...filters, ...next },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    function toggle(key: 'in_stock' | 'promo' | 'popular') {
        apply({ [key]: filters[key] ? undefined : true });
    }

    function clearAll() {
        setSearch('');
        setPriceMax(priceRange.max);
        router.get('/menu', {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    const activeFiltersCount = useMemo(() => {
        let count = 0;

        if (filters.category) {
            count++;
        }

        if (filters.q) {
            count++;
        }

        if (filters.in_stock) {
            count++;
        }

        if (filters.promo) {
            count++;
        }

        if (filters.popular) {
            count++;
        }

        if (filters.max_price && filters.max_price < priceRange.max) {
            count++;
        }

        return count;
    }, [filters, priceRange.max]);

    return (
        <>
            <Head title="Menu" />

            {/* HEADER BANNER */}
            <section className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-12 md:py-16">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 40%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 50% 80%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative mx-auto max-w-6xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
                    >
                        <Sparkles className="size-3" />
                        <ShinyText text="Menu Terlengkap" speed={5} />
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                    >
                        Pilih Menu Favoritmu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="mt-3 text-sm text-emerald-100/80 md:text-base"
                    >
                        <CountUp to={totalCount} duration={1.4} /> menu siap antar. Pesan sekali klik.
                    </motion.p>

                    {/* Search bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-2xl shadow-emerald-950/40"
                    >
                        <Search className="size-4 text-emerald-700" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari gurame, ayam, pizza..."
                            className="h-10 flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
                        />
                        {search ? (
                            <button
                                onClick={() => setSearch('')}
                                aria-label="Hapus"
                                className="grid size-8 place-items-center rounded-full text-emerald-900/60 hover:bg-emerald-50"
                            >
                                <X className="size-4" />
                            </button>
                        ) : null}
                    </motion.div>
                </div>
            </section>

            <div className="mx-auto max-w-6xl px-4 py-8">
                {/* CATEGORY CHIPS */}
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <Chip active={!filters.category} onClick={() => apply({ category: undefined })}>
                        Semua
                    </Chip>
                    {categories.map((c) => (
                        <Chip key={c.id} active={filters.category === c.slug} onClick={() => apply({ category: c.slug })}>
                            {c.name}
                        </Chip>
                    ))}
                </div>

                {/* FILTER + SORT TOOLBAR */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Toggle active={!!filters.popular} onClick={() => toggle('popular')} icon={<Flame className="size-3.5" />}>
                        Populer
                    </Toggle>
                    <Toggle active={!!filters.promo} onClick={() => toggle('promo')} icon={<Tag className="size-3.5" />}>
                        Promo
                    </Toggle>
                    <Toggle active={!!filters.in_stock} onClick={() => toggle('in_stock')}>
                        Ready stock
                    </Toggle>
                    <button
                        onClick={() => setShowFilters((v) => !v)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
                    >
                        <SlidersHorizontal className="size-3.5" />
                        Harga
                        {filters.max_price && filters.max_price < priceRange.max ? (
                            <span className="ml-0.5 rounded-full bg-emerald-600 px-1.5 text-[10px] text-white">1</span>
                        ) : null}
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                        <span className="hidden text-xs text-emerald-900/60 sm:inline">Urutkan:</span>
                        <div className="flex gap-1 rounded-full bg-emerald-50 p-1 ring-1 ring-emerald-100">
                            {SORT_OPTIONS.map((s) => {
                                const active = (filters.sort ?? 'popular') === s.v;

                                return (
                                    <button
                                        key={s.v}
                                        onClick={() => apply({ sort: s.v === 'popular' ? undefined : s.v })}
                                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${active ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-900/60 hover:text-emerald-900'}`}
                                    >
                                        {s.l}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* PRICE FILTER DRAWER */}
                <AnimatePresence>
                    {showFilters ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-4 overflow-hidden"
                        >
                            <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-900/60">Batas harga</div>
                                        <div className="mt-0.5 text-sm font-semibold text-emerald-900">
                                            {formatRupiah(priceRange.min)} &ndash; {formatRupiah(priceMax)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setPriceMax(priceRange.max);
                                            apply({ max_price: undefined });
                                        }}
                                        className="text-xs font-semibold text-emerald-700 hover:underline"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    step={5000}
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(Number(e.target.value))}
                                    onMouseUp={() => apply({ max_price: priceMax })}
                                    onTouchEnd={() => apply({ max_price: priceMax })}
                                    className="mt-4 w-full accent-emerald-600"
                                />
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* RESULT COUNT + CLEAR */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-emerald-900/70">
                        <span className="font-semibold text-emerald-900">
                            <CountUp key={totalCount} to={totalCount} duration={0.8} />
                        </span>{' '}
                        menu ditemukan
                    </div>
                    {activeFiltersCount > 0 ? (
                        <button onClick={clearAll} className="text-xs font-semibold text-emerald-700 hover:underline">
                            Hapus filter ({activeFiltersCount})
                        </button>
                    ) : null}
                </div>

                {/* PRODUCT GRID */}
                {products.data.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-white p-12 text-center"
                    >
                        <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                            <Search className="size-6" />
                        </div>
                        <div className="mt-4 text-lg font-semibold text-emerald-950">Menu tidak ditemukan</div>
                        <p className="mt-1 text-sm text-emerald-900/70">Coba kata kunci lain atau hapus filter.</p>
                        {activeFiltersCount > 0 ? (
                            <Button onClick={clearAll} className="mt-5 bg-emerald-600 hover:bg-emerald-700">
                                Hapus semua filter
                            </Button>
                        ) : null}
                    </motion.div>
                ) : (
                    <AnimatedList
                        key={`${filters.category ?? 'all'}-${filters.sort ?? 'pop'}-${filters.q ?? ''}-${products.current_page}`}
                        className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        stagger={0.04}
                    >
                        {products.data.map((p) => (
                            <MenuCard key={p.id} product={p} />
                        ))}
                    </AnimatedList>
                )}

                {/* PAGINATION */}
                {products.last_page > 1 ? (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
                        {products.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url ?? '#'}
                                preserveScroll
                                preserveState
                                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 transition ${
                                    link.active
                                        ? 'bg-emerald-600 text-white ring-emerald-600 shadow'
                                        : 'bg-white text-emerald-900 ring-emerald-100 hover:bg-emerald-50'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                    ? 'bg-emerald-600 text-white shadow shadow-emerald-600/30'
                    : 'bg-white text-emerald-900 ring-1 ring-emerald-100 hover:bg-emerald-50'
            }`}
        >
            {children}
        </button>
    );
}

function Toggle({
    children,
    active,
    onClick,
    icon,
}: {
    children: React.ReactNode;
    active?: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                    ? 'bg-emerald-600 text-white shadow shadow-emerald-600/30'
                    : 'border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
        >
            {icon}
            {children}
        </button>
    );
}

function MenuCard({ product }: { product: Product }) {
    const [adding, setAdding] = useState(false);
    const final = product.discount_price && product.discount_price < product.price ? product.discount_price : product.price;
    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const discountPct = hasDiscount ? Math.round(((product.price - (product.discount_price ?? 0)) / product.price) * 100) : 0;

    function addToCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        router.post(
            '/cart',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onFinish: () => setAdding(false),
            },
        );
    }

    return (
        <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', damping: 18, stiffness: 180 }}>
            <Link
                href={`/menu/${product.slug}`}
                className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-emerald-100 shadow-sm transition hover:shadow-xl hover:shadow-emerald-900/10"
            >
                <GlareHover className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
                    <img
                        src={storageUrl(product.image_path)}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                        <div className="flex flex-col gap-1.5">
                            {product.is_popular ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow">
                                    <Flame className="size-3" />
                                    Populer
                                </span>
                            ) : null}
                            {product.is_recommended ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                                    Rekomendasi
                                </span>
                            ) : null}
                        </div>
                        {hasDiscount ? (
                            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
                                -{discountPct}%
                            </span>
                        ) : null}
                    </div>
                </GlareHover>

                <div className="flex flex-col gap-2 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                        {product.category?.name ?? 'Menu'}
                    </div>
                    <div className="line-clamp-1 text-base font-bold text-emerald-950">{product.name}</div>
                    <p className="line-clamp-2 min-h-[2.5rem] text-xs text-emerald-900/70">{product.short_description ?? ''}</p>

                    <div className="mt-1 flex items-end justify-between gap-2">
                        <div>
                            <div className="text-base font-bold text-emerald-700">{formatRupiah(final)}</div>
                            {hasDiscount ? (
                                <div className="text-xs text-emerald-900/50 line-through">{formatRupiah(product.price)}</div>
                            ) : null}
                        </div>
                        <Magnet padding={30} strength={0.4}>
                            <button
                                onClick={addToCart}
                                disabled={adding}
                                aria-label={`Tambah ${product.name} ke keranjang`}
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-60"
                            >
                                <Plus className="size-3.5" />
                                Tambah
                            </button>
                        </Magnet>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
