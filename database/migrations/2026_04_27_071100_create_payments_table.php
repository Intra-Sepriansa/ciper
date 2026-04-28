<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('provider')->index();
            $table->string('method')->nullable();
            $table->string('provider_reference')->nullable()->index();
            $table->string('snap_token')->nullable();
            $table->string('payment_url', 1024)->nullable();
            $table->unsignedBigInteger('amount');
            $table->enum('status', ['unpaid', 'pending', 'paid', 'failed', 'expired', 'refunded'])
                ->default('unpaid')
                ->index();
            $table->string('proof_path')->nullable();
            $table->text('note')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('payment_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('payment_id')->nullable()->constrained('payments')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->cascadeOnDelete();
            $table->string('event');
            $table->string('source')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_logs');
        Schema::dropIfExists('payments');
    }
};
