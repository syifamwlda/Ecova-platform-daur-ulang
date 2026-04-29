<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * POST /api/orders
     * Body: {
     *   items: [{ product_id, quantity }],
     *   coupon_code?: string,
     *   include_donation?: boolean,
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity'   => 'required|integer|min:1',
            'coupon_code'      => 'nullable|string|max:50',
            'include_donation' => 'nullable|boolean',
        ]);

        DB::beginTransaction();
        try {
            $subtotal        = 0;
            $resolvedItems   = [];

            foreach ($request->items as $item) {
                // Coba ambil dari DB, fallback ke harga dummy
                $product = Product::find($item['product_id']);
                $price   = $product ? $product->price : $this->getDummyPrice($item['product_id']);
                $qty     = $item['quantity'];
                $sub     = $price * $qty;
                $subtotal += $sub;

                $resolvedItems[] = [
                    'product_id' => $item['product_id'],
                    'quantity'   => $qty,
                    'price'      => $price,
                    'subtotal'   => $sub,
                ];
            }

            // Kupon sederhana — bisa dikembangkan
            $discount = 0;
            if ($request->filled('coupon_code')) {
                $discount = $this->applyCoupon($request->coupon_code, $subtotal);
            }

            $tax           = (int) round(($subtotal - $discount) * 0.1); // 10%
            $shippingCost  = $subtotal >= 200000 ? 0 : 0; // Gratis ongkir (sesuai desain)
            $donationAmount = $request->boolean('include_donation') ? 1500 : 0;
            $total          = $subtotal - $discount + $tax + $shippingCost + $donationAmount;

            $order = Order::create([
                'user_id'         => auth()->id() ?? 1, // fallback ke user 1 saat dev
                'subtotal'        => $subtotal,
                'tax'             => $tax,
                'shipping_cost'   => $shippingCost,
                'donation_amount' => $donationAmount,
                'total'           => $total,
                'status'          => 'pending',
                'coupon_code'     => $request->coupon_code,
                'discount_amount' => $discount,
            ]);

            foreach ($resolvedItems as $item) {
                OrderItem::create(array_merge($item, ['order_id' => $order->id]));
            }

            DB::commit();

            return response()->json([
                'message' => 'Order berhasil dibuat',
                'data'    => $order->load('items'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat order: ' . $e->getMessage()], 500);
        }
    }

    private function getDummyPrice(int $productId): int
    {
        $prices = [1=>6000, 2=>3500, 3=>25000, 4=>9000, 5=>75000, 6=>15000, 7=>5000, 8=>4500, 9=>10000, 10=>18000, 11=>12000];
        return $prices[$productId] ?? 10000;
    }

    private function applyCoupon(string $code, int $subtotal): int
    {
        // Contoh kupon statis — ganti dengan tabel coupons jika perlu
        return match(strtoupper($code)) {
            'ECORUK10' => (int) round($subtotal * 0.10),
            'HIJAU20'  => (int) round($subtotal * 0.20),
            'GRATIS'   => min($subtotal, 5000),
            default    => 0,
        };
    }
}