import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle2,
    ChevronDown,
    Clock,
    Copy,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Music2,
    Navigation,
    Phone,
    Send,
    Sparkles,
    Star,
    Users,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import AnimatedList from '@/components/reactbits/animated-list';
import CountUp from '@/components/reactbits/count-up';
import GlareHover from '@/components/reactbits/glare-hover';
import Magnet from '@/components/reactbits/magnet';
import ShinyText from '@/components/reactbits/shiny-text';
import SpotlightCard from '@/components/reactbits/spotlight-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { whatsappLink } from '@/lib/format';
import type { StorefrontPageProps } from '@/types/storefront';

type Topic = {
    key: string;
    label: string;
    icon: typeof MessageCircle;
};

const TOPICS: Topic[] = [
    { key: 'pertanyaan', label: 'Pertanyaan Umum', icon: MessageCircle },
    { key: 'reservasi', label: 'Reservasi & Booking', icon: Users },
    { key: 'keluhan', label: 'Keluhan / Saran', icon: Star },
    { key: 'kerjasama', label: 'Kerja Sama / Event', icon: Sparkles },
];

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
    {
        q: 'Apakah bisa bayar tunai di tempat?',
        a: 'Bisa. Untuk dine-in, Bayar di Kasir tersedia. Untuk takeaway/delivery, transfer manual dan pembayaran online lebih disarankan supaya pesanan langsung diproses.',
    },
    {
        q: 'Bisa booking meja di akhir pekan?',
        a: 'Bisa. Reservasi terbuka untuk semua hari termasuk Sabtu & Minggu. Disarankan reservasi minimal H-1 untuk weekend karena cukup ramai. Buka /reservation untuk pilih tanggal & area.',
    },
    {
        q: 'Apakah ada area lesehan / outdoor pinggir sungai?',
        a: 'Ya. Tersedia 3 area: Riverside (lesehan pinggir sungai), Lesehan Tradisional (saung kayu), dan Indoor ber-AC. Pilih saat reservasi sesuai preferensi.',
    },
    {
        q: 'Apakah halal & ramah keluarga?',
        a: 'Semua menu kami halal. Tempat sangat ramah keluarga — tersedia high chair, area bermain anak kecil, dan musholla bersih di lokasi.',
    },
    {
        q: 'Apa saja jangkauan area delivery?',
        a: 'Untuk delivery dalam Kecamatan Jasinga ditangani driver sendiri dengan tarif lokal flat. Di luar Jasinga (Bogor / Tangerang) bisa dipesan via ojol dengan ambil sendiri.',
    },
    {
        q: 'Apakah tersedia parkir?',
        a: 'Tersedia parkir luas untuk motor dan mobil. Pada hari padat (libur nasional), kami sediakan parkir tambahan di seberang lokasi.',
    },
    {
        q: 'Bisa untuk acara keluarga / arisan / gathering kantor?',
        a: 'Sangat bisa. Kami sering menerima rombongan 20-100 orang. Untuk grup di atas 20 orang, hubungi WhatsApp untuk paket spesial dan booking eksklusif area.',
    },
    {
        q: 'Bagaimana saya tahu pesanan saya sudah diproses?',
        a: 'Setiap pesanan punya nomor invoice (CIVERS-...) yang bisa dilacak real-time di /tracking. Status update otomatis tiap 30 detik tanpa perlu refresh.',
    },
];

export default function ContactPage() {
    const { props } = usePage<StorefrontPageProps>();
    const s = props.storefront ?? {};
    const wa = whatsappLink(s.store_whatsapp);
    const phone = (s.store_phone ?? '').replace(/[^0-9]/g, '');
    const email = s.store_email ?? 'halo@cidurianriverside.id';
    const address = s.store_address ?? 'Jl. Letnan Sayuti, Pamagersari, Jasinga, Kabupaten Bogor, Jawa Barat 16670';
    const hours = s.store_open_hours ?? 'Senin - Minggu, 09.00 - 22.00 WIB';
    const mapsHref = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        topic: 'pertanyaan',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const activeTopic = useMemo(() => TOPICS.find((t) => t.key === form.topic) ?? TOPICS[0], [form.topic]);

    const handleCopy = async (label: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(label);
            setTimeout(() => setCopied(null), 1500);
        } catch {
            // ignore clipboard failures
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const topicLabel = activeTopic.label;
        const lines = [
            `Halo Cidurian Riverside, saya ingin menghubungi terkait *${topicLabel}*.`,
            '',
            `Nama: ${form.name || '-'}`,
            `Email: ${form.email || '-'}`,
            `WhatsApp: ${form.phone || '-'}`,
            '',
            'Pesan:',
            form.message || '-',
        ];
        const url = whatsappLink(s.store_whatsapp, lines.join('\n'));
        setSubmitted(true);
        // give the success animation a beat before opening WA
        setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 350);
    };

    const resetForm = () => {
        setForm({ name: '', phone: '', email: '', topic: 'pertanyaan', message: '' });
        setSubmitted(false);
    };

    return (
        <>
            <Head title="Kontak & Lokasi" />

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-16 md:py-20">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
                    transition={{ duration: 7, repeat: Infinity }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />

                <div className="relative mx-auto max-w-5xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
                    >
                        <MessageCircle className="size-3" />
                        <ShinyText text="Hubungi Kami" speed={5} />
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                    >
                        Mau Tanya, Reservasi, atau Sekadar Sapa?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto mt-3 max-w-2xl text-sm text-emerald-100/80 md:text-base"
                    >
                        Kami balas secepat mungkin di jam operasional. Pilih channel paling nyaman buat kamu.
                    </motion.p>

                    <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-6 md:gap-10">
                        <HeroStat value={5} suffix="mnt" label="Rata-rata Balas" />
                        <Divider />
                        <HeroStat value={4.3} fixed={1} suffix="/5" label="Rating Tamu" />
                        <Divider />
                        <HeroStat value={845} suffix="+" label="Tamu Terlayani" />
                    </div>
                </div>
            </section>

            {/* CONTACT METHODS */}
            <section className="bg-gradient-to-b from-emerald-50/40 to-white py-14 md:py-20">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-emerald-950 md:text-3xl">Channel Resmi</h2>
                        <p className="mt-2 text-sm text-emerald-900/70">
                            Pilih channel yang paling nyaman. WhatsApp untuk respon paling cepat.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <ContactCard
                            primary
                            href={wa}
                            icon={MessageCircle}
                            title="WhatsApp"
                            value={s.store_whatsapp ?? '+62 812-3456-7890'}
                            hint="Online · Balas dalam ~5 menit"
                            cta="Chat Sekarang"
                            onCopy={() => handleCopy('wa', s.store_whatsapp ?? '+6281234567890')}
                            copied={copied === 'wa'}
                        />
                        <ContactCard
                            href={phone ? `tel:${phone}` : undefined}
                            icon={Phone}
                            title="Telepon"
                            value={s.store_phone ?? '+62 812-3456-7890'}
                            hint="Jam operasional 09.00-22.00 WIB"
                            cta="Telepon"
                            onCopy={() => handleCopy('phone', s.store_phone ?? '+6281234567890')}
                            copied={copied === 'phone'}
                        />
                        <ContactCard
                            href={`mailto:${email}`}
                            icon={Mail}
                            title="Email"
                            value={email}
                            hint="Untuk kerja sama & dokumen resmi"
                            cta="Kirim Email"
                            onCopy={() => handleCopy('email', email)}
                            copied={copied === 'email'}
                        />
                    </div>
                </div>
            </section>

            {/* FORM + INFO SPLIT */}
            <section className="bg-white py-14 md:py-20">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.15fr_0.85fr]">
                    {/* FORM */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/40 md:p-8"
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-400" />
                        <div className="flex items-center gap-3">
                            <div className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <Send className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-emerald-950">Kirim Pesan</h2>
                                <p className="text-xs text-emerald-900/70">Pesan kamu akan diteruskan langsung ke WhatsApp admin.</p>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                                    className="mt-8 rounded-2xl bg-emerald-50 p-8 text-center ring-1 ring-emerald-100"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.1, stiffness: 260, damping: 18 }}
                                        className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                                    >
                                        <CheckCircle2 className="size-8" />
                                    </motion.div>
                                    <h3 className="mt-4 text-lg font-bold text-emerald-950">Pesan Disiapkan!</h3>
                                    <p className="mt-1 text-sm text-emerald-900/70">
                                        WhatsApp admin terbuka dengan pesanmu. Kalau tidak terbuka otomatis,{' '}
                                        <a href={wa} target="_blank" rel="noreferrer" className="font-semibold text-emerald-700 underline">
                                            klik di sini
                                        </a>
                                        .
                                    </p>
                                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                                        <Button type="button" onClick={resetForm} variant="outline" className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                                            Tulis pesan lain
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-6 space-y-5"
                                >
                                    <div>
                                        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-emerald-900/70">Topik</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {TOPICS.map((t) => {
                                                const Active = t.icon;
                                                const isOn = form.topic === t.key;

                                                return (
                                                    <button
                                                        key={t.key}
                                                        type="button"
                                                        onClick={() => setForm((f) => ({ ...f, topic: t.key }))}
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                                                            isOn
                                                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                                                                : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 hover:bg-emerald-100'
                                                        }`}
                                                    >
                                                        <Active className="size-3.5" />
                                                        {t.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold text-emerald-900/80">
                                                Nama lengkap *
                                            </Label>
                                            <Input
                                                id="contact-name"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                                placeholder="Mas Budi"
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="contact-phone" className="mb-1.5 block text-xs font-semibold text-emerald-900/80">
                                                Nomor WhatsApp *
                                            </Label>
                                            <Input
                                                id="contact-phone"
                                                required
                                                inputMode="numeric"
                                                value={form.phone}
                                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                                placeholder="08xxxxxxxxxx"
                                                className="rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-emerald-900/80">
                                            Email <span className="text-emerald-900/50">(opsional)</span>
                                        </Label>
                                        <Input
                                            id="contact-email"
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                            placeholder="kamu@email.com"
                                            className="rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-emerald-900/80">
                                            Pesan kamu *
                                        </Label>
                                        <textarea
                                            id="contact-message"
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                            placeholder="Ceritakan kebutuhanmu — booking tanggal, jumlah orang, atau pertanyaan apa pun..."
                                            className="flex min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <p className="mt-1.5 text-[11px] text-emerald-900/60">
                                            {form.message.length} karakter · pesan akan dibuka di WhatsApp dengan format rapi
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                        <p className="text-[11px] text-emerald-900/60">Dengan menekan kirim, kamu setuju untuk dihubungi balik via WhatsApp.</p>
                                        <Magnet padding={20} strength={0.25}>
                                            <Button
                                                type="submit"
                                                className="h-12 rounded-full bg-emerald-600 px-7 text-sm font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700"
                                            >
                                                <Send className="mr-2 size-4" />
                                                Kirim ke WhatsApp
                                            </Button>
                                        </Magnet>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* INFO + MAP */}
                    <div className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: 0.1 }}
                            className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg shadow-emerald-100/30"
                        >
                            <div className="aspect-[4/3] w-full">
                                <iframe
                                    title="Peta Cidurian Riverside"
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                                    className="h-full w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-3">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-11 rounded-xl border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                >
                                    <a href={mapsHref} target="_blank" rel="noreferrer">
                                        <MapPin className="mr-2 size-4" /> Buka Maps
                                    </a>
                                </Button>
                                <Button asChild className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700">
                                    <a href={directionsHref} target="_blank" rel="noreferrer">
                                        <Navigation className="mr-2 size-4" /> Lihat Rute
                                    </a>
                                </Button>
                            </div>
                        </motion.div>

                        <SpotlightCard className="rounded-3xl border border-emerald-100 bg-white p-5">
                            <h3 className="text-sm font-bold text-emerald-950">Detail Lokasi</h3>
                            <ul className="mt-3 space-y-3 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                    <span className="text-emerald-900/85">{address}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Clock className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                    <span className="text-emerald-900/85">{hours}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                    <span className="text-emerald-900/85">{s.store_phone ?? '+62 812-3456-7890'}</span>
                                </li>
                            </ul>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <SocialIcon href="https://instagram.com/cidurianriverside" icon={Instagram} label="Instagram" />
                                <SocialIcon href="https://www.tiktok.com/@cidurianriverside" icon={Music2} label="TikTok" />
                                <SocialIcon href={wa} icon={MessageCircle} label="WhatsApp" />
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-gradient-to-b from-white to-emerald-50/40 py-14 md:py-20">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="mb-8 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-800"
                        >
                            FAQ
                        </motion.span>
                        <h2 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950 md:text-3xl">
                            Pertanyaan yang Sering Ditanyakan
                        </h2>
                        <p className="mt-2 text-sm text-emerald-900/70">
                            Cek dulu di sini sebelum chat — siapa tahu jawabannya udah ada.
                        </p>
                    </div>
                    <AnimatedList className="space-y-3" stagger={0.05}>
                        {FAQS.map((f, idx) => (
                            <FAQItem key={f.q} faq={f} defaultOpen={idx === 0} />
                        ))}
                    </AnimatedList>
                    <div className="mt-8 text-center">
                        <p className="text-sm text-emerald-900/70">Masih ada yang ingin ditanyakan?</p>
                        <Button asChild className="mt-3 h-11 rounded-full bg-emerald-600 px-6 hover:bg-emerald-700">
                            <a href={wa} target="_blank" rel="noreferrer">
                                <MessageCircle className="mr-2 size-4" /> Chat Admin Langsung
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

function HeroStat({ value, label, suffix, fixed }: { value: number; label: string; suffix?: string; fixed?: number }) {
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
    return <span aria-hidden className="hidden h-10 w-px bg-white/15 sm:inline-block" />;
}

type ContactCardProps = {
    href?: string;
    icon: typeof MessageCircle;
    title: string;
    value: string;
    hint: string;
    cta: string;
    primary?: boolean;
    onCopy: () => void;
    copied: boolean;
};

function ContactCard({ href, icon: Icon, title, value, hint, cta, primary = false, onCopy, copied }: ContactCardProps) {
    const inner = (
        <SpotlightCard
            className={`group relative h-full overflow-hidden rounded-3xl border p-6 transition ${
                primary
                    ? 'border-emerald-200 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-500/30'
                    : 'border-emerald-100 bg-white text-emerald-950 hover:-translate-y-0.5 hover:shadow-lg'
            }`}
            spotlightColor={primary ? 'rgba(255,255,255,0.18)' : 'rgba(16,185,129,0.18)'}
        >
            <GlareHover className="!h-full !w-full" glareColor={primary ? '#ffffff' : '#10b981'} glareOpacity={primary ? 0.18 : 0.12}>
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                        <div
                            className={`grid size-12 place-items-center rounded-2xl ${
                                primary ? 'bg-white/15 text-white backdrop-blur' : 'bg-emerald-50 text-emerald-600'
                            }`}
                        >
                            <Icon className="size-5" />
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onCopy();
                            }}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                                primary
                                    ? 'bg-white/15 text-white hover:bg-white/25'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            aria-label={`Salin ${title}`}
                        >
                            {copied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" />}
                            {copied ? 'Tersalin' : 'Salin'}
                        </button>
                    </div>
                    <h3 className={`mt-4 text-lg font-bold ${primary ? 'text-white' : 'text-emerald-950'}`}>{title}</h3>
                    <p className={`mt-0.5 break-all text-sm ${primary ? 'text-emerald-50/95' : 'text-emerald-900/85'}`}>{value}</p>
                    <p className={`mt-2 text-[11px] ${primary ? 'text-emerald-100/80' : 'text-emerald-900/60'}`}>{hint}</p>
                    <div
                        className={`mt-5 inline-flex items-center justify-between rounded-2xl px-4 py-2 text-sm font-semibold ${
                            primary
                                ? 'bg-white text-emerald-700'
                                : 'bg-emerald-50 text-emerald-800 group-hover:bg-emerald-100'
                        }`}
                    >
                        {cta}
                        <Send className="ml-2 size-3.5 -rotate-45" />
                    </div>
                </div>
            </GlareHover>
        </SpotlightCard>
    );

    if (!href) {
return inner;
}

    const isExternal = href.startsWith('http');

    return (
        <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined} className="block h-full">
            {inner}
        </a>
    );
}

function SocialIcon({ href, icon: Icon, label }: { href: string; icon: typeof Instagram; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-100"
        >
            <Icon className="size-4" />
        </a>
    );
}

function FAQItem({ faq, defaultOpen = false }: { faq: FAQ; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={`overflow-hidden rounded-2xl border bg-white transition ${open ? 'border-emerald-200 shadow-md' : 'border-emerald-100'}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
                <span className="text-sm font-semibold text-emerald-950 md:text-[15px]">{faq.q}</span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`grid size-7 shrink-0 place-items-center rounded-full ${open ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}
                >
                    <ChevronDown className="size-4" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open ? (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-emerald-900/80">{faq.a}</p>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
