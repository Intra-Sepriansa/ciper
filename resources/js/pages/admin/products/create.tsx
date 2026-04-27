import AdminProductForm from './form';

export default function AdminProductCreate({ categories }: { categories: Array<{ id: number; name: string }> }) {
    return <AdminProductForm mode="create" categories={categories} product={null} />;
}
