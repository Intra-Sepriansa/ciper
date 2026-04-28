import { Link, usePage } from '@inertiajs/react';
import { whatsappLink } from '@/lib/format';
import type { StorefrontPageProps } from '@/types/storefront';

export default function StorefrontFooter() {
    const { props } = usePage<StorefrontPageProps>();
    const s = props.storefront ?? {};

    return (
        <footer className="border-t border-emerald-100 bg-emerald-50/40 mt-16">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">CR</span>
                        <span className="font-semibold text-emerald-900">{s.store_name ?? 'Cidurian Riverside'}</span>
                    </div>
                    <p className="text-sm text-emerald-900/70">{s.store_tagline ?? 'Makan Nyaman di Pinggir Sungai Cidurian'}</p>
                </div>
                <div className="text-sm text-emerald-900/80">
                    <h4 className="mb-2 font-semibold">Menu</h4>
                    <ul className="space-y-1.5">
                        <li><Link href="/menu" className="hover:underline">Lihat Menu</Link></li>
                        <li><Link href="/cart" className="hover:underline">Keranjang</Link></li>
                        <li><Link href="/tracking" className="hover:underline">Lacak Pesanan</Link></li>
                        <li><Link href="/reservation" className="hover:underline">Reservasi</Link></li>
                    </ul>
                </div>
                <div className="text-sm text-emerald-900/80">
                    <h4 className="mb-2 font-semibold">Tentang</h4>
                    <ul className="space-y-1.5">
                        <li><Link href="/about" className="hover:underline">Tentang Kami</Link></li>
                        <li><Link href="/gallery" className="hover:underline">Galeri</Link></li>
                        <li><Link href="/contact" className="hover:underline">Kontak</Link></li>
                    </ul>
                </div>
                <div className="text-sm text-emerald-900/80">
                    <h4 className="mb-2 font-semibold">Hubungi</h4>
                    <p className="leading-relaxed">{s.store_address ?? 'Jasinga, Bogor'}</p>
                    <p className="mt-2">{s.store_open_hours ?? 'Senin - Minggu, 09.00 - 22.00'}</p>
                    <a href={whatsappLink(s.store_whatsapp)} className="mt-2 inline-block font-medium text-emerald-700 hover:underline">
                        Chat WhatsApp
                    </a>
                </div>
            </div>
            <div className="border-t border-emerald-100/70 px-4 py-4 text-center text-xs text-emerald-900/60">
                © {new Date().getFullYear()} {s.store_name ?? 'Cidurian Riverside'}. Semua hak dilindungi.
            </div>
        </footer>
    );
}
