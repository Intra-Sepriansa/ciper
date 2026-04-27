import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Bike,
    Check,
    CheckCircle2,
    ChefHat,
    ChevronRight,
    CircleDollarSign,
    Clock,
    Copy,
    CreditCard,
    FileDown,
    MapPin,
    MessageCircle,
    Package,
    PackageCheck,
    QrCode,
    RefreshCw,
    ShoppingBag,
    User,
    Utensils,
    XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AnimatedList from '@/components/reactbits/animated-list';
import ShinyText from '@/components/reactbits/shiny-text';
import { Button } from '@/components/ui/button';
import { formatRupiah, orderTypeLabel, statusLabel, whatsappLink } from '@/lib/format';
import type { OrderRecord, StorefrontPageProps } from '@/types/storefront';

type Props = { order: OrderRecord; qr_data_uri: string };

const STATUS_FLOW_STANDARD = ['pending_payment', 'paid', 'processing', 'ready_for_pickup', 'completed'];
const STATUS_FLOW_DELIVERY = ['pending_payment', 'paid', 'processing', 'delivering', 'completed'];

const STATUS_ICONS: Record<string, typeof Package> = {
    pending_payment: CreditCard,
    paid: CircleDollarSign,
    processing: ChefHat,
    ready_for_pickup: PackageCheck,
    delivering: Bike,
    completed: CheckCircle2,
    cancelled: XCircle,
    expired: XCircle,
    refunded: RefreshCw,
};

const ORDER_TYPE_ICON: Record<string, typeof Utensils> = {
    dine_in: Utensils,
    takeaway: ShoppingBag,
    delivery: Bike,
};

function statusAccent(status: string): { bg: string; text: string; ring: string; glow: string } {
    switch (status) {
        case 'pending_payment':
        case 'unpaid':
        case 'pending':
            return { bg: 'bg-amber-500', text: 'text-amber-900', ring: 'ring-amber-200', glow: 'shadow-amber-500/30' };
        case 'paid':
        case 'processing':
            return { bg: 'bg-sky-500', text: 'text-sky-900', ring: 'ring-sky-200', glow: 'shadow-sky-500/30' };
        case 'ready_for_pickup':
        case 'delivering':
            return { bg: 'bg-indigo-500', text: 'text-indigo-900', ring: 'ring-indigo-200', glow: 'shadow-indigo-500/30' };
        case 'completed':
            return { bg: 'bg-emerald-600', text: 'text-emerald-900', ring: 'ring-emerald-200', glow: 'shadow-emerald-500/30' };
        case 'cancelled':
        case 'expired':
        case 'refunded':
        case 'failed':
            return { bg: 'bg-rose-500', text: 'text-rose-900', ring: 'ring-rose-200', glow: 'shadow-rose-500/30' };
        default:
            return { bg: 'bg-zinc-500', text: 'text-zinc-800', ring: 'ring-zinc-200', glow: 'shadow-zinc-500/20' };
    }
}

function timeAgoID(iso: string): string {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);

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

export default function TrackingShow({ order, qr_data_uri }: Props) {
    const { props } = usePage<StorefrontPageProps>();
    const wa = whatsappLink(
        props.storefront?.store_whatsapp,
        `Halo Cidurian Riverside, saya ingin tanya soal order ${order.order_number}.`,
    );

    const [copied, setCopied] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(() => Date.now());

    const isTerminal = ['completed', 'cancelled', 'expired', 'refunded'].includes(order.status);

    // auto-refresh status every 30s (unless terminal)
    useEffect(() => {
        if (isTerminal) {
            return;
        }

        const t = window.setInterval(() => {
            router.reload({ only: ['order'], onSuccess: () => setLastRefresh(Date.now()) });
        }, 30_000);

        return () => window.clearInterval(t);
    }, [isTerminal, order.order_number]);

    const flow = useMemo(
        () => (order.order_type === 'delivery' ? STATUS_FLOW_DELIVERY : STATUS_FLOW_STANDARD),
        [order.order_type],
    );

    const currentIdx = flow.indexOf(order.status);
    const hidden = ['cancelled', 'expired', 'refunded'].includes(order.status);

    const accent = statusAccent(order.status);
    const StatusIcon = STATUS_ICONS[order.status] ?? Package;
    const TypeIcon = ORDER_TYPE_ICON[order.order_type] ?? ShoppingBag;

    function copyNumber() {
        void navigator.clipboard.writeText(order.order_number);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    }

    function manualRefresh() {
        router.reload({ only: ['order'], onSuccess: () => setLastRefresh(Date.now()) });
    }

    return (
        <>
            <Head title={`Tracking ${order.order_number}`} />

            {/* HEADER */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-10">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 70%, #fff 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="relative mx-auto max-w-6xl">
                    <Link
                        href="/tracking"
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur transition hover:bg-white/20"
                    >
                        <ArrowLeft className="size-3.5" />
                        Cari pesanan lain
                    </Link>

                    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-200/70">
                                <TypeIcon className="size-3.5" />
                                {orderTypeLabel(order.order_type)}
                                <ShinyText text="• live tracking" speed={6} className="!text-emerald-200" />
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                                <h1 className="font-mono text-2xl font-bold tracking-wider text-white md:text-3xl">
                                    {order.order_number}
                                </h1>
                                <button
                                    type="button"
                                    onClick={copyNumber}
                                    className="grid size-8 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                                    aria-label="Salin kode"
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                <Check className="size-4" />
                                            </motion.span>
                                        ) : (
                                            <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                <Copy className="size-4" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                            <div className="mt-1 text-sm text-emerald-200/80">
                                {order.customer_name} • {order.customer_phone}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {!isTerminal ? (
                                <button
                                    type="button"
                                    onClick={manualRefresh}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
                                >
                                    <RefreshCw className="size-3.5" />
                                    Refresh
                                </button>
                            ) : null}
                            <motion.div
                                animate={isTerminal ? {} : { scale: [1, 1.03, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`inline-flex items-center gap-2 rounded-full ${accent.bg} px-4 py-2 text-sm font-bold text-white shadow-lg ${accent.glow}`}
                            >
                                <StatusIcon className="size-4" />
                                {statusLabel(order.status)}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    {/* PROGRESS STEPPER */}
                    {!hidden ? (
                        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-7">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-base font-bold text-emerald-950 md:text-lg">Progres Pesanan</h2>
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900/50">
                                    {!isTerminal ? 'Auto-refresh 30s' : 'Selesai'}
                                </div>
                            </div>
                            <ProgressStepper flow={flow} currentIdx={currentIdx} orderType={order.order_type} />
                            {!isTerminal ? (
                                <p className="mt-5 rounded-2xl bg-emerald-50/70 p-3 text-center text-xs text-emerald-900/70">
                                    Status akan diperbarui otomatis setiap 30 detik. Terakhir dicek{' '}
                                    <span className="font-semibold text-emerald-900">{timeAgoID(new Date(lastRefresh).toISOString())}</span>.
                                </p>
                            ) : null}
                        </div>
                    ) : null}

                    {hidden ? (
                        <div className={`rounded-3xl border-2 border-dashed ${accent.ring} bg-white p-5 shadow-sm`}>
                            <div className="flex items-center gap-3">
                                <div className={`grid size-12 place-items-center rounded-full ${accent.bg} text-white`}>
                                    <StatusIcon className="size-6" />
                                </div>
                                <div>
                                    <h2 className={`font-bold ${accent.text}`}>Pesanan {statusLabel(order.status)}</h2>
                                    <p className="mt-1 text-sm text-zinc-700">
                                        {order.status === 'cancelled'
                                            ? 'Pesanan ini sudah dibatalkan. Kamu bisa pesan ulang lewat menu.'
                                            : order.status === 'expired'
                                                ? 'Pesanan kedaluwarsa karena pembayaran tidak terselesaikan.'
                                                : 'Pesanan sudah dikembalikan.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* TIMELINE */}
                    <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-7">
                        <h2 className="text-base font-bold text-emerald-950 md:text-lg">Timeline Detail</h2>
                        {(order.status_histories ?? []).length === 0 ? (
                            <p className="mt-3 text-sm text-emerald-900/60">Belum ada riwayat status.</p>
                        ) : (
                            <AnimatedList className="mt-5 space-y-4 border-l-2 border-emerald-100 pl-5" stagger={0.06}>
                                {(order.status_histories ?? []).map((h) => {
                                    const Icon = STATUS_ICONS[h.to_status] ?? Package;
                                    const hAccent = statusAccent(h.to_status);

                                    return (
                                        <div key={h.id} className="relative">
                                            <span
                                                className={`absolute -left-[30px] top-0 grid size-6 place-items-center rounded-full ${hAccent.bg} text-white shadow ring-4 ring-white`}
                                            >
                                                <Icon className="size-3" />
                                            </span>
                                            <div className="text-sm font-bold text-emerald-950">{statusLabel(h.to_status)}</div>
                                            <div className="mt-0.5 text-xs text-emerald-900/60">
                                                {new Date(h.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                {' • '}
                                                <span className="font-semibold text-emerald-800">{timeAgoID(h.created_at)}</span>
                                                {h.changed_by ? ` • ${h.changed_by.name}` : ''}
                                            </div>
                                            {h.note ? (
                                                <div className="mt-2 rounded-lg bg-emerald-50/70 p-2.5 text-xs text-emerald-900/80">
                                                    {h.note}
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </AnimatedList>
                        )}
                    </div>

                    {/* ORDER DETAIL */}
                    <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-7">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-bold text-emerald-950 md:text-lg">Detail Pesanan</h2>
                            <div className="text-xs text-emerald-900/50">
                                {(order.items ?? []).length} item
                            </div>
                        </div>
                        <div className="divide-y divide-emerald-50">
                            {(order.items ?? []).map((item) => (
                                <div key={item.id} className="flex items-start gap-3 py-3">
                                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                                        {item.quantity}×
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-semibold text-emerald-950">{item.product_name}</div>
                                        <div className="text-xs text-emerald-900/60">
                                            {formatRupiah(item.unit_price)} / item
                                            {item.note ? ` • ${item.note}` : ''}
                                        </div>
                                    </div>
                                    <div className="shrink-0 font-bold text-emerald-900">
                                        {formatRupiah(item.subtotal)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 space-y-2 border-t border-emerald-100 pt-4 text-sm">
                            <SummaryRow label="Subtotal" value={formatRupiah(order.subtotal)} />
                            {order.discount_total > 0 ? (
                                <SummaryRow label={`Diskon${order.voucher_code ? ` (${order.voucher_code})` : ''}`} value={`−${formatRupiah(order.discount_total)}`} accent="text-emerald-700" />
                            ) : null}
                            {order.shipping_cost > 0 ? (
                                <SummaryRow label={`Ongkir${order.shipping_service ? ` • ${order.shipping_service}` : ''}`} value={formatRupiah(order.shipping_cost)} />
                            ) : null}
                            {order.tax_total > 0 ? <SummaryRow label="Pajak" value={formatRupiah(order.tax_total)} /> : null}
                            {order.service_total > 0 ? <SummaryRow label="Biaya layanan" value={formatRupiah(order.service_total)} /> : null}
                            <div className="flex items-center justify-between border-t border-emerald-100 pt-3 text-base font-bold text-emerald-950">
                                <span>Total</span>
                                <span>{formatRupiah(order.grand_total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* CUSTOMER INFO */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-900/50">
                                <User className="size-3.5" />
                                Pemesan
                            </div>
                            <div className="mt-2 font-bold text-emerald-950">{order.customer_name}</div>
                            <div className="text-sm text-emerald-900/70">{order.customer_phone}</div>
                            {order.customer_email ? <div className="text-sm text-emerald-900/70">{order.customer_email}</div> : null}
                        </div>
                        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-900/50">
                                <MapPin className="size-3.5" />
                                {order.order_type === 'delivery' ? 'Alamat antar' : order.order_type === 'dine_in' ? 'Meja / area' : 'Ambil di'}
                            </div>
                            <div className="mt-2 text-sm text-emerald-900/90">
                                {order.order_type === 'delivery'
                                    ? order.delivery_address_snapshot ?? '—'
                                    : order.order_type === 'dine_in'
                                        ? `${order.dine_in_area ?? '—'}${order.guest_count ? ` • ${order.guest_count} orang` : ''}${order.table_note ? ` • ${order.table_note}` : ''}`
                                        : 'Cidurian Riverside — Jasinga, Bogor'}
                            </div>
                            {order.scheduled_at ? (
                                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                    <Clock className="size-3" />
                                    {new Date(order.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {order.customer_note ? (
                        <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-5 text-sm text-amber-900 shadow-sm">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider">Catatan pemesan</div>
                            {order.customer_note}
                        </div>
                    ) : null}
                </div>

                {/* ACTION SIDEBAR */}
                <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
                    {/* QR */}
                    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-[2px] shadow-lg">
                        <div className="rounded-[calc(1.5rem-2px)] bg-white p-5 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                                <QrCode className="size-3.5" />
                                QR Pesanan
                            </div>
                            <div className="mx-auto mt-3 rounded-2xl bg-white p-2 ring-1 ring-emerald-100">
                                <img src={qr_data_uri} alt="QR Code" className="mx-auto size-44" />
                            </div>
                            <p className="mt-2 text-[11px] text-emerald-900/60">Scan untuk buka halaman tracking ini.</p>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="space-y-2">
                        <Button asChild className="h-12 w-full justify-between rounded-2xl bg-emerald-600 font-bold hover:bg-emerald-700">
                            <a href={`/tracking/${order.order_number}/invoice`} target="_blank" rel="noreferrer">
                                <span className="flex items-center gap-2">
                                    <FileDown className="size-4" />
                                    Download Invoice PDF
                                </span>
                                <ChevronRight className="size-4" />
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="h-12 w-full justify-between rounded-2xl border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                            <a href={wa} target="_blank" rel="noreferrer">
                                <span className="flex items-center gap-2">
                                    <MessageCircle className="size-4" />
                                    Chat admin
                                </span>
                                <ChevronRight className="size-4" />
                            </a>
                        </Button>
                        {order.payment_status !== 'paid' && order.status === 'pending_payment' ? (
                            <Button asChild variant="outline" className="h-12 w-full justify-between rounded-2xl border-amber-200 bg-amber-50/50 text-amber-900 hover:bg-amber-50">
                                <Link href={`/checkout/${order.order_number}/payment`}>
                                    <span className="flex items-center gap-2">
                                        <CreditCard className="size-4" />
                                        Lanjut bayar
                                    </span>
                                    <ChevronRight className="size-4" />
                                </Link>
                            </Button>
                        ) : null}
                    </div>

                    {/* PAYMENT BADGE */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-900/50">Pembayaran</div>
                                <div className="mt-1 text-sm font-bold text-emerald-950">{statusLabel(order.payment_status)}</div>
                            </div>
                            <div className={`grid size-10 place-items-center rounded-full ${statusAccent(order.payment_status).bg} text-white`}>
                                <CircleDollarSign className="size-5" />
                            </div>
                        </div>
                        {order.paid_at ? (
                            <div className="mt-2 text-[11px] text-emerald-900/60">
                                Dibayar {new Date(order.paid_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </div>
                        ) : null}
                    </div>
                </aside>
            </div>
        </>
    );
}

function ProgressStepper({ flow, currentIdx, orderType }: { flow: string[]; currentIdx: number; orderType: string }) {
    const labels: Record<string, string> = {
        pending_payment: 'Bayar',
        paid: 'Dibayar',
        processing: 'Diproses',
        ready_for_pickup: orderType === 'dine_in' ? 'Siap disajikan' : 'Siap diambil',
        delivering: 'Antar',
        completed: 'Selesai',
    };

    return (
        <div className="relative">
            {/* Mobile: vertical */}
            <div className="flex flex-col gap-4 md:hidden">
                {flow.map((s, idx) => {
                    const Icon = STATUS_ICONS[s] ?? Package;
                    const done = idx < currentIdx;
                    const active = idx === currentIdx;

                    return (
                        <div key={s} className="flex items-center gap-3">
                            <motion.div
                                animate={active ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className={`grid size-10 shrink-0 place-items-center rounded-full transition ${
                                    done
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                        : active
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-100'
                                            : 'bg-emerald-50 text-emerald-900/30'
                                }`}
                            >
                                {done ? <Check className="size-5" /> : <Icon className="size-4" />}
                            </motion.div>
                            <div>
                                <div className={`text-sm font-bold ${done || active ? 'text-emerald-950' : 'text-emerald-900/40'}`}>
                                    {labels[s] ?? statusLabel(s)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop: horizontal */}
            <div className="relative hidden md:block">
                <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-emerald-100">
                    <motion.div
                        initial={false}
                        animate={{ width: `${currentIdx < 0 ? 0 : (currentIdx / (flow.length - 1)) * 100}%` }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    />
                </div>
                <div className="relative grid" style={{ gridTemplateColumns: `repeat(${flow.length}, 1fr)` }}>
                    {flow.map((s, idx) => {
                        const Icon = STATUS_ICONS[s] ?? Package;
                        const done = idx < currentIdx;
                        const active = idx === currentIdx;

                        return (
                            <div key={s} className="flex flex-col items-center">
                                <motion.div
                                    animate={active ? { scale: [1, 1.08, 1] } : {}}
                                    transition={{ duration: 1.6, repeat: Infinity }}
                                    className={`grid size-10 place-items-center rounded-full transition ${
                                        done
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                            : active
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-100'
                                                : 'bg-emerald-100 text-emerald-900/40'
                                    }`}
                                >
                                    {done ? <Check className="size-5" /> : <Icon className="size-4" />}
                                </motion.div>
                                <div className={`mt-2 text-center text-xs font-bold ${done || active ? 'text-emerald-950' : 'text-emerald-900/40'}`}>
                                    {labels[s] ?? statusLabel(s)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
    return (
        <div className={`flex items-center justify-between ${accent ?? 'text-emerald-900/80'}`}>
            <span>{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    );
}
