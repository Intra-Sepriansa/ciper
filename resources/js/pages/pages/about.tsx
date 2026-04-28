import { Head, usePage } from '@inertiajs/react';
import type { StorefrontPageProps } from '@/types/storefront';

export default function AboutPage() {
    const { props } = usePage<StorefrontPageProps>();
    const s = props.storefront ?? {};

    return (
        <>
            <Head title="Tentang Kami" />
            <div className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="text-3xl font-semibold text-emerald-950">Tentang {s.store_name ?? 'Cidurian Riverside'}</h1>
                <p className="mt-3 text-base text-emerald-900/80">
                    Cidurian Riverside adalah cafe & resto bernuansa pemandangan Sungai Cidurian. Cocok untuk makan keluarga, takeaway, dan delivery di sekitar Jasinga.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                        'Area makan keluarga',
                        'Lesehan pinggir sungai',
                        'Mushola',
                        'Parkir luas',
                        'Acara keluarga',
                        'Takeaway & delivery',
                    ].map((label) => (
                        <div key={label} className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-emerald-900">{label}</div>
                    ))}
                </div>
            </div>
        </>
    );
}
