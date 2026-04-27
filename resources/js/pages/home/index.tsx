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

            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-emerald-100/60 to-sky-50" />
                <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
                    <div className="space-y-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                            <Star className="size-3.5 fill-amber-400 stroke-amber-500" />
                            {highlights.rating} • {highlights.reviews_count} ulasan Google
                        </span>
                        <h1 className="text-4xl font-semibold leading-tight text-emerald-950 md:text-5xl">
                            Makan Nyaman di Pinggir <span className="text-emerald-600">Sungai Cidurian</span>
                        </h1>
                        <p className="max-w-md text-base text-emerald-900/80">
                            Pesan menu favorit untuk dine-in, takeaway, atau delivery. Suasana adem, harga ramah, langsung dari dapur kami.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                                <Link href="/menu">Pesan Sekarang <ArrowRight className="ml-1 size-4" /></Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                                <Link href="/menu">Lihat Menu</Link>
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm text-emerald-900/80">
                            <span className="inline-flex items-center gap-1.5"><Utensils className="size-4 text-emerald-600" /> Dine-in • Takeaway • Delivery</span>
                            <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-emerald-600" /> Jasinga, Bogor</span>
                            <span className="inline-flex items-center gap-1.5"><Clock className="size-4 text-emerald-600" /> {s.store_open_hours ?? '09.00 - 22.00'}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-2 text-sm">
                            <span className="rounded-full bg-white/90 px-3 py-1 ring-1 ring-emerald-100">Mulai {formatRupiah(highlights.price_from)}</span>
                            <span className="rounded-full bg-white/90 px-3 py-1 ring-1 ring-emerald-100">Menu andalan: Gurame Asam Manis</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="overflow-hidden rounded-3xl ring-1 ring-emerald-100 bg-emerald-50 aspect-[4/3] shadow-xl shadow-emerald-900/5">
                            <img
                                src={storageUrl(gallery[0]?.image_path, 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=1200&q=70')}
                                alt={gallery[0]?.title ?? 'Cidurian Riverside'}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-4 left-6 hidden rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 text-sm shadow-md md:block">
                            <div className="font-semibold text-emerald-900">Spot favorit keluarga</div>
                            <div className="text-emerald-900/70">Lesehan pinggir sungai, area indoor, dan riverside.</div>
                        </div>
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
