<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Waste;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class WasteController extends Controller
{
    /**
     * POST /api/wastes/scan
     * Scan sampah baru dan masukkan ke collection (status: pending)
     */
    public function scan(Request $request): JsonResponse
    {
        $request->validate([
            'waste_type' => 'required|string',
            'weight'     => 'nullable|numeric|min:0.01',
            'scan_code'  => 'nullable|string',
        ]);

        $weight    = $request->weight ?? 0.5; // default 500g
        $wasteType = $request->waste_type;
        $reward    = Waste::calculateReward($wasteType, $weight);

        $waste = Waste::create([
            'user_id'      => Auth::id() ?? 1, // fallback for dev
            'waste_type'   => $wasteType,
            'weight'       => $weight,
            'status'       => 'pending',
            'reward_value' => $reward,
            'scan_code'    => $request->scan_code ?? 'SC-' . strtoupper(uniqid()),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sampah berhasil discan',
            'data'    => $waste,
        ], 201);
    }

    /**
     * GET /api/wastes/current
     * Ambil semua sampah yang belum di-exchange (pending + verified)
     */
    public function current(): JsonResponse
    {
        $userId = Auth::id() ?? 1;

        $wastes = Waste::where('user_id', $userId)
            ->whereIn('status', ['pending', 'verified'])
            ->orderBy('created_at', 'desc')
            ->get();

        $totalWeight = $wastes->sum('weight');
        $totalReward = $wastes->sum('reward_value');

        return response()->json([
            'success' => true,
            'data'    => [
                'items'        => $wastes,
                'total_weight' => round($totalWeight, 2),
                'total_reward' => round($totalReward, 2),
                'count'        => $wastes->count(),
            ],
        ]);
    }

    /**
     * POST /api/wastes/exchange
     * Tukarkan semua sampah pending/verified menjadi saldo
     */
    public function exchange(): JsonResponse
    {
        $userId = Auth::id() ?? 1;

        $wastes = Waste::where('user_id', $userId)
            ->whereIn('status', ['pending', 'verified'])
            ->get();

        if ($wastes->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada sampah yang bisa ditukar',
            ], 422);
        }

        $totalReward = $wastes->sum('reward_value');

        // Update semua waste ke status exchanged
        Waste::where('user_id', $userId)
            ->whereIn('status', ['pending', 'verified'])
            ->update(['status' => 'exchanged']);

        return response()->json([
            'success'      => true,
            'message'      => 'Sampah berhasil ditukar',
            'total_reward' => round($totalReward, 2),
            'items_count'  => $wastes->count(),
        ]);
    }

    /**
     * GET /api/wastes/history
     * Riwayat semua waste user
     */
    public function history(): JsonResponse
    {
        $userId = Auth::id() ?? 1;

        $wastes = Waste::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $wastes,
        ]);
    }
}