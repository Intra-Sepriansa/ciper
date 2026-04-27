import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Phone, Star, Utensils } from 'lucide-react';
import ClickSpark from '@/components/reactbits/click-spark';
import CountUp from '@/components/reactbits/count-up';
import GlareHover from '@/components/reactbits/glare-hover';
import ShinyText from '@/components/reactbits/shiny-text';
import SpotlightCard from '@/components/reactbits/spotlight-card';
import TiltedCard from '@/components/reactbits/tilted-card';
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

export default function HomeIndex({ popular, familyPackages, gallery, highlights }: HomeProps) {
    const { props } = usePage<StorefrontPageProps>();
    const s = props.storefront ?? {};
    const wa = whatsappLink(s.store_whatsapp);

    const heroImage = storageUrl(gallery[0]?.image_path, '/storage/hero/riverside-cover.jpg');
    const featured = popular.slice(0, 6);

    return (
        <>
            <Head title={s.seo_meta_title ?? 'Cidurian Riverside'}>
                <meta name="description" content={s.seo_meta_description ?? ''} />
                <meta name="keywords" content={s.seo_meta_keywords ?? ''} />
            </Head>

            <ClickSpark sparkColor="#10b981" sparkCount={10} duration={520} />

            {/* HERO */}
            <section className="relative h-[calc(100vh-4rem)] min-h-[640px] w-full overflow-hidden">
                <motion.img
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                    src={heroImage}
                    alt={gallery[0]?.title ?? 'Cidurian Riverside'}
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/80" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white ring-1 ring-white/25 backdrop-blur-md"
                    >
                        <Star className="size-3.5 fill-amber-300 stroke-amber-300" />
                        {highlights.rating} • {highlights.reviews_count.toLocaleString('id-ID')} ulasan Google
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                        transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-6 max-w-5xl text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white drop-shadow-xl sm:text-5xl md:text-6xl lg:text-[5.5rem]"
                    >
                        Makan Nyaman di<br />
                        <span className="bg-gradient-to-r from-emerald-200 via-white to-sky-200 bg-clip-text text-transparent">
                            Pinggir Sungai Cidurian
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="mt-6 max-w-xl text-base text-white/85 sm:text-lg"
                    >
                        Dine-in, takeaway, atau delivery. Suasana adem, harga ramah, langsung dari dapur kami.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="mt-9 flex flex-wrap items-center justify-center gap-3"
                    >
                        <Link
                            href="/menu"
                            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold tracking-wide text-emerald-950 shadow-2xl shadow-emerald-950/40 transition hover:shadow-emerald-500/30"
                        >
                            <Utensils className="size-4 text-emerald-600" />
                            PESAN SEKARANG
                            <span className="ml-1 grid size-6 place-items-center rounded-full bg-emerald-500/15 transition group-hover:translate-x-0.5 group-hover:bg-emerald-500/25">
                                <ArrowRight className="size-3.5" />
                            </span>
                        </Link>
                        <a
                            href={wa}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                        >
                            <ShinyText text="Chat WhatsApp" speed={4} />
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.6 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/60"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span>scroll</span>
                            <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/80 to-transparent" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* STATS */}
            <section className="relative z-20 -mt-10 px-4">
                <div className="mx-auto max-w-6xl rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur-sm md:p-8">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {[
                            { label: 'Rating Google', value: highlights.rating, suffix: '', decimals: 1 },
                            { label: 'Ulasan pelanggan', value: highlights.reviews_count, suffix: '+', decimals: 0 },
                            { label: 'Varian menu', value: 40, suffix: '+', decimals: 0 },
                            { label: 'Harga mulai', value: highlights.price_from, prefix: 'Rp ', decimals: 0, separator: '.' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="text-3xl font-bold tracking-tight text-emerald-950 md:text-4xl">
                                    {stat.prefix ?? ''}
                                    <CountUp to={stat.value} decimals={stat.decimals ?? 0} separator={stat.separator ?? ''} duration={1.8} />
                                    {stat.suffix ?? ''}
                                </div>
                                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-emerald-900/60">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MENU POPULER */}
            <section className="mx-auto max-w-6xl px-4 py-20">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">Paling Dicari</span>
                        <h2 className="mt-2 text-3xl font-bold text-emerald-950 md:text-4xl">Menu Populer</h2>
                    </div>
                    <Link href="/menu" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                        Lihat semua
                        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: i * 0.06, duration: 0.55 }}
                        >
                            <TiltedCard rotateAmplitude={8} scaleOnHover={1.03}>
                                <Link
                                    href={`/menu/${p.slug}`}
                                    className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-emerald-100 shadow-sm transition hover:shadow-2xl hover:shadow-emerald-900/10"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
                                        <img
                                            src={storageUrl(p.image_path)}
                                            alt={p.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                                        {p.is_popular ? (
                                            <span className="absolute left-4 top-4 rounded-full bg-amber-400/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow">
                                                Populer
                                            </span>
                                        ) : null}
                                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                                            <div>
                                                <div className="text-lg font-bold leading-tight text-white drop-shadow">{p.name}</div>
                                                <div className="mt-0.5 text-sm font-semibold text-white/90">
                                                    {formatRupiah(p.discount_price ?? p.price)}
                                                </div>
                                            </div>
                                            <span className="grid size-10 place-items-center rounded-full bg-white text-emerald-700 shadow-lg transition group-hover:-translate-y-0.5 group-hover:bg-emerald-600 group-hover:text-white">
                                                <ArrowRight className="size-4" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-5 py-4 text-sm text-emerald-900/75 line-clamp-2">{p.short_description}</div>
                                </Link>
                            </TiltedCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* PAKET KELUARGA */}
            {familyPackages.length > 0 ? (
                <section className="px-4 pb-20">
                    <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 p-6 md:p-12">
                        <div className="flex items-end justify-between gap-6">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">Hemat untuk ramai-ramai</span>
                                <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Paket Keluarga</h2>
                                <p className="mt-2 max-w-md text-sm text-emerald-50/80">Solusi paling ekonomis untuk acara keluarga, ulang tahun kecil, atau makan bareng.</p>
                            </div>
                            <Link href="/menu?category=paket-keluarga" className="hidden items-center gap-1.5 text-sm font-semibold text-emerald-100 hover:text-white md:inline-flex">
                                Semua paket <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {familyPackages.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ delay: i * 0.08, duration: 0.55 }}
                                >
                                    <SpotlightCard
                                        spotlightColor="rgba(255, 255, 255, 0.15)"
                                        className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                                    >
                                        <Link href={`/menu/${p.slug}`} className="group flex items-center gap-4">
                                            <img
                                                src={storageUrl(p.image_path)}
                                                alt={p.name}
                                                className="size-24 rounded-xl object-cover ring-1 ring-white/20"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="font-bold text-white">{p.name}</div>
                                                <div className="mt-0.5 line-clamp-2 text-sm text-emerald-50/75">{p.short_description}</div>
                                                <div className="mt-2 text-base font-bold text-amber-300">{formatRupiah(p.discount_price ?? p.price)}</div>
                                            </div>
                                            <ArrowRight className="size-5 text-white/70 transition group-hover:translate-x-1 group-hover:text-white" />
                                        </Link>
                                    </SpotlightCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {/* SUASANA */}
            {gallery.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 pb-20">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">Tempat</span>
                            <h2 className="mt-2 text-3xl font-bold text-emerald-950 md:text-4xl">Suasana Riverside</h2>
                        </div>
                        <Link href="/gallery" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                            Galeri lengkap <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
                        {gallery.slice(0, 6).map((g, i) => {
                            const spanClass = i === 0 ? 'md:col-span-2 md:row-span-2' : i === 3 ? 'md:col-span-2' : '';

                            return (
                                <motion.div
                                    key={g.id}
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ delay: i * 0.06, duration: 0.5 }}
                                    className={`aspect-[4/3] ${spanClass}`}
                                >
                                    <GlareHover className="h-full w-full overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                                        <img
                                            src={storageUrl(g.image_path)}
                                            alt={g.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-700 hover:scale-105"
                                        />
                                    </GlareHover>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            ) : null}

            {/* LOKASI */}
            <section className="mx-auto max-w-6xl px-4 pb-24">
                <div className="grid gap-0 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm md:grid-cols-2">
                    <div className="space-y-4 p-6 md:p-10">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">Kunjungi Kami</span>
                        <h2 className="text-3xl font-bold text-emerald-950 md:text-4xl">Lokasi &amp; Jam Buka</h2>
                        <ul className="space-y-3 pt-2 text-sm text-emerald-900/80">
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><MapPin className="size-4" /></span>
                                {s.store_address}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Clock className="size-4" /></span>
                                {s.store_open_hours}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Phone className="size-4" /></span>
                                {s.store_phone}
                            </li>
                        </ul>
                        <div className="flex flex-wrap gap-2 pt-4">
                            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                                <a href={wa} target="_blank" rel="noreferrer">Hubungi Admin</a>
                            </Button>
                            <Button asChild variant="outline" className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                                <Link href="/reservation">Reservasi Meja</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="aspect-[4/3] bg-emerald-50 md:aspect-auto">
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
