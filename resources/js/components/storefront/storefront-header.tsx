import { Link, usePage } from '@inertiajs/react';
import { Menu as MenuIcon, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { whatsappLink } from '@/lib/format';
import type { StorefrontPageProps } from '@/types/storefront';

const NAV = [
    { href: '/', label: 'Beranda' },
    { href: '/menu', label: 'Menu' },
    { href: '/gallery', label: 'Galeri' },
    { href: '/reservation', label: 'Reservasi' },
    { href: '/tracking', label: 'Lacak' },
    { href: '/contact', label: 'Kontak' },
];

export default function StorefrontHeader() {
    const { url, props } = usePage<StorefrontPageProps>();
    const [open, setOpen] = useState(false);
    const cartCount = props.cart_count ?? 0;
    const wa = whatsappLink(props.storefront?.store_whatsapp);

    return (
        <header className="sticky top-0 z-40 border-b border-emerald-100/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">CR</span>
                    <span className="hidden sm:flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-emerald-900">Cidurian Riverside</span>
                        <span className="text-[11px] text-emerald-700/70">Cafe & Resto Pinggir Sungai</span>
                    </span>
                </Link>

                <nav className="ml-auto hidden items-center gap-1 md:flex">
                    {NAV.map((item) => {
                        const isActive = url === item.href || (item.href !== '/' && url.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-full px-3 py-1.5 text-sm transition ${
                                    isActive ? 'bg-emerald-600 text-white' : 'text-emerald-900 hover:bg-emerald-50'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-2 md:ml-2">
                    <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                        <a href={wa} target="_blank" rel="noreferrer">
                            WhatsApp
                        </a>
                    </Button>
                    <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Link href="/cart" className="gap-1.5">
                            <ShoppingBag className="size-4" />
                            <span className="text-sm">{cartCount}</span>
                        </Link>
                    </Button>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <MenuIcon className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[80%] sm:max-w-sm">
                            <SheetTitle className="sr-only">Navigasi</SheetTitle>
                            <div className="mt-6 flex flex-col gap-1">
                                {NAV.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="rounded-lg px-3 py-2 text-base text-emerald-900 hover:bg-emerald-50"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <a href={wa} className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white">
                                    Hubungi Admin via WhatsApp
                                </a>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
