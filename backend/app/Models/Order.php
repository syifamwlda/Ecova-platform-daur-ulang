<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subtotal',
        'tax',
        'shipping_cost',
        'donation_amount',
        'total',
        'status',
        'coupon_code',
        'discount_amount',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'integer',
        'tax' => 'integer',
        'shipping_cost' => 'integer',
        'donation_amount' => 'integer',
        'total' => 'integer',
        'discount_amount' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}