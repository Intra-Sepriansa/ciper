import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, ImageIcon, Maximize2, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AnimatedList from '@/components/reactbits/animated-list';
import CountUp from '@/components/reactbits/count-up';
import DomeGallery from '@/components/reactbits/dome-gallery';
import GlareHover from '@/components/reactbits/glare-hover';
import ShinyText from '@/components/reactbits/shiny-text';
import { Button } from '@/components/ui/button';
import { storageUrl } from '@/lib/format';

type Item = {
    id: number;
    title: string;
    image_path: string;
    caption?: string | null;
    category?: string | null;
};

type Props = { items: Item[] };

const CATEGORY_LABELS: Record<string, string> = {
    suasana: 'Suasana',
    menu: 'Menu',
    acara: 'Acara',
    riverside: 'Riverside',
    lesehan: 'Lesehan',
    indoor: 'Indoor',
};

export default function GalleryPage({ items }: Props) {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    const categories = useMemo(() => {
        const counts: Record<string, number> = {};

        items.forEach((it) => {
            const key = it.category ?? 'lainnya';

            counts[key] = (counts[key] ?? 0) + 1;
        });

        return [
            { key: 'all', label: 'Semua', count: items.length },
            ...Object.entries(counts).map(([key, count]) => ({
                key,
                label: CATEGORY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1),
                count,
            })),
        ];
    }, [items]);

    const filteredItems = useMemo(() => {
        if (activeCategory === 'all') {
            return items;
        }

        return items.filter((it) => (it.category ?? 'lainnya') === activeCategory);
    }, [items, activeCategory]);

    const domeImages = useMemo(
        () =>
            items.map((it) => ({
                src: storageUrl(it.image_path),
                alt: it.title,
            })),
        [items],
    );

    const openItem = filteredItems[openIdx ?? -1];

    useEffect(() => {
        if (openIdx === null) {
            return;
        }

        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setOpenIdx(null);
            }

            if (e.key === 'ArrowLeft') {
                setOpenIdx((prev) => (prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length));
            }

            if (e.key === 'ArrowRight') {
                setOpenIdx((prev) => (prev === null ? null : (prev + 1) % filteredItems.length));
            }
        }

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [openIdx, filteredItems.length]);

    const handleCategoryChange = (key: string) => {
        setActiveCategory(key);
        setOpenIdx(null);
    };

    return (
        <>
            <Head title="Galeri" />

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-16 md:py-20">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 70%, #fff 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
                    transition={{ duration: 7, repeat: Infinity }}
                />
                <div className="relative mx-auto max-w-5xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
                    >
                        <Sparkles className="size-3" />
                        <ShinyText text="Galeri Foto" speed={5} />
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                    >
                        Jelajahi Suasana Cidurian
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto mt-3 max-w-2xl text-sm text-emerald-100/80 md:text-base"
                    >
                        Kumpulan foto pilihan dari riverside, saung lesehan, ruangan indoor, sajian menu, dan acara spesial.
                    </motion.p>

                    {/* Stats */}
                    <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-6 md:gap-10">
                        <Stat value={items.length} label="Foto Pilihan" />
                        <Divider />
                        <Stat value={categories.length - 1} label="Kategori" />
                        <Divider />
                        <Stat value={4.3} label="Rating" fixed={1} suffix="/5" />
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-6xl px-4 py-10">
                {/* Category chips */}
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    {categories.map((c) => {
                        const active = activeCategory === c.key;

                        return (
                            <button
                                key={c.key}
                                type="button"
                                onClick={() => handleCategoryChange(c.key)}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                                    active
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-white text-emerald-900/80 ring-1 ring-emerald-100 hover:bg-emerald-50'
                                }`}
                            >
                                {c.label}
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                        active ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                                    }`}
                                >
                                    {c.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Masonry grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        {filteredItems.length === 0 ? (
                            <EmptyState onClear={() => setActiveCategory('all')} />
                        ) : (
                            <AnimatedList className="columns-1 gap-4 sm:columns-2 lg:columns-3" stagger={0.05}>
                                {filteredItems.map((it, idx) => (
                                    <GalleryCard
                                        key={it.id}
                                        item={it}
                                        index={idx}
                                        onOpen={() => setOpenIdx(idx)}
                                    />
                                ))}
                            </AnimatedList>
                        )}
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* DOME GALLERY SECTION (paling bawah) */}
            <section className="relative overflow-hidden bg-[#0a0d0b] py-16 md:py-24">
                <div className="mx-auto max-w-5xl px-4 text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur"
                    >
                        <Sparkles className="size-3" />
                        <ShinyText text="3D interactive" speed={6} />
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
                    >
                        Jelajah Foto dalam 3D
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto mt-3 max-w-xl text-sm text-white/60 md:text-base"
                    >
                        Drag untuk memutar ruang, klik foto untuk memperbesar. Semua momen Cidurian dalam satu dome.
                    </motion.p>
                </div>

                <div className="relative mx-auto mt-10 h-[640px] w-full max-w-7xl">
                    <DomeGallery
                        images={domeImages}
                        grayscale={false}
                        fit={0.48}
                        minRadius={500}
                        dragSensitivity={16}
                        maxVerticalRotationDeg={6}
                        imageBorderRadius="18px"
                        openedImageBorderRadius="22px"
                        overlayBlurColor="#0a0d0b"
                    />
                </div>

                <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 px-4 text-xs text-white/50">
                    <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Klik &amp; drag untuk putar · Klik foto untuk perbesar · ESC untuk tutup
                </div>

                <div className="mx-auto mt-8 max-w-3xl px-4 text-center">
                    <Button asChild className="h-12 rounded-full bg-emerald-600 px-8 font-bold hover:bg-emerald-700">
                        <Link href="/reservation">
                            Reservasi Tempat Favoritmu
                            <ChevronRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* LIGHTBOX */}
            <AnimatePresence>
                {openItem ? (
                    <Lightbox
                        item={openItem}
                        index={openIdx ?? 0}
                        total={filteredItems.length}
                        onClose={() => setOpenIdx(null)}
                        onPrev={() => setOpenIdx(((openIdx ?? 0) - 1 + filteredItems.length) % filteredItems.length)}
                        onNext={() => setOpenIdx(((openIdx ?? 0) + 1) % filteredItems.length)}
                    />
                ) : null}
            </AnimatePresence>
        </>
    );
}

function Stat({ value, label, suffix, fixed }: { value: number; label: string; suffix?: string; fixed?: number }) {
    return (
        <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
                <div className="text-3xl font-bold text-white md:text-4xl">
                    <CountUp to={value} duration={1.4} decimals={fixed ?? 0} />
                </div>
                {suffix ? <span className="text-sm font-semibold text-emerald-200/70">{suffix}</span> : null}
            </div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-200/70">{label}</div>
        </div>
    );
}

function Divider() {
    return <span className="hidden h-8 w-px bg-white/20 md:inline-block" />;
}

function GalleryCard({ item, index, onOpen }: { item: Item; index: number; onOpen: () => void }) {
    // Alternate heights for masonry feel
    const heights = ['h-[240px]', 'h-[340px]', 'h-[280px]', 'h-[380px]', 'h-[260px]'];
    const heightClass = heights[index % heights.length];

    return (
        <motion.button
            type="button"
            onClick={onOpen}
            whileHover={{ y: -3 }}
            className={`group mb-4 block w-full overflow-hidden rounded-3xl bg-emerald-50 text-left shadow-sm ring-1 ring-emerald-100 transition ${heightClass}`}
            style={{ breakInside: 'avoid' }}
        >
            <GlareHover className="h-full w-full">
                <div className="relative h-full w-full overflow-hidden">
                    <img
                        src={storageUrl(item.image_path)}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition group-hover:opacity-100" />
                    {item.category ? (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            {CATEGORY_LABELS[item.category] ?? item.category}
                        </span>
                    ) : null}
                    <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                        <Maximize2 className="size-4" />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <div className="font-bold leading-tight">{item.title}</div>
                        {item.caption ? (
                            <div className="mt-0.5 line-clamp-2 text-xs text-white/80">{item.caption}</div>
                        ) : null}
                    </div>
                </div>
            </GlareHover>
        </motion.button>
    );
}

function EmptyState({ onClear }: { onClear: () => void }) {
    return (
        <div className="rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-12 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <ImageIcon className="size-7" />
            </div>
            <h3 className="mt-4 font-bold text-emerald-950">Foto tidak ditemukan</h3>
            <p className="mt-1 text-sm text-emerald-900/70">Coba ganti kategori atau tampilkan semua foto.</p>
            <Button type="button" onClick={onClear} className="mt-5 rounded-full bg-emerald-600 hover:bg-emerald-700">
                Tampilkan semua
            </Button>
        </div>
    );
}

function Lightbox({
    item,
    index,
    total,
    onClose,
    onPrev,
    onNext,
}: {
    item: Item;
    index: number;
    total: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-4 py-8 backdrop-blur"
            onClick={onClose}
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Tutup"
            >
                <X className="size-5" />
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Foto sebelumnya"
            >
                <ChevronLeft className="size-6" />
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Foto selanjutnya"
            >
                <ChevronRight className="size-6" />
            </button>

            <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={storageUrl(item.image_path)}
                    alt={item.title}
                    className="mx-auto max-h-[70vh] w-full object-contain"
                />
                <div className="flex flex-col gap-2 bg-gradient-to-t from-black/80 to-transparent px-6 py-4 text-white">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            {item.category ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                                    {CATEGORY_LABELS[item.category] ?? item.category}
                                </span>
                            ) : null}
                            <h3 className="mt-1 truncate text-lg font-bold">{item.title}</h3>
                            {item.caption ? <p className="mt-0.5 text-sm text-white/70">{item.caption}</p> : null}
                        </div>
                        <a
                            href={storageUrl(item.image_path)}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur transition hover:bg-white/25"
                        >
                            <Download className="size-3.5" />
                            Unduh
                        </a>
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                        Foto {index + 1} dari {total} · ← → untuk pindah · ESC tutup
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
