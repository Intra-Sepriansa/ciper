import { Head, usePage } from '@inertiajs/react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { whatsappLink } from '@/lib/format';
import type { StorefrontPageProps } from '@/types/storefront';

export default function ContactPage() {
    const { props } = usePage<StorefrontPageProps>();
    const s = props.storefront ?? {};
    const wa = whatsappLink(s.store_whatsapp);

    return (
        <>
            <Head title="Kontak & Lokasi" />
            <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-2">
                <div className="space-y-3 rounded-3xl border border-emerald-100 bg-white p-6">
                    <h1 className="text-2xl font-semibold text-emerald-950">Kontak & Lokasi</h1>
                    <p className="flex items-start gap-2 text-sm text-emerald-900/80"><MapPin className="mt-0.5 size-4 text-emerald-600" /> {s.store_address}</p>
                    <p className="flex items-start gap-2 text-sm text-emerald-900/80"><Clock className="mt-0.5 size-4 text-emerald-600" /> {s.store_open_hours}</p>
                    <p className="flex items-start gap-2 text-sm text-emerald-900/80"><Phone className="mt-0.5 size-4 text-emerald-600" /> {s.store_phone}</p>
                    <div className="flex flex-wrap gap-2 pt-3">
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700"><a href={wa} target="_blank" rel="noreferrer">Hubungi Admin</a></Button>
                        <Button asChild variant="outline" className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                            <a href={`https://www.google.com/maps?q=${encodeURIComponent(s.store_address ?? 'Jasinga Bogor')}`} target="_blank" rel="noreferrer">
                                Buka Google Maps
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-emerald-100">
                    <iframe
                        title="Google Maps"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(s.store_address ?? 'Jasinga Bogor')}&output=embed`}
                        className="h-full w-full border-0"
                        loading="lazy"
                    />
                </div>
            </div>
        </>
    );
}
