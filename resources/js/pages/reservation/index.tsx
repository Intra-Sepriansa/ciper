import { Head, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    CalendarCheck,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    Home,
    Leaf,
    MapPin,
    Minus,
    Phone,
    Plus,
    Sparkles,
    User,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AnimatedList from '@/components/reactbits/animated-list';
import ShinyText from '@/components/reactbits/shiny-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storageUrl } from '@/lib/format';
import type { StorefrontPageProps } from '@/types/storefront';

type Area = {
    slug: 'indoor' | 'lesehan' | 'riverside';
    name: string;
    tagline: string;
    description: string;
    image: string;
    capacity: number;
    accent: string;
    features: string[];
};

type Props = {
    areas: Area[];
    timeSlots: string[];
    operatingHours: { open: string; close: string };
    minDate: string;
    maxDate: string;
};

const STEPS = [
    { id: 1, label: 'Area', icon: MapPin },
    { id: 2, label: 'Tanggal & Jam', icon: Calendar },
    { id: 3, label: 'Kontak', icon: User },
];

const AREA_ICONS: Record<Area['slug'], typeof Leaf> = {
    riverside: Leaf,
    lesehan: Users,
    indoor: Home,
};

function formatDateID(iso: string) {
    if (!iso) {
        return '—';
    }

    return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function ReservationIndex({ areas, timeSlots, minDate, maxDate }: Props) {
    const { props } = usePage<StorefrontPageProps & { areas: Area[]; timeSlots: string[]; minDate: string; maxDate: string }>();
    const flashNumber = props.flash?.reservation_number ?? null;
    const flashArea = props.flash?.reservation_area ?? null;

    const [step, setStep] = useState(1);
    const [dismissedNumbers, setDismissedNumbers] = useState<Set<string>>(() => new Set());

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        reservation_date: '',
        reservation_time: '',
        guest_count: 2,
        area: 'riverside' as Area['slug'],
        note: '',
    });

    const showSuccess = Boolean(flashNumber && !dismissedNumbers.has(flashNumber));

    const selectedArea = useMemo(
        () => areas.find((a) => a.slug === data.area) ?? areas[0],
        [areas, data.area],
    );

    function canProceed(s: number): boolean {
        if (s === 1) {
            return Boolean(data.area) && data.guest_count > 0;
        }

        if (s === 2) {
            return Boolean(data.reservation_date) && Boolean(data.reservation_time);
        }

        return Boolean(data.name) && Boolean(data.phone);
    }

    function submit() {
        post('/reservation', { preserveScroll: true });
    }

    if (showSuccess && flashNumber) {
        return (
            <SuccessState
                number={flashNumber}
                area={flashArea ?? ''}
                onReset={() => setDismissedNumbers((prev) => new Set(prev).add(flashNumber))}
            />
        );
    }

    return (
        <>
            <Head title="Reservasi Meja" />

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-12 md:py-16">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 70%, #fff 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="relative mx-auto max-w-6xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
                    >
                        <Sparkles className="size-3" />
                        <ShinyText text="Booking Meja" speed={5} />
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                    >
                        Amankan Tempat Favoritmu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto mt-3 max-w-2xl text-sm text-emerald-100/80 md:text-base"
                    >
                        Pilih area, tanggal, dan jam — admin konfirmasi via WhatsApp dalam 15 menit.
                    </motion.p>
                </div>
            </section>

            <div className="mx-auto max-w-5xl px-4 py-8">
                {/* STEPPER */}
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-white p-4 ring-1 ring-emerald-100 shadow-sm">
                    {STEPS.map((s, idx) => {
                        const Icon = s.icon;
                        const active = step === s.id;
                        const done = step > s.id;

                        return (
                            <div key={s.id} className="flex flex-1 items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (done) {
                                            setStep(s.id);
                                        }
                                    }}
                                    disabled={!done && !active}
                                    className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-left transition ${done ? 'cursor-pointer hover:bg-emerald-50' : ''}`}
                                >
                                    <motion.div
                                        animate={{ scale: active ? 1.05 : 1 }}
                                        className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                                            done
                                                ? 'bg-emerald-600 text-white'
                                                : active
                                                    ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-600'
                                                    : 'bg-emerald-50 text-emerald-900/50'
                                        }`}
                                    >
                                        {done ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                                    </motion.div>
                                    <div className="hidden min-w-0 sm:block">
                                        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900/50">
                                            Step {s.id}
                                        </div>
                                        <div className={`truncate text-sm font-semibold ${active || done ? 'text-emerald-900' : 'text-emerald-900/50'}`}>
                                            {s.label}
                                        </div>
                                    </div>
                                </button>
                                {idx < STEPS.length - 1 ? (
                                    <div className="relative mx-1 h-0.5 flex-1 rounded bg-emerald-100">
                                        <motion.div
                                            initial={false}
                                            animate={{ width: step > s.id ? '100%' : '0%' }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute inset-y-0 left-0 rounded bg-emerald-600"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
                    {/* STEP CONTENT */}
                    <div>
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <SectionTitle title="Pilih Area" desc="Tiap area punya karakter berbeda. Pilih yang paling cocok untuk acaramu." />
                                    <AnimatedList className="grid gap-4 md:grid-cols-3" stagger={0.08}>
                                        {areas.map((area) => (
                                            <AreaCard
                                                key={area.slug}
                                                area={area}
                                                active={data.area === area.slug}
                                                onSelect={() => setData('area', area.slug)}
                                            />
                                        ))}
                                    </AnimatedList>

                                    <SectionTitle title="Jumlah Orang" desc="Berapa orang yang akan datang? Maksimum 30 orang." />
                                    <GuestCounter
                                        value={data.guest_count}
                                        onChange={(v) => setData('guest_count', v)}
                                        maxFromArea={selectedArea.capacity}
                                    />
                                </motion.div>
                            ) : null}

                            {step === 2 ? (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <SectionTitle title="Pilih Tanggal" desc="Bisa booking hingga 2 bulan ke depan." />
                                    <CalendarPicker
                                        value={data.reservation_date}
                                        onChange={(d) => setData('reservation_date', d)}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                    />

                                    <SectionTitle title="Pilih Jam" desc="Jam operasional 09.00–21.00 WIB. Slot tiap 30 menit." />
                                    <TimeSlotGrid
                                        slots={timeSlots}
                                        value={data.reservation_time}
                                        onChange={(t) => setData('reservation_time', t)}
                                    />
                                    {errors.reservation_time ? (
                                        <p className="text-sm font-semibold text-rose-600">{errors.reservation_time}</p>
                                    ) : null}
                                </motion.div>
                            ) : null}

                            {step === 3 ? (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <SectionTitle title="Kontak Pemesan" desc="Admin akan hubungi lewat nomor WhatsApp ini." />

                                    <div className="grid gap-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <Label htmlFor="name">Nama lengkap</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Nama pemesan"
                                                className="mt-1"
                                            />
                                            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">
                                                <Phone className="mr-1 inline size-3" />
                                                Nomor WhatsApp
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="081234567890"
                                                className="mt-1"
                                            />
                                            {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email (opsional)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="email@contoh.com"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Label htmlFor="note">Catatan acara (opsional)</Label>
                                            <textarea
                                                id="note"
                                                value={data.note}
                                                onChange={(e) => setData('note', e.target.value)}
                                                rows={3}
                                                placeholder="Contoh: ulang tahun anak 5 tahun, butuh kue + balon"
                                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        {/* NAV BUTTONS */}
                        <div className="mt-8 flex items-center justify-between gap-3">
                            {step > 1 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                                    className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                                >
                                    <ChevronLeft className="size-4" />
                                    Kembali
                                </Button>
                            ) : <span />}

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={() => setStep((s) => Math.min(3, s + 1))}
                                    disabled={!canProceed(step)}
                                    className="rounded-full bg-emerald-600 px-6 hover:bg-emerald-700"
                                >
                                    Lanjut
                                    <ChevronRight className="size-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={submit}
                                    disabled={processing || !canProceed(3)}
                                    className="rounded-full bg-emerald-600 px-6 hover:bg-emerald-700"
                                >
                                    <CalendarCheck className="size-4" />
                                    {processing ? 'Mengirim...' : 'Kirim Reservasi'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* SUMMARY SIDEBAR */}
                    <SummaryCard
                        area={selectedArea}
                        guestCount={data.guest_count}
                        date={data.reservation_date}
                        time={data.reservation_time}
                        name={data.name}
                        phone={data.phone}
                    />
                </div>
            </div>
        </>
    );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-emerald-950">{title}</h2>
            {desc ? <p className="mt-1 text-sm text-emerald-900/60">{desc}</p> : null}
        </div>
    );
}

function AreaCard({ area, active, onSelect }: { area: Area; active: boolean; onSelect: () => void }) {
    const Icon = AREA_ICONS[area.slug];

    return (
        <motion.button
            type="button"
            onClick={onSelect}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', damping: 18, stiffness: 180 }}
            className={`group relative overflow-hidden rounded-3xl bg-white text-left shadow-sm transition ${
                active ? 'ring-2 ring-emerald-600 ring-offset-2' : 'ring-1 ring-emerald-100 hover:ring-emerald-200'
            }`}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={storageUrl(area.image)}
                    alt={area.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${area.accent} opacity-60 mix-blend-multiply`} />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <div className="flex items-center gap-1.5">
                        <Icon className="size-4" />
                        <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">{area.tagline}</div>
                    </div>
                    <div className="mt-1 text-xl font-bold">{area.name}</div>
                </div>
                <AnimatePresence>
                    {active ? (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white text-emerald-600 shadow-lg"
                        >
                            <CheckCircle2 className="size-5" />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
            <div className="p-4">
                <p className="text-xs text-emerald-900/70">{area.description}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                    {area.features.map((f) => (
                        <li key={f} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            {f}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.button>
    );
}

function GuestCounter({ value, onChange, maxFromArea }: { value: number; onChange: (v: number) => void; maxFromArea: number }) {
    const max = Math.min(30, maxFromArea);
    const presets = [2, 4, 6, 8, 10, 12];

    return (
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.button
                        type="button"
                        onClick={() => onChange(Math.max(1, value - 1))}
                        whileTap={{ scale: 0.9 }}
                        className="grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-40"
                        disabled={value <= 1}
                    >
                        <Minus className="size-5" />
                    </motion.button>
                    <div className="min-w-[88px] text-center">
                        <motion.div
                            key={value}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold text-emerald-950"
                        >
                            {value}
                        </motion.div>
                        <div className="text-xs text-emerald-900/60">orang</div>
                    </div>
                    <motion.button
                        type="button"
                        onClick={() => onChange(Math.min(max, value + 1))}
                        whileTap={{ scale: 0.9 }}
                        className="grid size-11 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-40"
                        disabled={value >= max}
                    >
                        <Plus className="size-5" />
                    </motion.button>
                </div>
                <div className="hidden text-right sm:block">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-900/50">Kapasitas area</div>
                    <div className="text-sm font-bold text-emerald-900">≤ {max} orang</div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {presets.filter((p) => p <= max).map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onChange(p)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            value === p
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                    >
                        {p} orang
                    </button>
                ))}
            </div>
        </div>
    );
}

function CalendarPicker({
    value,
    onChange,
    minDate,
    maxDate,
}: {
    value: string;
    onChange: (iso: string) => void;
    minDate: string;
    maxDate: string;
}) {
    const [cursor, setCursor] = useState(() => {
        const base = value ? new Date(value + 'T00:00:00') : new Date(minDate + 'T00:00:00');

        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    const min = new Date(minDate + 'T00:00:00');
    const max = new Date(maxDate + 'T00:00:00');

    const days = useMemo(() => {
        const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
        const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
        const startDay = first.getDay();
        const cells: Array<Date | null> = [];

        for (let i = 0; i < startDay; i++) {
            cells.push(null);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
        }

        return cells;
    }, [cursor]);

    const monthLabel = cursor.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const canPrev = cursor > new Date(min.getFullYear(), min.getMonth(), 1);
    const canNext = cursor < new Date(max.getFullYear(), max.getMonth(), 1);

    function iso(d: Date) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    return (
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                    disabled={!canPrev}
                    className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-30"
                >
                    <ChevronLeft className="size-4" />
                </button>
                <div className="text-base font-bold capitalize text-emerald-950">{monthLabel}</div>
                <button
                    type="button"
                    onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                    disabled={!canNext}
                    className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-30"
                >
                    <ChevronRight className="size-4" />
                </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-emerald-900/50">
                {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, i) => (
                    <div key={i}>{d}</div>
                ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
                {days.map((d, idx) => {
                    if (!d) {
                        return <div key={idx} />;
                    }

                    const iDate = iso(d);
                    const disabled = d < min || d > max;
                    const selected = value === iDate;

                    return (
                        <motion.button
                            key={idx}
                            type="button"
                            whileTap={{ scale: 0.88 }}
                            onClick={() => !disabled && onChange(iDate)}
                            disabled={disabled}
                            className={`grid aspect-square place-items-center rounded-xl text-sm font-semibold transition ${
                                selected
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                    : disabled
                                        ? 'text-emerald-900/25'
                                        : 'text-emerald-900 hover:bg-emerald-50'
                            }`}
                        >
                            {d.getDate()}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

function TimeSlotGrid({ slots, value, onChange }: { slots: string[]; value: string; onChange: (t: string) => void }) {
    return (
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((slot) => {
                    const selected = value === slot;

                    return (
                        <motion.button
                            key={slot}
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            onClick={() => onChange(slot)}
                            className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                selected
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            }`}
                        >
                            {slot}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

function SummaryCard({
    area,
    guestCount,
    date,
    time,
    name,
    phone,
}: {
    area: Area;
    guestCount: number;
    date: string;
    time: string;
    name: string;
    phone: string;
}) {
    return (
        <aside className="sticky top-20 h-fit">
            <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-emerald-100">
                <div className="relative h-28 overflow-hidden">
                    <img src={storageUrl(area.image)} alt={area.name} className="h-full w-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${area.accent} opacity-60 mix-blend-multiply`} />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">Ringkasan</div>
                        <div className="text-lg font-bold text-white">Reservasi {area.name}</div>
                    </div>
                </div>

                <div className="space-y-3 p-5 text-sm">
                    <SummaryRow icon={MapPin} label="Area" value={area.name} />
                    <SummaryRow icon={Users} label="Orang" value={`${guestCount} orang`} />
                    <SummaryRow icon={Calendar} label="Tanggal" value={date ? formatDateID(date) : '—'} />
                    <SummaryRow icon={Clock} label="Jam" value={time || '—'} />
                    {name ? <SummaryRow icon={User} label="Nama" value={name} /> : null}
                    {phone ? <SummaryRow icon={Phone} label="WhatsApp" value={phone} /> : null}
                </div>

                <div className="border-t border-emerald-100 bg-emerald-50/50 p-4 text-[11px] text-emerald-900/70">
                    <p>
                        Reservasi <span className="font-semibold text-emerald-900">gratis</span>. Bayar hanya untuk makanan yang kamu pesan di tempat.
                    </p>
                </div>
            </div>
        </aside>
    );
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900/50">{label}</div>
                <div className="truncate text-sm font-semibold text-emerald-900">{value}</div>
            </div>
        </div>
    );
}

function SuccessState({ number, area, onReset }: { number: string; area: string; onReset: () => void }) {
    const [copied, setCopied] = useState(false);

    function copyNumber() {
        void navigator.clipboard.writeText(number);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    }

    const waText = encodeURIComponent(
        `Halo admin, saya ingin konfirmasi reservasi dengan kode ${number}${area ? ` untuk area ${area}` : ''}. Mohon info selanjutnya.`,
    );

    return (
        <>
            <Head title="Reservasi Berhasil" />
            <div className="mx-auto max-w-2xl px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 18, stiffness: 160 }}
                    className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-emerald-100"
                >
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 px-6 py-12 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', damping: 12, stiffness: 200 }}
                            className="mx-auto grid size-20 place-items-center rounded-full bg-white/20 backdrop-blur"
                        >
                            <CheckCircle2 className="size-10 text-white" />
                        </motion.div>
                        <h1 className="mt-5 text-3xl font-bold text-white">Reservasi Terkirim!</h1>
                        <p className="mt-2 text-sm text-emerald-100/90">Admin akan konfirmasi via WhatsApp dalam 15 menit.</p>
                    </div>

                    <div className="p-6">
                        <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-5 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Kode Reservasi</div>
                            <div className="mt-2 font-mono text-2xl font-bold tracking-wider text-emerald-950">{number}</div>
                            <button
                                type="button"
                                onClick={copyNumber}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                                <Copy className="size-3.5" />
                                {copied ? 'Tersalin!' : 'Salin kode'}
                            </button>
                        </div>

                        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                            <a
                                href={`https://wa.me/6281234567890?text=${waText}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 rounded-full bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
                            >
                                Konfirmasi via WhatsApp
                            </a>
                            <button
                                type="button"
                                onClick={onReset}
                                className="flex-1 rounded-full border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
                            >
                                Buat reservasi lain
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
