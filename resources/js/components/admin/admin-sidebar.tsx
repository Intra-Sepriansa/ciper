import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Image, LayoutDashboard, MessageSquare, Package, ShoppingCart, Sparkles, Tag, Truck, Users, Utensils } from 'lucide-react';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Pesanan', icon: ShoppingCart },
    { href: '/admin/products', label: 'Menu', icon: Utensils },
    { href: '/admin/categories', label: 'Kategori', icon: Tag },
    { href: '/admin/vouchers', label: 'Promo', icon: Sparkles },
    { href: '/admin/shipping', label: 'Ongkir', icon: Truck },
    { href: '/admin/reservations', label: 'Reservasi', icon: Package },
    { href: '/admin/customers', label: 'Pelanggan', icon: Users },
    { href: '/admin/reviews', label: 'Ulasan', icon: MessageSquare },
    { href: '/admin/galleries', label: 'Galeri', icon: Image },
    { href: '/admin/reports', label: 'Laporan', icon: BarChart3 },
    { href: '/admin/settings', label: 'Pengaturan', icon: Tag },
];

export default function AdminSidebar() {
    const { url } = usePage();

    return (
        <aside className="hidden w-60 shrink-0 border-r border-emerald-100 bg-white md:block">
            <div className="flex h-16 items-center gap-2 border-b border-emerald-100 px-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">CR</span>
                <span className="text-sm font-semibold text-emerald-900">Cidurian Admin</span>
            </div>
            <nav className="flex flex-col gap-0.5 p-2">
                {NAV.map((item) => {
                    const isActive = item.href === '/admin' ? url === '/admin' : url.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                                isActive ? 'bg-emerald-600 text-white' : 'text-emerald-900 hover:bg-emerald-50'
                            }`}
                        >
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
