import { statusLabel, statusTone } from '@/lib/format';

const TONE_CLASSES: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    info: 'bg-sky-100 text-sky-800 ring-sky-200',
    warning: 'bg-amber-100 text-amber-800 ring-amber-200',
    accent: 'bg-violet-100 text-violet-800 ring-violet-200',
    danger: 'bg-rose-100 text-rose-800 ring-rose-200',
    muted: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
};

export default function StatusBadge({ status }: { status: string }) {
    const tone = statusTone(status);

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone] ?? TONE_CLASSES.muted}`}>
            {statusLabel(status)}
        </span>
    );
}
