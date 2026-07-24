<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('model');
            $table->string('license_plate');
            $table->string('type'); // suv, sedan, mpv, hatchback, sport, lgcp, pickup, matic, manual
            $table->unsignedBigInteger('price');
            $table->unsignedSmallInteger('year');
            $table->string('document_status')->default('complete'); // complete, incomplete
            $table->text('document_note')->nullable();
            $table->string('tax_status')->default('unknown'); // active, expired, unknown
            $table->unsignedSmallInteger('tax_expiry_year')->nullable();
            $table->unsignedSmallInteger('tax_expired_from')->nullable();
            $table->string('defect_status')->default('none'); // none, minor, major
            $table->string('availability_status')->default('available'); // available, sold_out
            $table->unsignedInteger('stock')->default(1);
            $table->unsignedInteger('stock_sold')->default(0);
            $table->unsignedBigInteger('purchase_price')->nullable();
            $table->foreignId('promo_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index('type');
            $table->index('availability_status');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
