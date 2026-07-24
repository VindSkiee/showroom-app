<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    protected $fillable = [
        'sale_date',
        'sale_price',
        'buyer_name',
        'quantity',
        'vehicle_id',
        'car_id',
    ];

    protected $casts = [
        'sale_date' => 'date',
        'sale_price' => 'integer',
        'quantity' => 'integer',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
