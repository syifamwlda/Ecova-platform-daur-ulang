<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('wastes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');

    $table->string('waste_type'); // plastik, kertas, dll
    $table->decimal('weight', 10, 2); // kg

    $table->string('source')->default('manual'); // manual / scan
    $table->string('qr_code_value')->nullable(); // hasil scan QR

    $table->enum('status', ['pending', 'verified', 'rejected', 'exchanged'])
          ->default('pending');

    $table->decimal('reward_value', 10, 2)->default(0);
    $table->decimal('co2_reduction', 10, 4)->default(0);
    $table->decimal('tree_impact', 10, 4)->default(0);

    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('wastes');
    }
};
