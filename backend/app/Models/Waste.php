<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Waste extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'waste_type',
        'weight',
        'status',
        'reward_value',
        'co2_reduction',
        'tree_impact',
        'source',
        'qr_code_value',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
        'reward_value' => 'decimal:2',
        'co2_reduction' => 'decimal:4',
        'tree_impact' => 'decimal:4',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: hanya waste valid untuk dashboard
     */
    public function scopeValid($query)
    {
        return $query->whereIn('status', ['verified', 'exchanged']);
    }

    /**
     * Hitung reward berdasarkan tipe sampah
     */
    public static function calculateReward(string $wasteType, float $weight): float
    {
        $pricePerKg = match (strtolower($wasteType)) {
            'pet_plastik', 'pet botol', 'plastik pet' => 6000,
            'aluminum', 'aluminium', 'kaleng'         => 12000,
            'serat_kertas', 'kertas', 'kardus'        => 3000,
            'plastic_fiber', 'fiber plastik'          => 5500,
            default                                   => 4000,
        };

        return $pricePerKg * $weight;
    }

    /**
     * Auto calculate CO2, tree, reward
     */
    protected static function booted(): void
    {
        static::saving(function (Waste $waste) {
            if ($waste->isDirty('weight')) {
                $waste->co2_reduction = $waste->weight * 0.5;
                $waste->tree_impact   = $waste->weight * 0.02;

                if (!$waste->reward_value) {
                    $waste->reward_value = self::calculateReward(
                        $waste->waste_type,
                        $waste->weight
                    );
                }
            }
        });
    }
}