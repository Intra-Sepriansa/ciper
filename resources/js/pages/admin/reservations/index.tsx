import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import DataPagination from '@/components/admin/data-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Reservation = {
    id: number;
    reservation_number: string;
    name: string;
    phone: string;
    reservation_date: string;
    reservation_time: string;
    guest_count: number;
    area: string;
    status: string;
    note?: string | null;
    admin_note?: string | null;
};

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

export default function AdminReservationsIndex({ reservations, filters }: { reservations: { data: Reservation[]; current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> }; filters: { status?: string } }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draft, setDraft] = useState<{ status: string; admin_note: string }>({ status: '', admin_note: '' });

    const setFilter = (status?: string) => router.get('/admin/reservations', { status: status || undefined }, { preserveState: true, preserveScroll: true });
    const startEdit = (r: Reservation) => {
 setEditingId(r.id); setDraft({ status: r.status, admin_note: r.admin_note ?? '' }); 
};
    const save = (id: number) => router.put(`/admin/reservations/${id}`, draft, { preserveScroll: true, onSuccess: () => setEditingId(null) });

    return (
        <>
            <Head title="Reservasi" />
            <AdminPageHeader title="Reservasi" description="Kelola reservasi meja & acara." />

            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                    {[{ v: '', l: 'Semua' }, ...STATUSES.map((s) => ({ v: s, l: s }))].map((opt) => (
                        <button key={opt.v} onClick={() => setFilter(opt.v || undefined)} className={`rounded-full px-3 py-1.5 text-sm transition ${(filters.status ?? '') === opt.v ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-900 ring-1 ring-emerald-100 hover:bg-emerald-50'}`}>{opt.l}</button>
                    ))}
                </div>
                <table className="w-full text-left text-sm">
                    <thead><tr className="text-xs uppercase text-emerald-900/60"><th className="py-2">Nomor</th><th>Pemesan</th><th>Jadwal</th><th>Tamu</th><th>Area</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                        {reservations.data.map((r) => (
                            <tr key={r.id} className="border-t border-emerald-100/70 align-top">
                                <td className="py-2 font-medium">{r.reservation_number}</td>
                                <td>{r.name}<div className="text-xs text-emerald-900/60">{r.phone}</div></td>
                                <td>{r.reservation_date} {r.reservation_time}</td>
                                <td>{r.guest_count}</td>
                                <td>{r.area}</td>
                                <td>
                                    {editingId === r.id ? (
                                        <select className="h-8 rounded-md border border-input bg-background px-2 text-xs" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    ) : (
                                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs">{r.status}</span>
                                    )}
                                </td>
                                <td className="space-y-1 py-2 text-right">
                                    {editingId === r.id ? (
                                        <div className="flex flex-col gap-1">
                                            <Input value={draft.admin_note} onChange={(e) => setDraft({ ...draft, admin_note: e.target.value })} placeholder="Catatan admin" className="text-xs" />
                                            <div className="flex gap-1">
                                                <Button size="sm" onClick={() => save(r.id)} className="bg-emerald-600 hover:bg-emerald-700">Simpan</Button>
                                                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Batal</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => startEdit(r)} className="text-emerald-700 hover:underline">Update</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {reservations.data.length === 0 ? <tr><td colSpan={7} className="py-3 text-emerald-900/60">Belum ada reservasi.</td></tr> : null}
                    </tbody>
                </table>
                <DataPagination paginator={reservations} />
            </div>
        </>
    );
}
