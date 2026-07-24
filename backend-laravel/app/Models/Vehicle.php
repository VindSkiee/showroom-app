<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany, HasOne};

class Vehicle extends Model
{
    protected $fillable = [
        'name',
        'model',
        'license_plate',
        'type',
        'price',
        'year',
        'document_status',
        'document_note',
        'tax_status',
        'tax_expiry_year',
        'tax_expired_from',
        'defect_status',
        'availability_status',
        'stock',
        'stock_sold',
        'purchase_price',
        'promo_id',
    ];

    protected $casts = [
        'price' => 'integer',
        'year' => 'integer',
        'tax_expiry_year' => 'integer',
        'tax_expired_from' => 'integer',
        'stock' => 'integer',
        'stock_sold' => 'integer',
        'purchase_price' => 'integer',
    ];

    public function promo(): BelongsTo
    {
        return $this->belongsTo(Promo::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function defects(): HasMany
    {
        return $this->hasMany(DefectItem::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(VehicleImage::class);
    }

    public function video(): HasOne
    {
        return $this->hasOne(VehicleVideo::class);
    }
}
