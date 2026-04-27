import { usePage } from '@inertiajs/react';
import { whatsappLink } from '@/lib/format';
import type { StorefrontPageProps } from '@/types/storefront';

export default function WhatsappFab() {
    const { props } = usePage<StorefrontPageProps>();
    const wa = whatsappLink(props.storefront?.store_whatsapp);

    return (
        <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-700"
            aria-label="Hubungi via WhatsApp"
        >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                <path d="M19.05 4.91A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.5 1.34 5.02L2 22l5.12-1.34A10 10 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.04-5.21-2.95-7.09zM12 20.13a8.13 8.13 0 0 1-4.16-1.13l-.3-.18-3.04.79.81-2.96-.2-.31A8.13 8.13 0 1 1 20.13 12 8.13 8.13 0 0 1 12 20.13zm4.5-6.07c-.25-.13-1.46-.72-1.69-.8-.23-.08-.39-.13-.55.13s-.63.8-.77.97c-.14.16-.28.18-.53.06-.25-.13-1.04-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.02-.39.11-.51.11-.11.25-.28.38-.42.13-.14.17-.24.25-.4.08-.16.04-.3-.02-.42-.06-.13-.55-1.34-.76-1.84-.2-.48-.41-.42-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.49.13.16 1.69 2.59 4.1 3.63 2.41 1.04 2.41.69 2.85.65.44-.04 1.46-.59 1.66-1.16.21-.58.21-1.07.14-1.16-.06-.1-.21-.16-.46-.29z" />
            </svg>
            <span className="hidden sm:inline">Hubungi Admin</span>
        </a>
    );
}
