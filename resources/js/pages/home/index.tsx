import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Clock, MapPin, Phone, Star, Utensils } from 'lucide-react';
import ProductCard from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { formatRupiah, storageUrl, whatsappLink } from '@/lib/format';
import type { Category, Product, StorefrontPageProps } from '@/types/storefront';

type HomeProps = {
    popular: Product[];
    familyPackages: Product[];
    categories: Category[];
    gallery: Array<{ id: number; title: string; image_path: string; caption?: string | null; category?: string | null }>;
    testimonials: Array<{ id: number; reviewer_name?: string | null; rating: number; comment?: string | null }>;
    highlights: { rating: number; reviews_count: number; price_from: number };
};

export default function HomeIndex({ popular, familyPackages, categories, gallery, testimonials, highlights }: HomeProps) {
    const { props } = usePage<StorefrontPageProps>();
    const s = props.storefront ?? {};
    const wa = whatsappLink(s.store_whatsapp);

    return (
        <>
            <Head title={s.seo_meta_title ?? 'Cidurian Riverside'}>
                <meta name="description" content={s.seo_meta_description ?? ''} />
                <meta name="keywords" content={s.seo_meta_keywords ?? ''} />
            </Head>

            <section className="relative h-[calc(100vh-4rem)] min-h-[560px] w-full overflow-hidden">
                <img
                    src={storageUrl(gallery[0]?.image_path, '/storage/hero/riverside-cover.jpg')}
                    alt={gallery[0]?.title ?? 'Cidurian Riverside'}
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/30 backdrop-blur">
                        <Star className="size-3.5 fill-amber-300 stroke-amber-300" />
                        {highlights.rating} • {highlights.reviews_count} ulasan Google
                    </span>

                    <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
                        Makan Nyaman di Pinggir Sungai Cidurian
                    </h1>

                    <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
                        Pesan menu favorit untuk dine-in, takeaway, atau delivery. Suasana adem, harga ramah, langsung dari dapur kami.
                    </p>

                    <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/95 p-1.5 pl-6 shadow-2xl shadow-emerald-950/30">
                        <span className="grid size-9 place-items-center rounded-full bg-emerald-500/15">
                            <Utensils className="size-4 text-emerald-700" />
                        </span>
                        <Link
                            href="/menu"
                            className="text-sm font-semibold tracking-wide text-emerald-950 sm:text-base"
                        >
                            LIHAT MENU
                        </Link>
                        <Link
                            href="/menu"
                            aria-label="Pesan sekarang"
                            className="grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-900 transition hover:bg-emerald-100"
                        >
                            <ArrowRight className="size-5" />
                        </Link>
                    </div>

                    <div className="mt-10 hidden flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/80 md:flex">
                        <span className="inline-flex items-center gap-1.5"><Utensils className="size-4" /> Dine-in • Takeaway • Delivery</span>
                        <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> Jasinga, Bogor</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="size-4" /> {s.store_open_hours ?? '09.00 - 22.00'}</span>
                        <span className="inline-flex items-center gap-1.5"><Phone className="size-4" /> Mulai {formatRupiah(highlights.price_from)}</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-10">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-emerald-950">Menu Populer</h2>
                        <p className="text-sm text-emerald-900/70">Pesanan paling sering dipilih pelanggan kami.</p>
                    </div>
                    <Link href="/menu" className="text-sm font-medium text-emerald-700 hover:underline">Lihat semua</Link>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {popular.map((p) => (<ProductCard key={p.id} product={p} />))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-10">
                <h2 className="text-2xl font-semibold text-emerald-950">Kategori Menu</h2>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                    {categories.map((c) => (
                        <Link
                            key={c.id}
                            href={`/menu?category=${c.slug}`}
                            className="rounded-2xl border border-emerald-100 bg-white p-4 text-center text-sm font-medium text-emerald-900 transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            </section>

            {familyPackages.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white md:p-10">
                        <h2 className="text-2xl font-semibold md:text-3xl">Paket Keluarga</h2>
                        <p className="mt-1 max-w-md text-sm text-emerald-50/90">Hemat untuk acara keluarga, ulang tahun kecil, atau makan ramai-ramai.</p>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {familyPackages.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/menu/${p.slug}`}
                                    className="group flex items-center gap-4 rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 transition hover:bg-white/15"
                                >
                                    <img src={storageUrl(p.image_path)} alt={p.name} className="size-20 rounded-xl object-cover" />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-semibold">{p.name}</div>
                                        <div className="text-sm text-emerald-50/90 line-clamp-2">{p.short_description}</div>
                                        <div className="mt-1 text-sm font-semibold">{formatRupiah(p.discount_price ?? p.price)}</div>
                                    </div>
                                    <ArrowRight className="size-5 opacity-70 group-hover:translate-x-0.5 transition" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {gallery.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="text-2xl font-semibold text-emerald-950">Suasana Tempat</h2>
                        <Link href="/gallery" className="text-sm font-medium text-emerald-700 hover:underline">Galeri lengkap</Link>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                        {gallery.map((g) => (
                            <div key={g.id} className="aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-emerald-100 bg-emerald-50">
                                <img src={storageUrl(g.image_path)} alt={g.title} className="h-full w-full object-cover" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {testimonials.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <h2 className="text-2xl font-semibold text-emerald-950">Kata Pelanggan</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        {testimonials.map((t) => (
                            <div key={t.id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-1 text-amber-500">
                                    {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                                        <Star key={i} className="size-4 fill-amber-400 stroke-amber-500" />
                                    ))}
                                </div>
                                <p className="mt-2 text-sm text-emerald-900/80 line-clamp-4">{t.comment}</p>
                                <div className="mt-3 text-sm font-medium text-emerald-900">{t.reviewer_name ?? 'Pelanggan'}</div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            <section className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-6 rounded-3xl border border-emerald-100 bg-white p-6 md:grid-cols-2 md:p-10">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-semibold text-emerald-950">Lokasi & Jam Buka</h2>
                        <p className="flex items-start gap-2 text-sm text-emerald-900/80"><MapPin className="mt-0.5 size-4 text-emerald-600" /> {s.store_address}</p>
                        <p className="flex items-start gap-2 text-sm text-emerald-900/80"><Clock className="mt-0.5 size-4 text-emerald-600" /> {s.store_open_hours}</p>
                        <p className="flex items-start gap-2 text-sm text-emerald-900/80"><Phone className="mt-0.5 size-4 text-emerald-600" /> {s.store_phone}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                                <a href={wa} target="_blank" rel="noreferrer">Hubungi Admin</a>
                            </Button>
                            <Button asChild variant="outline" className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                                <Link href="/reservation">Reservasi Meja</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-emerald-100 bg-emerald-50">
                        <iframe
                            title="Lokasi Cidurian Riverside"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(s.store_address ?? 'Jasinga Bogor')}&output=embed`}
                            className="h-full w-full border-0"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
