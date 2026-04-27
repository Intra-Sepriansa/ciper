import { Link } from '@inertiajs/react';

type Pagination = { current_page: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }> };

export default function DataPagination({ paginator }: { paginator: Pagination }) {
    if (paginator.last_page <= 1) {
return null;
}

    return (
        <div className="mt-4 flex flex-wrap gap-1">
            {paginator.links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? '#'}
                    preserveScroll
                    preserveState
                    className={`rounded-md px-3 py-1.5 text-sm ring-1 transition ${link.active ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-emerald-900 ring-emerald-100 hover:bg-emerald-50'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
