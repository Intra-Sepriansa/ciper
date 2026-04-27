<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            ['key' => 'store_name', 'value' => 'Cidurian Riverside', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_tagline', 'value' => 'Makan Nyaman di Pinggir Sungai Cidurian', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_description', 'value' => 'Cafe & Resto pinggir Sungai Cidurian, Jasinga, Bogor. Dine-in, takeaway, dan delivery.', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_address', 'value' => 'Jl. Letnan Sayuti, Pamagersari, Jasinga, Kabupaten Bogor, Jawa Barat 16670', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_phone', 'value' => '081234567890', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_whatsapp', 'value' => '6281234567890', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_email', 'value' => 'hello@cidurianriverside.id', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_open_hours', 'value' => 'Senin - Minggu, 09.00 - 22.00 WIB', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_latitude', 'value' => '-6.4858', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'store_longitude', 'value' => '106.4486', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'tax_percent', 'value' => '0', 'group' => 'order', 'type' => 'int', 'is_public' => true],
            ['key' => 'service_percent', 'value' => '0', 'group' => 'order', 'type' => 'int', 'is_public' => true],
            ['key' => 'min_order_amount', 'value' => '15000', 'group' => 'order', 'type' => 'int', 'is_public' => true],
            ['key' => 'min_delivery_amount', 'value' => '30000', 'group' => 'order', 'type' => 'int', 'is_public' => true],
            ['key' => 'pending_payment_minutes', 'value' => '60', 'group' => 'order', 'type' => 'int', 'is_public' => false],
            ['key' => 'invoice_prefix', 'value' => 'CIVERS', 'group' => 'order', 'type' => 'string', 'is_public' => false],
            ['key' => 'enable_dine_in', 'value' => '1', 'group' => 'order', 'type' => 'bool', 'is_public' => true],
            ['key' => 'enable_takeaway', 'value' => '1', 'group' => 'order', 'type' => 'bool', 'is_public' => true],
            ['key' => 'enable_delivery', 'value' => '1', 'group' => 'order', 'type' => 'bool', 'is_public' => true],
            ['key' => 'enable_payment_midtrans', 'value' => '0', 'group' => 'payment', 'type' => 'bool', 'is_public' => true],
            ['key' => 'enable_payment_xendit', 'value' => '0', 'group' => 'payment', 'type' => 'bool', 'is_public' => true],
            ['key' => 'enable_payment_manual', 'value' => '1', 'group' => 'payment', 'type' => 'bool', 'is_public' => true],
            ['key' => 'enable_pay_at_store', 'value' => '1', 'group' => 'payment', 'type' => 'bool', 'is_public' => true],
            ['key' => 'manual_bank_name', 'value' => 'BCA', 'group' => 'payment', 'type' => 'string', 'is_public' => true],
            ['key' => 'manual_bank_account', 'value' => '1234567890', 'group' => 'payment', 'type' => 'string', 'is_public' => true],
            ['key' => 'manual_bank_holder', 'value' => 'Cidurian Riverside', 'group' => 'payment', 'type' => 'string', 'is_public' => true],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/cidurianriverside', 'group' => 'social', 'type' => 'string', 'is_public' => true],
            ['key' => 'social_gofood', 'value' => 'https://gofood.co.id', 'group' => 'social', 'type' => 'string', 'is_public' => true],
            ['key' => 'seo_meta_title', 'value' => 'Cidurian Riverside - Pesan Makanan Online Jasinga Bogor', 'group' => 'seo', 'type' => 'string', 'is_public' => true],
            ['key' => 'seo_meta_description', 'value' => 'Pesan menu favorit Cidurian Riverside, cafe & resto pinggir Sungai Cidurian di Jasinga Bogor. Tersedia dine-in, takeaway, dan delivery.', 'group' => 'seo', 'type' => 'string', 'is_public' => true],
            ['key' => 'seo_meta_keywords', 'value' => 'Cidurian Riverside, cafe Jasinga, restoran Jasinga, kuliner Bogor, cafe pinggir sungai', 'group' => 'seo', 'type' => 'string', 'is_public' => true],
        ];

        foreach ($defaults as $row) {
            Setting::put(
                $row['key'],
                $row['value'],
                $row['group'],
                $row['type'],
                $row['is_public'],
            );
        }
    }
}
