import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/sonner';
import type { StorefrontPageProps } from '@/types/storefront';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { props } = usePage<StorefrontPageProps>();

    useEffect(() => {
        if (props.flash?.success) {
toast.success(props.flash.success);
}

        if (props.flash?.error) {
toast.error(props.flash.error);
}

        if (props.flash?.info) {
toast.message(props.flash.info);
}
    }, [props.flash?.success, props.flash?.error, props.flash?.info]);

    return (
        <div className="flex min-h-screen bg-emerald-50/30">
            <AdminSidebar />
            <div className="flex min-h-screen flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-emerald-100 bg-white px-4">
                    <span className="text-sm font-medium text-emerald-900">Cidurian Riverside Admin</span>
                    <div className="ml-auto flex items-center gap-2 text-sm">
                        <Link href="/" className="rounded-md px-2 py-1 text-emerald-700 hover:bg-emerald-50">Lihat Toko</Link>
                        <span className="text-emerald-900/70">{props.auth?.user?.name}</span>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
            <Toaster />
        </div>
    );
}
