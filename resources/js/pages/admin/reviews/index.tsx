import { Head, router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import DataPagination from '@/components/admin/data-pagination';

type Review = {
    id: number;
    reviewer_name?: string | null;
    rating: number;
    comment?: string | null;
    is_published: boolean;
    product?: { id: number; name: string } | null;
    created_at: string;
};

export default function AdminReviewsIndex({ reviews }: { reviews: { data: Review[]; current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> } }) {
    const toggle = (id: number) => router.patch(`/admin/reviews/${id}/toggle`, {}, { preserveScroll: true });
    const remove = (id: number) => {
 if (confirm('Hapus ulasan?')) {
router.delete(`/admin/reviews/${id}`, { preserveScroll: true });
} 
};

    return (
        <>
            <Head title="Ulasan" />
            <AdminPageHeader title="Ulasan" description="Moderasi ulasan dari pelanggan." />

            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="text-xs uppercase text-emerald-900/60"><th className="py-2">Pengulas</th><th>Menu</th><th>Rating</th><th>Komentar</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                        {reviews.data.map((r) => (
                            <tr key={r.id} className="border-t border-emerald-100/70 align-top">
                                <td className="py-2 font-medium">{r.reviewer_name ?? 'Anonim'}<div className="text-xs text-emerald-900/60">{new Date(r.created_at).toLocaleString('id-ID')}</div></td>
                                <td>{r.product?.name ?? '-'}</td>
                                <td><div className="flex items-center gap-0.5 text-amber-500">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-3.5 fill-amber-400 stroke-amber-500" />)}</div></td>
                                <td className="max-w-md text-emerald-900/80">{r.comment}</td>
                                <td>{r.is_published ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Tampil</span> : <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">Disembunyikan</span>}</td>
                                <td className="space-x-2 py-2">
                                    <button onClick={() => toggle(r.id)} className="text-emerald-700 hover:underline">{r.is_published ? 'Sembunyikan' : 'Tampilkan'}</button>
                                    <button onClick={() => remove(r.id)} className="text-rose-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {reviews.data.length === 0 ? <tr><td colSpan={6} className="py-3 text-emerald-900/60">Belum ada ulasan.</td></tr> : null}
                    </tbody>
                </table>
                <DataPagination paginator={reviews} />
            </div>
        </>
    );
}
