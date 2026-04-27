import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TrackingIndex({ lookup }: { lookup?: string }) {
    const { data, setData, post, processing } = useForm({ number: lookup ?? '' });

    return (
        <>
            <Head title="Lacak Pesanan" />
            <div className="mx-auto max-w-md px-4 py-12">
                <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold text-emerald-950">Lacak Pesanan</h1>
                    <p className="mt-1 text-sm text-emerald-900/70">Masukkan nomor pesanan Anda untuk melihat status terbaru.</p>
                    <form onSubmit={(e) => {
 e.preventDefault(); post('/tracking'); 
}} className="mt-5 space-y-3">
                        <Input value={data.number} onChange={(e) => setData('number', e.target.value)} placeholder="Misal: CIVERS-260427-ABCDE" />
                        <Button type="submit" disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700">Cari Pesanan</Button>
                    </form>
                </div>
            </div>
        </>
    );
}
