import { Head, router } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah, storageUrl } from '@/lib/format';
import type { Product } from '@/types/storefront';

type Variant = { id: number; name: string; price_adjustment: number; is_default: boolean; is_available: boolean };
type Addon = { id: number; name: string; price: number; is_available: boolean };

type Props = {
    product: Product & { images?: Array<{ id: number; image_path: string }>; variants?: Variant[]; addons?: Addon[] };
    related: Product[];
};

export default function ProductShow({ product, related }: Props) {
    const [qty, setQty] = useState(1);
    const [variantId, setVariantId] = useState<number | null>(product.variants?.find((v) => v.is_default)?.id ?? null);
    const [addonIds, setAddonIds] = useState<number[]>([]);
    const [note, setNote] = useState('');

    const variant = product.variants?.find((v) => v.id === variantId);
    const finalPrice = (product.discount_price && product.discount_price < product.price ? product.discount_price : product.price)
        + (variant?.price_adjustment ?? 0)
        + (product.addons?.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0) ?? 0);

    const addToCart = () => {
        router.post(
            '/cart',
            { product_id: product.id, quantity: qty, variant_id: variantId, addon_ids: addonIds, note: note || undefined },
            { preserveScroll: true, onSuccess: () => router.visit('/cart') },
        );
    };

    return (
        <>
            <Head title={product.name} />
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="overflow-hidden rounded-3xl ring-1 ring-emerald-100 bg-emerald-50">
                        <img src={storageUrl(product.image_path)} alt={product.name} className="aspect-square w-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-emerald-950">{product.name}</h1>
                        <div className="mt-2 flex items-center gap-3">
                            <span className="text-2xl font-semibold text-emerald-700">{formatRupiah(finalPrice)}</span>
                            {product.discount_price && product.discount_price < product.price ? (
                                <span className="text-sm text-emerald-900/50 line-through">{formatRupiah(product.price)}</span>
                            ) : null}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-emerald-900/80">{product.description ?? product.short_description}</p>

                        {product.variants && product.variants.length > 0 ? (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-emerald-900">Varian</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setVariantId(v.id)}
                                            disabled={!v.is_available}
                                            className={`rounded-full border px-3 py-1.5 text-sm transition ${variantId === v.id ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-100 bg-white text-emerald-900 hover:bg-emerald-50'} disabled:opacity-50`}
                                        >
                                            {v.name}{v.price_adjustment ? ` (+${formatRupiah(v.price_adjustment)})` : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {product.addons && product.addons.length > 0 ? (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-emerald-900">Tambahan</h3>
                                <div className="mt-2 grid gap-2">
                                    {product.addons.map((a) => (
                                        <label key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm">
                                            <span className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={addonIds.includes(a.id)}
                                                    onChange={() => setAddonIds((cur) => cur.includes(a.id) ? cur.filter((i) => i !== a.id) : [...cur, a.id])}
                                                    className="size-4 accent-emerald-600"
                                                    disabled={!a.is_available}
                                                />
                                                <span>{a.name}</span>
                                            </span>
                                            <span className="text-emerald-700">+{formatRupiah(a.price)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-emerald-900">Catatan</h3>
                            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Misal: tidak pedas, sambal pisah" className="mt-2" />
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white">
                                <Button type="button" variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="size-4" /></Button>
                                <span className="w-8 text-center text-sm font-medium">{qty}</span>
                                <Button type="button" variant="ghost" size="icon" onClick={() => setQty((q) => Math.min(50, q + 1))}><Plus className="size-4" /></Button>
                            </div>
                            <Button onClick={addToCart} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                Tambah ke Keranjang • {formatRupiah(finalPrice * qty)}
                            </Button>
                        </div>
                    </div>
                </div>

                {related.length > 0 ? (
                    <section className="mt-14">
                        <h2 className="text-2xl font-semibold text-emerald-950">Rekomendasi Lain</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {related.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                ) : null}
            </div>
        </>
    );
}
