<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();

            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();

            $table->enum('order_type', ['dine_in', 'takeaway', 'delivery'])->index();

            $table->dateTime('scheduled_at')->nullable();
            $table->unsignedInteger('guest_count')->nullable();
            $table->string('table_note')->nullable();
            $table->enum('dine_in_area', ['indoor', 'lesehan', 'riverside'])->nullable();

            $table->foreignId('shipping_address_id')->nullable()->constrained('shipping_addresses')->nullOnDelete();
            $table->string('shipping_courier')->nullable();
            $table->string('shipping_service')->nullable();
            $table->string('shipping_etd')->nullable();
            $table->unsignedBigInteger('shipping_cost')->default(0);
            $table->text('delivery_address_snapshot')->nullable();

            $table->unsignedBigInteger('subtotal')->default(0);
            $table->unsignedBigInteger('discount_total')->default(0);
            $table->unsignedBigInteger('tax_total')->default(0);
            $table->unsignedBigInteger('service_total')->default(0);
            $table->unsignedBigInteger('grand_total')->default(0);

            $table->foreignId('voucher_id')->nullable()->constrained('vouchers')->nullOnDelete();
            $table->string('voucher_code')->nullable();

            $table->enum('status', [
                'pending_payment',
                'paid',
                'processing',
                'ready_for_pickup',
                'delivering',
                'completed',
                'cancelled',
                'expired',
                'refunded',
            ])->default('pending_payment')->index();

            $table->enum('payment_status', [
                'unpaid', 'pending', 'paid', 'failed', 'expired', 'refunded',
            ])->default('unpaid')->index();

            $table->string('payment_method')->nullable();

            $table->text('customer_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->text('cancel_reason')->nullable();

            $table->string('tracking_token', 64)->unique();

            $table->timestamp('placed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            $table->json('meta')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index(['payment_status', 'created_at']);
        });

        Schema::create('order_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('product_name');
            $table->string('variant_name')->nullable();
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('unit_price');
            $table->unsignedBigInteger('subtotal');
            $table->json('addons')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('order_status_histories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_histories');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
