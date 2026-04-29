<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * GET /api/products
     * Query params: category, featured, search, per_page
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        // Filter by category
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        // Filter featured only
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->integer('per_page', 12);
        $products = $query->orderByDesc('is_featured')->orderByDesc('created_at')->paginate($perPage);

        // Kalau tabel masih kosong, return dummy data
        if ($products->isEmpty() && !$request->filled('search') && !$request->filled('category')) {
            return response()->json([
                'data' => $this->dummyProducts(),
                'meta' => ['total' => 11, 'is_dummy' => true],
            ]);
        }

        return response()->json($products);
    }

    /**
     * GET /api/products/{id}
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            // Return dummy jika belum ada data
            $dummy = collect($this->dummyProducts())->firstWhere('id', $id);
            if ($dummy) {
                return response()->json(['data' => $dummy]);
            }
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }

        return response()->json(['data' => $product]);
    }

    /**
     * Dummy products — dipakai saat tabel masih kosong
     */
    private function dummyProducts(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Eco Paving Block',
                'category' => 'plastik',
                'price' => 6000,
                'image' => 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
                'description' => 'Paving block ramah lingkungan terbuat dari campuran plastik daur ulang dan semen. Kuat, tahan lama, dan membantu mengurangi sampah plastik.',
                'stock' => 500,
                'is_featured' => true,
                'seller_name' => 'PT ECHO MAJU',
                'unit' => 'pcs',
                'rating' => 4.5,
                'review_count' => 38,
                'badge' => null,
            ],
            [
                'id' => 2,
                'name' => 'Eco Fabric Keychain',
                'category' => 'tekstil',
                'price' => 3500,
                'image' => 'https://images.unsplash.com/photo-1629791960274-4ef8aef4c208?w=400&q=80',
                'description' => 'Gantungan kunci unik buatan tangan dari kain perca daur ulang. Setiap produk memiliki motif yang berbeda.',
                'stock' => 200,
                'is_featured' => true,
                'seller_name' => 'PT NANET',
                'unit' => 'pcs',
                'rating' => 4.2,
                'review_count' => 15,
                'badge' => null,
            ],
            [
                'id' => 3,
                'name' => 'Pupuk Organik Ramah Lingkungan',
                'category' => 'organik',
                'price' => 25000,
                'image' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
                'description' => 'Pupuk organik berkualitas dari bahan alami yang membantu menyuburkan tanah dan mendukung pertumbuhan tanaman secara optimal. Karung dari plastik recycle & bisa dipakai ulang.',
                'stock' => 150,
                'is_featured' => true,
                'seller_name' => 'EcoGrow',
                'unit' => 'kg',
                'rating' => 4.5,
                'review_count' => 50,
                'badge' => 'Best Seller',
            ],
            [
                'id' => 4,
                'name' => 'Dompet Mini EcoPouch',
                'category' => 'tekstil',
                'price' => 9000,
                'image' => 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&q=80',
                'description' => 'Dompet mini dari karung goni daur ulang. Ringan, unik, dan ramah lingkungan.',
                'stock' => 80,
                'is_featured' => false,
                'seller_name' => 'EcoKraft',
                'unit' => 'pcs',
                'rating' => 4.0,
                'review_count' => 22,
                'badge' => null,
            ],
            [
                'id' => 5,
                'name' => 'ToteBag EcoWeave',
                'category' => 'tekstil',
                'price' => 75000,
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
                'description' => 'Tas belanja dari anyaman serat daur ulang. Kuat menahan beban hingga 10kg.',
                'stock' => 60,
                'is_featured' => false,
                'seller_name' => 'WeaveGreen',
                'unit' => 'pcs',
                'rating' => 4.7,
                'review_count' => 33,
                'badge' => null,
            ],
            [
                'id' => 6,
                'name' => 'Figure Mini Pelajar',
                'category' => 'plastik',
                'price' => 15000,
                'image' => 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&q=80',
                'description' => 'Figur dekoratif mini dibuat dari plastik daur ulang. Cocok untuk hadiah atau koleksi.',
                'stock' => 120,
                'is_featured' => false,
                'seller_name' => 'ResinArt ID',
                'unit' => 'pcs',
                'rating' => 4.3,
                'review_count' => 18,
                'badge' => null,
            ],
            [
                'id' => 7,
                'name' => 'Tempat Koin',
                'category' => 'plastik',
                'price' => 5000,
                'image' => 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80',
                'description' => 'Celengan lucu berbentuk babi dari botol plastik daur ulang.',
                'stock' => 200,
                'is_featured' => false,
                'seller_name' => 'KidsEco',
                'unit' => 'pcs',
                'rating' => 4.1,
                'review_count' => 27,
                'badge' => null,
            ],
            [
                'id' => 8,
                'name' => 'Tempat Makan Burung',
                'category' => 'plastik',
                'price' => 4500,
                'image' => 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=400&q=80',
                'description' => 'Tempat makan burung dari botol plastik bekas. Mudah dipasang di taman.',
                'stock' => 300,
                'is_featured' => false,
                'seller_name' => 'GreenBird',
                'unit' => 'pcs',
                'rating' => 4.4,
                'review_count' => 12,
                'badge' => null,
            ],
            [
                'id' => 9,
                'name' => 'EcoFrame Kardus',
                'category' => 'kardus',
                'price' => 10000,
                'image' => 'https://images.unsplash.com/photo-1579762593175-20226054cad0?w=400&q=80',
                'description' => 'Bingkai foto dari kardus tebal daur ulang dengan motif bunga. Dekorasi unik dan ramah lingkungan.',
                'stock' => 90,
                'is_featured' => false,
                'seller_name' => 'KardusCraft',
                'unit' => 'pcs',
                'rating' => 4.6,
                'review_count' => 41,
                'badge' => null,
            ],
            [
                'id' => 10,
                'name' => 'Kompos Organik Premium',
                'category' => 'organik',
                'price' => 18000,
                'image' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
                'description' => 'Kompos siap pakai dari sampah organik rumah tangga yang diolah secara higienis.',
                'stock' => 250,
                'is_featured' => false,
                'seller_name' => 'BioCycle',
                'unit' => 'kg',
                'rating' => 4.5,
                'review_count' => 29,
                'badge' => null,
            ],
            [
                'id' => 11,
                'name' => 'Vas Bunga Kardus',
                'category' => 'kardus',
                'price' => 12000,
                'image' => 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
                'description' => 'Vas bunga artistik dari lapisan kardus yang diperkuat. Tahan air dengan lapisan khusus.',
                'stock' => 70,
                'is_featured' => false,
                'seller_name' => 'KardusCraft',
                'unit' => 'pcs',
                'rating' => 4.2,
                'review_count' => 19,
                'badge' => null,
            ],
        ];
    }
}