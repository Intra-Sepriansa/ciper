export type StorefrontSettings = {
    store_name?: string;
    store_tagline?: string;
    store_description?: string;
    store_address?: string;
    store_phone?: string;
    store_whatsapp?: string;
    store_email?: string;
    store_open_hours?: string;
    store_latitude?: string;
    store_longitude?: string;
    enable_dine_in?: boolean;
    enable_takeaway?: boolean;
    enable_delivery?: boolean;
    enable_payment_midtrans?: boolean;
    enable_payment_xendit?: boolean;
    enable_payment_manual?: boolean;
    enable_pay_at_store?: boolean;
    manual_bank_name?: string;
    manual_bank_account?: string;
    manual_bank_holder?: string;
    social_instagram?: string;
    social_gofood?: string;
    seo_meta_title?: string;
    seo_meta_description?: string;
    seo_meta_keywords?: string;
    [key: string]: unknown;
};

export type SharedAuth = {
    user: { id: number; name: string; email: string; phone?: string; avatar_path?: string } | null;
    roles?: string[];
    is_admin?: boolean;
};

export type SharedFlash = {
    success?: string | null;
    error?: string | null;
    info?: string | null;
};

export type StorefrontPageProps = {
    auth: SharedAuth;
    flash: SharedFlash;
    storefront: StorefrontSettings;
    cart_count: number;
    [key: string]: unknown;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    image_path?: string | null;
    description?: string | null;
};

export type Product = {
    id: number;
    name: string;
    slug: string;
    image_path?: string | null;
    short_description?: string | null;
    description?: string | null;
    price: number;
    discount_price?: number | null;
    is_popular?: boolean;
    is_recommended?: boolean;
    is_available?: boolean;
    category_id?: number;
    category?: { id: number; name: string; slug: string } | null;
    final_price?: number;
};

export type CartItem = {
    id: number;
    product_id: number;
    product_name: string;
    product_slug: string;
    image_path?: string | null;
    variant_id?: number | null;
    variant_name?: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
    addons?: Array<{ id: number; name: string; price: number }>;
    note?: string | null;
};

export type CartSummary = {
    id: number;
    subtotal: number;
    item_count: number;
    items: CartItem[];
};

export type ShippingRate = {
    id: number;
    name: string;
    area: string;
    price: number;
    etd_minutes?: number | null;
    min_order: number;
};

export type OrderTimelineEntry = {
    id: number;
    from_status?: string | null;
    to_status: string;
    note?: string | null;
    created_at: string;
    changed_by?: { id: number; name: string } | null;
};

export type OrderItem = {
    id: number;
    product_name: string;
    variant_name?: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
    note?: string | null;
};

export type OrderRecord = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string | null;
    order_type: string;
    status: string;
    payment_status: string;
    payment_method?: string | null;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    service_total: number;
    shipping_cost: number;
    grand_total: number;
    voucher_code?: string | null;
    customer_note?: string | null;
    items?: OrderItem[];
    status_histories?: OrderTimelineEntry[];
    placed_at?: string | null;
    created_at: string;
    paid_at?: string | null;
    expires_at?: string | null;
    shipping_service?: string | null;
    shipping_etd?: string | null;
    delivery_address_snapshot?: string | null;
    table_note?: string | null;
    dine_in_area?: string | null;
    guest_count?: number | null;
    scheduled_at?: string | null;
    [key: string]: unknown;
};
