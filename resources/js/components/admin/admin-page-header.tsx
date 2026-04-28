export default function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
    return (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950">{title}</h1>
                {description ? <p className="text-sm text-emerald-900/70">{description}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">{actions}</div>
        </div>
    );
}
