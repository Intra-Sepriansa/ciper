import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah, storageUrl } from '@/lib/format';
import type { Product } from '@/types/storefront';

export default function ProductCard({ product }: { product: Product }) {
    const final = product.discount_price && product.discount_price < product.price ? product.discount_price : product.price;

    const addToCart = () => {
        router.post('/cart', { product_id: product.id, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/5">
            <Link href={`/menu/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-emerald-50">
                <img
                    src={storageUrl(product.image_path)}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                />
                {product.is_popular ? (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">Populer</span>
                ) : null}
                {product.discount_price && product.discount_price < product.price ? (
                    <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">Promo</span>
                ) : null}
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <Link href={`/menu/${product.slug}`} className="text-sm font-semibold text-emerald-950 line-clamp-1 hover:underline">
                    {product.name}
                </Link>
                <p className="text-xs text-emerald-900/70 line-clamp-2 min-h-[2rem]">{product.short_description ?? ''}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <div>
                        <div className="text-sm font-semibold text-emerald-700">{formatRupiah(final)}</div>
                        {product.discount_price && product.discount_price < product.price ? (
                            <div className="text-xs text-emerald-900/50 line-through">{formatRupiah(product.price)}</div>
                        ) : null}
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={addToCart}>
                        <Plus className="mr-1 size-4" /> Tambah
                    </Button>
                </div>
            </div>
        </div>
    );
}
