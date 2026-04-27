import AdminProductForm from './form';

type Product = {
    id: number;
    name: string;
    sku?: string | null;
    short_description?: string | null;
    description?: string | null;
    price: number;
    discount_price?: number | null;
    stock?: number;
    track_stock?: boolean;
    is_available?: boolean;
    is_popular?: boolean;
    is_recommended?: boolean;
    category_id: number | null;
    image_path?: string | null;
};

export default function AdminProductEdit({ product, categories }: { product: Product; categories: Array<{ id: number; name: string }> }) {
    return <AdminProductForm mode="edit" categories={categories} product={product} />;
}
