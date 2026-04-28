import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatRupiah } from '@/lib/format';
import type { CartSummary, ShippingRate, StorefrontSettings } from '@/types/storefront';

type Props = {
    cart: CartSummary;
    shippingRates: ShippingRate[];
    storefront: StorefrontSettings;
    paymentMethods: Array<{ key: string; label: string }>;
};

type CheckoutForm = {
    customer: { name: string; phone: string; email: string };
    order_type: 'dine_in' | 'takeaway' | 'delivery';
    scheduled_at: string;
    guest_count: string;
    table_note: string;
    dine_in_area: 'indoor' | 'lesehan' | 'riverside';
    shipping_rate_id: string;
    delivery_address: { address_line: string; subdistrict: string };
    voucher_code: string;
    payment_method: string;
    customer_note: string;
};

export default function CheckoutIndex({ cart, shippingRates, paymentMethods }: Props) {
    const initialPayment = paymentMethods[0]?.key ?? 'manual';
    const { data, setData, post, processing, errors } = useForm<CheckoutForm>({
        customer: { name: '', phone: '', email: '' },
        order_type: 'takeaway',
        scheduled_at: '',
        guest_count: '',
        table_note: '',
        dine_in_area: 'indoor',
        shipping_rate_id: '',
        delivery_address: { address_line: '', subdistrict: '' },
        voucher_code: '',
        payment_method: initialPayment,
        customer_note: '',
    });

    const [activeStep, setActiveStep] = useState<'customer' | 'method' | 'payment'>('customer');

    const shippingCost = useMemo(() => {
        if (data.order_type !== 'delivery' || !data.shipping_rate_id) {
return 0;
}

        return shippingRates.find((r) => String(r.id) === String(data.shipping_rate_id))?.price ?? 0;
    }, [data.order_type, data.shipping_rate_id, shippingRates]);

    const grand = cart.subtotal + shippingCost;

    return (
        <>
            <Head title="Checkout" />
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
                <form onSubmit={(e) => {
 e.preventDefault(); post('/checkout'); 
}} className="space-y-6">
                    <h1 className="text-2xl font-semibold text-emerald-950">Checkout</h1>

                    <div className="flex gap-2 text-xs">
                        {(['customer', 'method', 'payment'] as const).map((step, i) => (
                            <button
                                key={step}
                                type="button"
                                onClick={() => setActiveStep(step)}
                                className={`flex-1 rounded-full px-3 py-2 ring-1 transition ${activeStep === step ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-emerald-900 ring-emerald-100'}`}
                            >
                                {i + 1}. {step === 'customer' ? 'Data Pemesan' : step === 'method' ? 'Metode Pesanan' : 'Pembayaran'}
                            </button>
                        ))}
                    </div>

                    {activeStep === 'customer' ? (
                        <section className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-5">
                            <div>
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" value={data.customer.name} onChange={(e) => setData('customer', { ...data.customer, name: e.target.value })} required />
                                {errors['customer.name'] ? <p className="mt-1 text-xs text-rose-600">{errors['customer.name']}</p> : null}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="phone">Nomor WhatsApp</Label>
                                    <Input id="phone" value={data.customer.phone} onChange={(e) => setData('customer', { ...data.customer, phone: e.target.value })} required />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email (opsional)</Label>
                                    <Input id="email" type="email" value={data.customer.email} onChange={(e) => setData('customer', { ...data.customer, email: e.target.value })} />
                                </div>
                            </div>
                            <Button type="button" onClick={() => setActiveStep('method')} className="bg-emerald-600 hover:bg-emerald-700">Lanjut</Button>
                        </section>
                    ) : null}

                    {activeStep === 'method' ? (
                        <section className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-5">
                            <Label>Metode Pesanan</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { v: 'dine_in', l: 'Dine-in' },
                                    { v: 'takeaway', l: 'Takeaway' },
                                    { v: 'delivery', l: 'Delivery' },
                                ].map((opt) => (
                                    <button
                                        type="button"
                                        key={opt.v}
                                        onClick={() => setData('order_type', opt.v as CheckoutForm['order_type'])}
                                        className={`rounded-xl border px-3 py-3 text-sm transition ${data.order_type === opt.v ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-emerald-100 bg-white text-emerald-900 hover:bg-emerald-50'}`}
                                    >
                                        {opt.l}
                                    </button>
                                ))}
                            </div>

                            {data.order_type === 'dine_in' ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="guest_count">Jumlah orang</Label>
                                        <Input id="guest_count" type="number" min={1} max={30} value={data.guest_count} onChange={(e) => setData('guest_count', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label htmlFor="dine_in_area">Area</Label>
                                        <select id="dine_in_area" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={data.dine_in_area} onChange={(e) => setData('dine_in_area', e.target.value as CheckoutForm['dine_in_area'])}>
                                            <option value="indoor">Indoor</option>
                                            <option value="lesehan">Lesehan</option>
                                            <option value="riverside">Riverside</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="scheduled_at">Tanggal & Jam</Label>
                                        <Input id="scheduled_at" type="datetime-local" value={data.scheduled_at} onChange={(e) => setData('scheduled_at', e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="table_note">Catatan meja</Label>
                                        <Input id="table_note" value={data.table_note} onChange={(e) => setData('table_note', e.target.value)} placeholder="Misal: dekat sungai" />
                                    </div>
                                </div>
                            ) : null}

                            {data.order_type === 'takeaway' ? (
                                <div>
                                    <Label htmlFor="scheduled_at">Jam ambil</Label>
                                    <Input id="scheduled_at" type="datetime-local" value={data.scheduled_at} onChange={(e) => setData('scheduled_at', e.target.value)} />
                                </div>
                            ) : null}

                            {data.order_type === 'delivery' ? (
                                <div className="grid gap-3">
                                    <div>
                                        <Label htmlFor="address_line">Alamat lengkap</Label>
                                        <Input id="address_line" value={data.delivery_address.address_line} onChange={(e) => setData('delivery_address', { ...data.delivery_address, address_line: e.target.value })} required />
                                    </div>
                                    <div>
                                        <Label htmlFor="subdistrict">Kelurahan / Desa</Label>
                                        <Input id="subdistrict" value={data.delivery_address.subdistrict} onChange={(e) => setData('delivery_address', { ...data.delivery_address, subdistrict: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Area pengiriman</Label>
                                        <div className="mt-2 grid gap-2">
                                            {shippingRates.map((rate) => (
                                                <label key={rate.id} className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm transition ${String(data.shipping_rate_id) === String(rate.id) ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-100 bg-white hover:bg-emerald-50'}`}>
                                                    <span className="flex items-center gap-2">
                                                        <input type="radio" className="accent-emerald-600" checked={String(data.shipping_rate_id) === String(rate.id)} onChange={() => setData('shipping_rate_id', String(rate.id))} />
                                                        <span>
                                                            <div className="font-medium">{rate.name}</div>
                                                            <div className="text-xs text-emerald-900/60">Min. order {formatRupiah(rate.min_order)} • {rate.etd_minutes ?? '-'} menit</div>
                                                        </span>
                                                    </span>
                                                    <span className="font-semibold text-emerald-700">{formatRupiah(rate.price)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div>
                                <Label htmlFor="customer_note">Catatan untuk admin</Label>
                                <Input id="customer_note" value={data.customer_note} onChange={(e) => setData('customer_note', e.target.value)} />
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setActiveStep('customer')}>Kembali</Button>
                                <Button type="button" onClick={() => setActiveStep('payment')} className="bg-emerald-600 hover:bg-emerald-700">Lanjut</Button>
                            </div>
                        </section>
                    ) : null}

                    {activeStep === 'payment' ? (
                        <section className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-5">
                            <Label>Metode Pembayaran</Label>
                            <div className="grid gap-2">
                                {paymentMethods.map((m) => (
                                    <label key={m.key} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${data.payment_method === m.key ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-100 bg-white hover:bg-emerald-50'}`}>
                                        <input type="radio" className="accent-emerald-600" checked={data.payment_method === m.key} onChange={() => setData('payment_method', m.key)} />
                                        <span>{m.label}</span>
                                    </label>
                                ))}
                            </div>
                            <div>
                                <Label htmlFor="voucher_code">Kode voucher (opsional)</Label>
                                <Input id="voucher_code" value={data.voucher_code} onChange={(e) => setData('voucher_code', e.target.value)} placeholder="CIVERS10" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setActiveStep('method')}>Kembali</Button>
                                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    Bayar Sekarang
                                </Button>
                            </div>
                        </section>
                    ) : null}
                </form>

                <aside className="lg:sticky lg:top-20 h-fit space-y-3">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="font-semibold text-emerald-900">Ringkasan Pesanan</h2>
                        <div className="mt-3 space-y-2">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-2 text-sm">
                                    <span className="min-w-0">
                                        <div className="line-clamp-1 font-medium">{item.product_name}</div>
                                        <div className="text-xs text-emerald-900/60">{item.quantity} × {formatRupiah(item.unit_price)}</div>
                                    </span>
                                    <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 space-y-1 border-t border-emerald-100 pt-3 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(cart.subtotal)}</span></div>
                            <div className="flex justify-between"><span>Ongkir</span><span>{formatRupiah(shippingCost)}</span></div>
                            <div className="flex justify-between border-t border-emerald-100 pt-2 text-base font-semibold text-emerald-900"><span>Total</span><span>{formatRupiah(grand)}</span></div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
