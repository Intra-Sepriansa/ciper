import { Head, Link, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ClipboardPaste, Clock, Headphones, MessageCircle, Package, Search, Sparkles, UtensilsCrossed, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ShinyText from '@/components/reactbits/shiny-text';
import { Button } from '@/components/ui/button';

type RecentTrack = {
    number: string;
    timestamp: number;
};

const STORAGE_KEY = 'ciper_recent_tracking';

function loadRecent(): RecentTrack[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw) as RecentTrack[];

        return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    } catch {
        return [];
    }
}

function timeAgoID(ts: number): string {
    const diff = Math.floor((Date.now() - ts) / 1000);

    if (diff < 60) {
        return 'baru saja';
    }

    if (diff < 3600) {
        return `${Math.floor(diff / 60)} menit lalu`;
    }

    if (diff < 86400) {
        return `${Math.floor(diff / 3600)} jam lalu`;
    }

    return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function TrackingIndex({ lookup }: { lookup?: string }) {
    const { data, setData, post, processing } = useForm({ number: lookup ?? '' });
    const inputRef = useRef<HTMLInputElement>(null);
    const [recent, setRecent] = useState<RecentTrack[]>(() => loadRecent());

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmed = data.number.trim().toUpperCase();

        if (!trimmed) {
            return;
        }

        const next: RecentTrack[] = [
            { number: trimmed, timestamp: Date.now() },
            ...recent.filter((r) => r.number !== trimmed),
        ].slice(0, 5);

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecent(next);
        setData('number', trimmed);
        post('/tracking', { preserveScroll: true });
    }

    async function pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();

            if (text) {
                setData('number', text.trim().toUpperCase());
                inputRef.current?.focus();
            }
        } catch {
            // ignore
        }
    }

    function removeRecent(number: string) {
        const next = recent.filter((r) => r.number !== number);

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecent(next);
    }

    return (
        <>
            <Head title="Lacak Pesanan" />

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-16 md:py-24">
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
                    className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
                <div className="relative mx-auto max-w-3xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
                    >
                        <Sparkles className="size-3" />
                        <ShinyText text="Lacak Pesanan" speed={5} />
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                    >
                        Cek Status Pesananmu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto mt-3 max-w-xl text-sm text-emerald-100/80 md:text-base"
                    >
                        Masukkan nomor pesanan. Timeline, QR, dan invoice PDF langsung siap.
                    </motion.p>

                    {/* SEARCH */}
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mx-auto mt-8 max-w-xl"
                    >
                        <div className="flex items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-2xl shadow-black/20 backdrop-blur ring-1 ring-white/30">
                            <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
                                <Search className="size-5 shrink-0 text-emerald-700" />
                                <input
                                    ref={inputRef}
                                    value={data.number}
                                    onChange={(e) => setData('number', e.target.value.toUpperCase())}
                                    placeholder="CIVERS-XXXXXX-XXXXX"
                                    className="w-full min-w-0 bg-transparent font-mono text-sm font-semibold tracking-wider text-emerald-950 placeholder:text-emerald-900/30 focus:outline-none md:text-base"
                                    autoCapitalize="characters"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                {data.number ? (
                                    <button
                                        type="button"
                                        onClick={() => setData('number', '')}
                                        className="grid size-7 shrink-0 place-items-center rounded-full text-emerald-900/50 transition hover:bg-emerald-50 hover:text-emerald-900"
                                        aria-label="Bersihkan"
                                    >
                                        <X className="size-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={pasteFromClipboard}
                                        className="hidden shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:inline-flex"
                                    >
                                        <ClipboardPaste className="size-3.5" />
                                        Tempel
                                    </button>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={processing || !data.number.trim()}
                                className="h-11 shrink-0 rounded-xl bg-emerald-600 px-5 text-sm font-bold hover:bg-emerald-700"
                            >
                                {processing ? 'Mencari...' : 'Cari'}
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                        <div className="mt-2 text-xs text-emerald-100/60">
                            Format: <span className="font-mono text-emerald-100/90">CIVERS-YYMMDD-XXXXX</span>
                        </div>
                    </motion.form>
                </div>
            </section>

            <div className="mx-auto max-w-3xl px-4 py-10">
                {/* RECENT */}
                <AnimatePresence>
                    {recent.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-8"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900/70">Dicari belakangan</h2>
                                <Clock className="size-4 text-emerald-900/40" />
                            </div>
                            <ul className="space-y-2">
                                {recent.map((r) => (
                                    <motion.li
                                        key={r.number}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm transition hover:border-emerald-300 hover:shadow"
                                    >
                                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                                            <Package className="size-5" />
                                        </div>
                                        <Link
                                            href={`/tracking/${r.number}`}
                                            className="min-w-0 flex-1"
                                        >
                                            <div className="truncate font-mono text-sm font-bold tracking-wider text-emerald-950">
                                                {r.number}
                                            </div>
                                            <div className="text-xs text-emerald-900/60">{timeAgoID(r.timestamp)}</div>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => removeRecent(r.number)}
                                            className="grid size-8 place-items-center rounded-full text-emerald-900/40 transition hover:bg-rose-50 hover:text-rose-600"
                                            aria-label="Hapus"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* HELP CARDS */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <motion.a
                        whileHover={{ y: -3 }}
                        href="https://wa.me/6281234567890?text=Halo%20Cidurian%20Riverside%2C%20saya%20tidak%20punya%20kode%20pesanan."
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                    >
                        <div className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Headphones className="size-5" />
                        </div>
                        <h3 className="mt-3 font-bold text-emerald-950">Tidak punya kode?</h3>
                        <p className="mt-1 text-sm text-emerald-900/70">Chat admin lewat WhatsApp, kami bantu cari pesanan kamu.</p>
                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                            Chat WhatsApp
                            <MessageCircle className="size-3.5" />
                        </div>
                    </motion.a>
                    <motion.div whileHover={{ y: -3 }}>
                        <Link
                            href="/menu"
                            className="block rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="grid size-11 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                                <UtensilsCrossed className="size-5" />
                            </div>
                            <h3 className="mt-3 font-bold">Mau pesan lagi?</h3>
                            <p className="mt-1 text-sm text-emerald-100/90">Menu populer dan paket keluarga siap antar dalam sekali klik.</p>
                            <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold">
                                Lihat menu
                                <ArrowRight className="size-3.5" />
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
