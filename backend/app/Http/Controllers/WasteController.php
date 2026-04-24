<?php

namespace App\Http\Controllers;

use App\Models\WasteLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WasteController extends Controller
{
    // INPUT SAMPAH
    public function store(Request $request)
    {
        $data = WasteLog::create([
            'user_id' => 1,
            'type' => $request->type,
            'weight' => $request->weight
        ]);

        return response()->json($data);
    }

    // DASHBOARD
    public function dashboard()
    {
        $totalWeight = WasteLog::sum('weight');

        $trees = $totalWeight * 0.02;
        $co2 = $totalWeight * 0.5;

        return response()->json([
            'total_weight' => $totalWeight,
            'trees' => $trees,
            'co2' => $co2,
            'user_count' => 1
        ]);
    }

    // ANALYTICS
    public function stats()
    {
    $data = DB::table('waste_logs')
        ->select('type', DB::raw('SUM(weight) as total'))
        ->groupBy('type')
        ->get();

    return response()->json($data);
    }
}