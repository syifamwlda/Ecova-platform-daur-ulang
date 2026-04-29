<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Waste;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard
     * Mengembalikan semua data yang dibutuhkan Dashboard.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // ──────────────────────────────────────────
        // 1. Aggregate hanya waste valid milik user
        // ──────────────────────────────────────────
        $validWastes = Waste::valid()->where('user_id', $user->id);

        $totalWeight = (float) $validWastes->sum('weight');

        // CO2
        $co2Kg  = $totalWeight * 0.5;
        $co2Ton = $co2Kg / 1000;

        // Tree impact
        $treeImpact        = $totalWeight * 0.02;
        $treeImpactDisplay = (int) round($treeImpact);

        // Eco Credits – gunakan sum reward_value jika ada, fallback perhitungan
        $ecoCreditsFromDB = (float) $validWastes->sum('reward_value');
        $ecoCredits       = $ecoCreditsFromDB > 0 ? $ecoCreditsFromDB : $totalWeight * 20;

        // ──────────────────────────────────────────
        // 2. User stats (global)
        // ──────────────────────────────────────────
        $totalUsers  = User::count();
        $activeUsers = User::has('wastes')->count();

        // ──────────────────────────────────────────
        // 3. Waste by type (pie chart)
        // ──────────────────────────────────────────
        $wasteByType = Waste::valid()
            ->where('user_id', $user->id)
            ->select('waste_type', DB::raw('SUM(weight) as total_weight'))
            ->groupBy('waste_type')
            ->get()
            ->map(function ($row) use ($totalWeight) {
                $pct = $totalWeight > 0
                    ? round(($row->total_weight / $totalWeight) * 100, 1)
                    : 0;

                return [
                    'type'         => $row->waste_type,
                    'total_weight' => (float) $row->total_weight,
                    'percentage'   => $pct,
                ];
            });

        // ──────────────────────────────────────────
        // 4. Monthly analysis
        // ──────────────────────────────────────────
        $monthlyWeight   = (float) Waste::valid()
            ->where('user_id', $user->id)
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('weight');

        $monthlyTarget   = 20; // kg
        $monthlyProgress = min(($monthlyWeight / $monthlyTarget) * 100, 100);

        // ──────────────────────────────────────────
        // 5. Recent waste (5 terakhir)
        // ──────────────────────────────────────────
        $recentWaste = Waste::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'waste_type', 'weight', 'status', 'reward_value', 'created_at']);

        // ──────────────────────────────────────────
        // 6. Statistik Indonesia – HARDCODED sesuai requirement
        // ──────────────────────────────────────────
        $indonesiaStatistics = [
            ['year' => 2020, 'managed' => 19.2, 'unmanaged' => 10.1],
            ['year' => 2021, 'managed' => 20.1, 'unmanaged' => 9.8],
            ['year' => 2022, 'managed' => 24.7, 'unmanaged' => 12.9],
            ['year' => 2023, 'managed' => 22.1, 'unmanaged' => 10.9],
            ['year' => 2024, 'managed' => 22.2, 'unmanaged' => 11.8],
            ['year' => 2025, 'managed' => 20.5, 'unmanaged' => 13.9],
            ['year' => 2026, 'managed' => 23.6, 'unmanaged' => 15.0],
        ];

        return response()->json([
            'summary' => [
                'total_weight'       => $totalWeight,
                'co2_reduction_kg'   => $co2Kg,
                'co2_reduction_ton'  => round($co2Ton, 4),
                'tree_impact'        => round($treeImpact, 4),
                'tree_impact_display'=> $treeImpactDisplay,
                'eco_credits'        => round($ecoCredits, 2),
                'total_users'        => $totalUsers,
                'active_users'       => $activeUsers,
            ],
            'monthly' => [
                'weight'   => $monthlyWeight,
                'target'   => $monthlyTarget,
                'progress' => round($monthlyProgress, 1),
            ],
            'waste_by_type'        => $wasteByType,
            'indonesia_statistics' => $indonesiaStatistics,
            'recent_waste'         => $recentWaste,
            'user' => [
                'id'   => $user->id,
                'name' => $user->name,
            ],
        ]);
    }
}
