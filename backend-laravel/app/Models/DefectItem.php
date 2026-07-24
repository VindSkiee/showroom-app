<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};

class DefectItem extends Model
{
    protected $fillable = [
        'vehicle_id',
        'car_id',
        'part',
        'description',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(DefectItemImage::class);
    }
}
