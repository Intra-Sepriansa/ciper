import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminPageHeader from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Setting = { id: number; key: string; value: string | null; group: string; type: string; is_public: boolean };

type Settings = Record<string, Setting[]>;

const GROUP_LABELS: Record<string, string> = {
    general: 'Toko',
    order: 'Pesanan',
    payment: 'Pembayaran',
    shipping: 'Pengiriman',
    social: 'Sosial Media',
    seo: 'SEO',
};

export default function AdminSettingsIndex({ settings }: { settings: Settings }) {
    const flat = Object.values(settings).flat();
    const [values, setValues] = useState<Record<string, string>>(Object.fromEntries(flat.map((s) => [s.key, s.value ?? ''])));
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put(
            '/admin/settings',
            {
                settings: flat.map((s) => ({
                    key: s.key,
                    value: values[s.key] ?? '',
                    group: s.group,
                    type: s.type,
                    is_public: s.is_public,
                })),
            },
            { onFinish: () => setProcessing(false), preserveScroll: true },
        );
    };

    const update = (key: string, value: string) => setValues((cur) => ({ ...cur, [key]: value }));

    return (
        <>
            <Head title="Pengaturan" />
            <AdminPageHeader title="Pengaturan" description="Konfigurasi toko, pembayaran, ongkir, sosial media, dan SEO." />

            <form onSubmit={submit} className="space-y-6">
                {Object.keys(settings).map((group) => (
                    <section key={group} className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="text-sm font-semibold text-emerald-900">{GROUP_LABELS[group] ?? group}</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {settings[group].map((s) => (
                                <div key={s.id} className={s.type === 'text' ? 'sm:col-span-2' : ''}>
                                    <Label htmlFor={s.key} className="text-xs">{s.key}</Label>
                                    {s.type === 'text' ? (
                                        <textarea id={s.key} className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={values[s.key] ?? ''} onChange={(e) => update(s.key, e.target.value)} />
                                    ) : s.type === 'boolean' ? (
                                        <label className="mt-1 flex items-center gap-2 text-sm">
                                            <input type="checkbox" className="accent-emerald-600" checked={values[s.key] === '1' || values[s.key] === 'true'} onChange={(e) => update(s.key, e.target.checked ? '1' : '0')} />
                                            Aktif
                                        </label>
                                    ) : (
                                        <Input id={s.key} value={values[s.key] ?? ''} onChange={(e) => update(s.key, e.target.value)} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">Simpan Pengaturan</Button>
            </form>
        </>
    );
}
