import { Head } from '@inertiajs/react';
import { storageUrl } from '@/lib/format';

type Item = { id: number; title: string; image_path: string; caption?: string | null; category?: string | null };

export default function GalleryPage({ items }: { items: Item[] }) {
    return (
        <>
            <Head title="Galeri" />
            <div className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="text-2xl font-semibold text-emerald-950">Galeri</h1>
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {items.map((it) => (
                        <div key={it.id} className="group relative overflow-hidden rounded-2xl ring-1 ring-emerald-100 bg-emerald-50">
                            <img src={storageUrl(it.image_path)} alt={it.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                            {it.title ? (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">{it.title}</div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
