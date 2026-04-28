<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['voucher_id', 'customer_id', 'order_id', 'discount_amount'])]
class VoucherUsage extends Model
{
    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }
}
