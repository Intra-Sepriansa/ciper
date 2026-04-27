import { Head, router, useForm } from '@inertiajs/react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import DataPagination from '@/components/admin/data-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storageUrl } from '@/lib/format';

type Gallery = { id: number; title?: string | null; image_path: string; caption?: string | null; category?: string | null };

export default function AdminGalleriesIndex({ galleries }: { galleries: { data: Gallery[]; current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> } }) {
    const { data, setData, post, processing, reset } = useForm<{ title: string; caption: string; category: string; sort_order: number; is_published: boolean; image: File | null }>({
        title: '', caption: '', category: '', sort_order: 0, is_published: true, image: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/galleries', { forceFormData: true, onSuccess: () => reset() });
    };

    const remove = (id: number) => {
 if (confirm('Hapus foto?')) {
router.delete(`/admin/galleries/${id}`, { preserveScroll: true });
} 
};

    return (
        <>
            <Head title="Galeri" />
            <AdminPageHeader title="Galeri" description="Foto suasana, makanan, acara." />

            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {galleries.data.map((g) => (
                            <div key={g.id} className="overflow-hidden rounded-xl ring-1 ring-emerald-100">
                                <img src={storageUrl(g.image_path)} alt={g.title ?? ''} className="aspect-square w-full object-cover" />
                                <div className="flex items-center justify-between gap-2 p-2 text-xs">
                                    <span className="line-clamp-1 font-medium">{g.title ?? '-'}</span>
                                    <button onClick={() => remove(g.id)} className="text-rose-600 hover:underline">Hapus</button>
                                </div>
                            </div>
                        ))}
                        {galleries.data.length === 0 ? <p className="col-span-full py-3 text-sm text-emerald-900/60">Belum ada foto.</p> : null}
                    </div>
                    <DataPagination paginator={galleries} />
                </div>

                <form onSubmit={submit} className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-4">
                    <h2 className="text-sm font-semibold text-emerald-900">Upload Foto</h2>
                    <div><Label>Foto</Label><Input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} required /></div>
                    <div><Label>Judul</Label><Input value={data.title} onChange={(e) => setData('title', e.target.value)} /></div>
                    <div><Label>Keterangan</Label><Input value={data.caption} onChange={(e) => setData('caption', e.target.value)} /></div>
                    <div><Label>Kategori</Label><Input value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="suasana / makanan / acara" /></div>
                    <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">Upload</Button>
                </form>
            </div>
        </>
    );
}
