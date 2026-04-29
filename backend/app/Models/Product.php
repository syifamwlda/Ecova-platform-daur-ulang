<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'image',
        'description',
        'stock',
        'is_featured',
        'seller_name',
        'unit',
        'rating',
        'review_count',
        'badge',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
        'is_featured' => 'boolean',
        'rating' => 'float',
        'review_count' => 'integer',
    ];

    // Relasi ke order items
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scope: produk unggulan
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Scope: filter by category
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Format harga ke rupiah (opsional, bisa di frontend)
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }
}