import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ReservationIndex() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        reservation_date: '',
        reservation_time: '',
        guest_count: 2,
        area: 'lesehan' as 'indoor' | 'lesehan' | 'riverside',
        note: '',
    });

    return (
        <>
            <Head title="Reservasi Meja" />
            <div className="mx-auto max-w-2xl px-4 py-10">
                <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold text-emerald-950">Reservasi Meja</h1>
                    <p className="mt-1 text-sm text-emerald-900/70">Booking tempat untuk keluarga, ulang tahun, atau acara kecil.</p>
                    <form onSubmit={(e) => {
 e.preventDefault(); post('/reservation'); 
}} className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
                        </div>
                        <div>
                            <Label htmlFor="phone">WhatsApp</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="email">Email (opsional)</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="reservation_date">Tanggal</Label>
                            <Input id="reservation_date" type="date" value={data.reservation_date} onChange={(e) => setData('reservation_date', e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="reservation_time">Jam</Label>
                            <Input id="reservation_time" type="time" value={data.reservation_time} onChange={(e) => setData('reservation_time', e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="guest_count">Jumlah orang</Label>
                            <Input id="guest_count" type="number" min={1} max={30} value={data.guest_count} onChange={(e) => setData('guest_count', Number(e.target.value))} required />
                        </div>
                        <div>
                            <Label htmlFor="area">Area</Label>
                            <select id="area" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={data.area} onChange={(e) => setData('area', e.target.value as 'indoor' | 'lesehan' | 'riverside')}>
                                <option value="indoor">Indoor</option>
                                <option value="lesehan">Lesehan</option>
                                <option value="riverside">Riverside (pinggir sungai)</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <Label htmlFor="note">Catatan acara</Label>
                            <Input id="note" value={data.note} onChange={(e) => setData('note', e.target.value)} placeholder="Misal: ulang tahun, acara keluarga 10 orang" />
                        </div>
                        <Button type="submit" disabled={processing} className="sm:col-span-2 bg-emerald-600 hover:bg-emerald-700">
                            Kirim Reservasi
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
