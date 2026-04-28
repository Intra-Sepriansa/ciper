import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import StorefrontFooter from '@/components/storefront/storefront-footer';
import StorefrontHeader from '@/components/storefront/storefront-header';
import WhatsappFab from '@/components/storefront/whatsapp-fab';
import { Toaster } from '@/components/ui/sonner';
import type { StorefrontPageProps } from '@/types/storefront';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
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
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white text-emerald-950">
            <StorefrontHeader />
            <main className="min-h-[60vh]">{children}</main>
            <StorefrontFooter />
            <WhatsappFab />
            <Toaster />
        </div>
    );
}
