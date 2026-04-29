<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    /**
     * POST /api/payments
     * Buat transaksi penarikan saldo baru
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'method'             => 'required|in:dana,bank_transfer,voucher',
            'amount'             => 'required|numeric|min:10000',
            'destination_number' => 'required|string|min:6',
        ]);

        $payment = Payment::create([
            'user_id'            => Auth::id() ?? 1,
            'method'             => $request->method,
            'amount'             => $request->amount,
            'destination_number' => $request->destination_number,
            'status'             => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Penarikan berhasil diproses',
            'data'    => $payment,
        ], 201);
    }

    /**
     * GET /api/payments
     * Riwayat transaksi pembayaran user
     */
    public function index(): JsonResponse
    {
        $userId = Auth::id() ?? 1;

        $payments = Payment::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $payments,
        ]);
    }
}