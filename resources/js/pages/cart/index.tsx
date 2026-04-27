import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah, storageUrl } from '@/lib/format';
import type { CartSummary } from '@/types/storefront';

export default function CartIndex({ cart }: { cart: CartSummary }) {
    const updateQty = (id: number, qty: number) => router.patch(`/cart/${id}`, { quantity: qty }, { preserveScroll: true });
    const removeItem = (id: number) => router.delete(`/cart/${id}`, { preserveScroll: true });

    return (
        <>
            <Head title="Keranjang" />
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
                <div>
                    <h1 className="text-2xl font-semibold text-emerald-950">Keranjang</h1>
                    {cart.items.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-10 text-center">
                            <p className="text-sm text-emerald-900/70">Keranjang masih kosong.</p>
                            <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700"><Link href="/menu">Lihat Menu</Link></Button>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex gap-3 rounded-2xl border border-emerald-100 bg-white p-3">
                                    <img src={storageUrl(item.image_path)} alt={item.product_name} className="size-20 rounded-xl object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <Link href={`/menu/${item.product_slug}`} className="font-medium text-emerald-900 hover:underline">{item.product_name}</Link>
                                                {item.variant_name ? <div className="text-xs text-emerald-900/70">{item.variant_name}</div> : null}
                                                {item.note ? <div className="text-xs text-emerald-900/70">Catatan: {item.note}</div> : null}
                                                {item.addons && item.addons.length > 0 ? (
                                                    <div className="text-xs text-emerald-900/70">+ {item.addons.map((a) => a.name).join(', ')}</div>
                                                ) : null}
                                            </div>
                                            <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)} aria-label="Hapus">
                                                <Trash2 className="size-4 text-rose-500" />
                                            </Button>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="inline-flex items-center rounded-full border border-emerald-100 bg-white">
                                                <Button size="icon" variant="ghost" onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}><Minus className="size-4" /></Button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <Button size="icon" variant="ghost" onClick={() => updateQty(item.id, item.quantity + 1)}><Plus className="size-4" /></Button>
                                            </div>
                                            <div className="text-sm font-semibold text-emerald-700">{formatRupiah(item.subtotal)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="lg:sticky lg:top-20 h-fit">
                    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <h2 className="font-semibold text-emerald-900">Ringkasan</h2>
                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span>Subtotal ({cart.item_count} item)</span>
                            <span className="font-medium">{formatRupiah(cart.subtotal)}</span>
                        </div>
                        <p className="mt-1 text-xs text-emerald-900/60">Ongkir, pajak, dan voucher dihitung di checkout.</p>
                        <Button asChild disabled={cart.items.length === 0} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">
                            <Link href="/checkout">Checkout</Link>
                        </Button>
                        <div className="mt-3">
                            <Input placeholder="Kode voucher (opsional)" className="bg-white" disabled />
                            <p className="mt-1 text-[11px] text-emerald-900/60">Voucher diterapkan pada halaman checkout.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
