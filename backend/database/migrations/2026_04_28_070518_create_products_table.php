<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['plastik', 'tekstil', 'organik', 'kardus'])->default('plastik');
            $table->unsignedBigInteger('price'); // harga dalam rupiah
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->string('seller_name')->nullable();
            $table->string('unit')->default('pcs'); // pcs, kg, dll
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('review_count')->default(0);
            $table->string('badge')->nullable(); // "Best Seller", "New", dll
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};